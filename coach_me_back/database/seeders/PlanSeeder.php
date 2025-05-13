<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;
use App\Models\Categories;

class PlanSeeder extends Seeder
{
    public function run()
    {
        // Vérifie que les catégories existent
        $developpementPerso = Categories::where('nom', 'Développement personnel')->first();
        $gestionStress = Categories::where('nom', 'Gestion du stress')->first();
        $confianceSoi = Categories::where('nom', 'Confiance en soi')->first();
        $leadership = Categories::where('nom', 'Leadership')->first();

        // Création des plans
        $plan1 = Plan::create([
            'titre' => 'Plan Essentiel',
            'description' => 'Un plan de base pour commencer le développement personnel.',
            'prix' => 29.99,
            'duree' => 30,
            'categorie_id' => $developpementPerso?->id,
        ]);

        $plan2 = Plan::create([
            'titre' => 'Plan Zen',
            'description' => 'Un programme complet pour réduire le stress et retrouver la sérénité.',
            'prix' => 49.99,
            'duree' => 45,
            'categorie_id' => $gestionStress?->id,
        ]);

        $plan3 = Plan::create([
            'titre' => 'Boost Confiance',
            'description' => 'Un plan pour renforcer la confiance en soi au quotidien.',
            'prix' => 59.99,
            'duree' => 60,
            'categorie_id' => $confianceSoi?->id,
        ]);

        $plan4 = Plan::create([
            'titre' => 'Leader Pro',
            'description' => 'Pour ceux qui souhaitent développer leurs qualités de leadership.',
            'prix' => 89.99,
            'duree' => 90,
            'categorie_id' => $leadership?->id,
        ]);
    }
}
