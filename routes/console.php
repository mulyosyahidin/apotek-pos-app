<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('backup:database-to-telegram')
    ->dailyAt('00:00')
    ->timezone(config('services.database_backup.timezone', 'Asia/Jakarta'))
    ->withoutOverlapping();
