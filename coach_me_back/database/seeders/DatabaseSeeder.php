<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Appel des seeders dans l'ordre souhaité
        $this->call([
            RolePermissionSeeder::class,
            UserSeeder::class,
            CategorieSeeder::class,
            PlanSeeder::class,
            RessourceSeeder::class
        ]);
    }
}
