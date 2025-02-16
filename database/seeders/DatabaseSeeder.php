<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Kasir 1',
            'email' => 'kasir1@apotek.app',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@apotek.app',
            'role' => UserRole::ADMIN->value,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);
    }
}
