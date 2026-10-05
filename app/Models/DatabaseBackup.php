<?php

namespace App\Models;

use App\Enums\DatabaseBackupStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DatabaseBackup extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'filename',
        'path',
        'status',
        'file_size',
        'error_message',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => DatabaseBackupStatus::class,
            'file_size' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isDownloadable(): bool
    {
        return $this->status === DatabaseBackupStatus::Completed
            && filled($this->path)
            && Storage::disk('local')->exists($this->path);
    }

    public function deleteFile(): void
    {
        if (filled($this->path) && Storage::disk('local')->exists($this->path)) {
            Storage::disk('local')->delete($this->path);
        }
    }
}
