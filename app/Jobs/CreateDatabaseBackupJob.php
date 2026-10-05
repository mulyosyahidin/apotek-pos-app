<?php

namespace App\Jobs;

use App\Enums\DatabaseBackupStatus;
use App\Models\DatabaseBackup;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Throwable;
use ZipArchive;

class CreateDatabaseBackupJob implements ShouldQueue
{
    use Queueable;

    public int $timeout = 900;

    public int $tries = 1;

    public function __construct(public DatabaseBackup $backup) {}

    public function handle(): void
    {
        $this->backup->update([
            'status' => DatabaseBackupStatus::Processing,
            'error_message' => null,
        ]);

        $connectionName = config('database.default');
        $connection = config("database.connections.{$connectionName}");

        if (! in_array($connection['driver'] ?? null, ['mysql', 'mariadb'], true)) {
            throw new \RuntimeException('Backup saat ini hanya mendukung database MySQL/MariaDB.');
        }

        $directory = 'backups/database';
        Storage::disk('local')->makeDirectory($directory);

        $sqlFilename = pathinfo($this->backup->filename, PATHINFO_FILENAME).'.sql';
        $sqlRelativePath = $directory.'/'.$sqlFilename;
        $sqlAbsolutePath = Storage::disk('local')->path($sqlRelativePath);
        $zipAbsolutePath = Storage::disk('local')->path($this->backup->path);

        $process = new Process($this->buildDumpCommand($connection, $sqlAbsolutePath));
        $process->setTimeout(840);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new \RuntimeException(
                trim($process->getErrorOutput() ?: $process->getOutput()) ?: 'mysqldump gagal dijalankan.'
            );
        }

        $zip = new ZipArchive;

        if ($zip->open($zipAbsolutePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Gagal membuat file ZIP backup.');
        }

        $zip->addFile($sqlAbsolutePath, $sqlFilename);
        $zip->close();

        Storage::disk('local')->delete($sqlRelativePath);

        if (! Storage::disk('local')->exists($this->backup->path)) {
            throw new \RuntimeException('File ZIP backup tidak ditemukan setelah dibuat.');
        }

        $this->backup->update([
            'status' => DatabaseBackupStatus::Completed,
            'file_size' => Storage::disk('local')->size($this->backup->path),
            'completed_at' => now(),
            'error_message' => null,
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        $this->backup->update([
            'status' => DatabaseBackupStatus::Failed,
            'error_message' => $exception?->getMessage(),
        ]);

        $this->backup->deleteFile();
    }

    /**
     * @param  array<string, mixed>  $connection
     * @return list<string>
     */
    private function buildDumpCommand(array $connection, string $backupPath): array
    {
        $command = [
            config('services.database_backup.mysqldump_path', 'mysqldump'),
            '--single-transaction',
            '--quick',
            '--routines',
            '--triggers',
            '--events',
            '--host='.$connection['host'],
            '--port='.(string) $connection['port'],
            '--user='.$connection['username'],
            '--result-file='.$backupPath,
        ];

        if (filled($connection['password'] ?? null)) {
            $command[] = '--password='.$connection['password'];
        }

        if (filled($connection['unix_socket'] ?? null)) {
            $command[] = '--socket='.$connection['unix_socket'];
        }

        $command[] = $connection['database'];

        return $command;
    }
}
