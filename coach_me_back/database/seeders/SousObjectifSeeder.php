<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SousObjectifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sous_objectifs')->insert([
            // Objectif 1 : Améliorer la communication
            [
                'objectif_id' => 1,
                'titre' => 'Faire un atelier d\'écoute active',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objectif_id' => 1,
                'titre' => 'Mettre en place un feedback hebdomadaire',
                'statut' => 'Terminé',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Objectif 2 : Gérer le stress
            [
                'objectif_id' => 2,
                'titre' => 'Suivre une séance de méditation',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objectif_id' => 2,
                'titre' => 'Tenir un journal quotidien',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Objectif 3 : Gestion du temps
            [
                'objectif_id' => 3,
                'titre' => 'Créer une to-do list chaque matin',
                'statut' => 'Terminé',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objectif_id' => 3,
                'titre' => 'Utiliser la méthode Pomodoro',
                'statut' => 'Terminé',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Objectif 4 : Discipline
            [
                'objectif_id' => 4,
                'titre' => 'Établir une routine matinale',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objectif_id' => 4,
                'titre' => 'Éviter les distractions numériques',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Objectif 5 : Organisation
            [
                'objectif_id' => 5,
                'titre' => 'Réorganiser l’espace de travail',
                'statut' => 'Terminé',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objectif_id' => 5,
                'titre' => 'Planifier la semaine chaque dimanche',
                'statut' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
