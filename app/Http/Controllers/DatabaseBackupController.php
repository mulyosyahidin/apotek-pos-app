<?php

namespace App\Http\Controllers;

use App\Enums\DatabaseBackupStatus;
use App\Jobs\CreateDatabaseBackupJob;
use App\Models\DatabaseBackup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Number;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DatabaseBackupController extends Controller
{
    public function index(): Response
    {
        $backups = DatabaseBackup::query()
            ->latest()
            ->get()
            ->values()
            ->map(fn (DatabaseBackup $backup, int $index) => [
                'id' => $backup->id,
                'number' => $index + 1,
                'filename' => $backup->filename,
                'file_size' => $backup->file_size,
                'file_size_label' => $backup->file_size !== null
                    ? Number::fileSize($backup->file_size)
                    : null,
                'status' => $backup->status->value,
                'status_label' => $backup->status->label(),
                'created_at' => $backup->created_at?->toIso8601String(),
                'can_download' => $backup->isDownloadable(),
            ]);

        return Inertia::render('Backups/Index', [
            'items' => $backups,
            'hasInProgress' => $backups->contains(
                fn (array $backup) => in_array($backup['status'], [
                    DatabaseBackupStatus::Pending->value,
                    DatabaseBackupStatus::Processing->value,
                ], true)
            ),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(): RedirectResponse
    {
        $hasInProgress = DatabaseBackup::query()
            ->whereIn('status', [
                DatabaseBackupStatus::Pending,
                DatabaseBackupStatus::Processing,
            ])
            ->exists();

        if ($hasInProgress) {
            return redirect()
                ->route('backups.index')
                ->with('error', 'Backup masih diproses. Tunggu hingga selesai sebelum membuat backup baru.');
        }

        DatabaseBackup::query()
            ->orderBy('id')
            ->each(function (DatabaseBackup $backup) {
                $backup->deleteFile();
                $backup->delete();
            });

        $database = config('database.connections.'.config('database.default').'.database');
        $filename = sprintf('%s_%s.zip', $database, now()->format('Ymd_His'));
        $path = 'backups/database/'.$filename;

        $backup = DatabaseBackup::query()->create([
            'user_id' => auth()->id(),
            'filename' => $filename,
            'path' => $path,
            'status' => DatabaseBackupStatus::Pending,
        ]);

        CreateDatabaseBackupJob::dispatch($backup);

        return redirect()
            ->route('backups.index')
            ->with('success', 'Backup sedang diproses di latar belakang.');
    }

    public function download(DatabaseBackup $backup): StreamedResponse
    {
        abort_unless($backup->isDownloadable(), 404);

        return Storage::disk('local')->download($backup->path, $backup->filename);
    }
}
