<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorieSeeder extends Seeder
{
    public function run()
    {
        // Liste des catégories liées au développement personnel
        $categories = [
            [
                'nom' => 'Développement personnel',
                'description' => 'Amélioration des compétences personnelles et de la connaissance de soi.',
            ],
            [
                'nom' => 'Gestion du stress',
                'description' => 'Techniques et outils pour mieux gérer le stress au quotidien.',
            ],
            [
                'nom' => 'Confiance en soi',
                'description' => 'Renforcer l’estime et l’assurance personnelle.',
            ],
            [
                'nom' => 'Communication',
                'description' => 'Développer des compétences en communication interpersonnelle.',
            ],
            [
                'nom' => 'Productivité',
                'description' => 'Améliorer la gestion du temps et l’efficacité.',
            ],
            [
                'nom' => 'Leadership',
                'description' => 'Développer les qualités de leader et de prise d’initiative.',
            ],
            [
                'nom' => 'Équilibre vie pro/perso',
                'description' => 'Trouver l’harmonie entre vie professionnelle et personnelle.',
            ],
        ];

        // Insertion dans la base de données
        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'nom' => $category['nom'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
