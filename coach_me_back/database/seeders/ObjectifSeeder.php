<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ObjectifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assurez-vous que les utilisateurs avec ID 1 et 2 existent.
        DB::table('objectifs')->insert([
            [
                'dedie_a' => 1,
                'creer_par' => 2,
                'titre' => 'Améliorer la communication',
                'statut' => 'En cours',
                'progression' => 35.5,
                'date_debut' => Carbon::now()->subDays(10),
                'date_fin' => Carbon::now()->addDays(20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'dedie_a' => 2,
                'creer_par' => 1,
                'titre' => 'gerer le stress',
                'statut' => 'En cours',
                'progression' => 50,
                'date_debut' => Carbon::now()->subDays(5),
                'date_fin' => Carbon::now()->addDays(15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'dedie_a' => 1,
                'creer_par' => 1,
                'titre' => 'gestion de temps',
                'statut' => 'Terminé',
                'progression' => 100,
                'date_debut' => Carbon::now()->subDays(30),
                'date_fin' => Carbon::now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'dedie_a' => 2,
                'creer_par' => 2,
                'titre' => 'Descipline',
                'statut' => 'En cours',
                'progression' => 20,
                'date_debut' => Carbon::now(),
                'date_fin' => Carbon::now()->addDays(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'dedie_a' => 1,
                'creer_par' => 2,
                'titre' => 'organisation',
                'statut' => 'En cours',
                'progression' => 75,
                'date_debut' => Carbon::now()->subDays(7),
                'date_fin' => Carbon::now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
