<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Abonnement;
use App\Models\Ressource;

class PaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $abonnementIds = Abonnement::pluck('id')->toArray();
        $ressourceIds = Ressource::pluck('id')->toArray();

        foreach (range(1, 10) as $index) {
            DB::table('paiements')->insert([
                'abonnement_id' => $faker->randomElement($abonnementIds),
                'ressource_id' => $faker->randomElement($ressourceIds),
                'montant' => $faker->randomFloat(2, 100, 1000),
                'date_paiement' => $faker->date(),
                'methode' => $faker->randomElement(['cache', 'virement']),
                'statut' => $faker->randomElement(['payé', 'en attente', 'annulé']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
