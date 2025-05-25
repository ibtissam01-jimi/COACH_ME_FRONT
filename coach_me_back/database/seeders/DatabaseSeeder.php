<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Abonnement;
use App\Models\Ressource;

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
            RessourceSeeder::class,
            AbonnementSeeder::class,
            PaiementSeeder::class,
            FeedbackSeeder::class,
            ObjectifSeeder::class,
            SousObjectifSeeder::class
        ]);
    }
}
