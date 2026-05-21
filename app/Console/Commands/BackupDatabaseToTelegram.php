<?php

namespace App\Console\Commands;

use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class BackupDatabaseToTelegram extends Command
{
    protected $signature = 'backup:database-to-telegram';

    protected $description = 'Backup database ke file SQL dan kirim hasilnya ke channel Telegram.';

    public function handle(): int
    {
        $connectionName = config('database.default');
        $connection = config("database.connections.{$connectionName}");

        if (! in_array($connection['driver'] ?? null, ['mysql', 'mariadb'], true)) {
            $this->error('Backup otomatis saat ini hanya mendukung database MySQL/MariaDB.');

            return self::FAILURE;
        }

        $botToken = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (blank($botToken) || blank($chatId)) {
            $this->error('TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID wajib diisi.');

            return self::FAILURE;
        }

        $backupDirectory = storage_path('app/backups/database');

        if (! is_dir($backupDirectory) && ! mkdir($backupDirectory, 0755, true)) {
            $this->error("Gagal membuat folder backup: {$backupDirectory}");

            return self::FAILURE;
        }

        $database = $connection['database'];
        $filename = sprintf('%s_%s.sql', $database, now()->format('Ymd_His'));
        $backupPath = $backupDirectory.DIRECTORY_SEPARATOR.$filename;

        $process = new Process($this->buildDumpCommand($connection, $backupPath));
        $process->setTimeout(600);
        $process->run();

        if (! $process->isSuccessful()) {
            $this->error('Backup database gagal.');
            $this->line($process->getErrorOutput() ?: $process->getOutput());

            return self::FAILURE;
        }

        $response = Telegraph::bot($botToken)
            ->chat($chatId)
            ->message("[ApotekPosApp] Backup database {$database} - ".now()->format('d/m/Y H:i:s'))
            ->document($backupPath, $filename)
            ->send();

        if ($response->telegraphError()) {
            $this->error('Gagal mengirim backup ke Telegram.');
            $this->line($response->body());

            return self::FAILURE;
        }

        $this->info("Backup database berhasil dikirim ke Telegram: {$filename}");

        return self::SUCCESS;
    }

    /**
     * @param  array<string, mixed>  $connection
     * @return array<int, string>
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
