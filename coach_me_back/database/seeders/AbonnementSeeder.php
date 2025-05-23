<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AbonnementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer quelques coachs (users)
        $coaches = DB::table('users')->where('role', 'coache')->pluck('id');

        // Récupérer les plans existants
        $plans = DB::table('plans')->pluck('id');

        foreach ($coaches as $coachId) {
            DB::table('abonnements')->insert([
                'coache_id' => $coachId,
                'plan_id' => $plans->random(),
                'date_debut' => Carbon::now(),
                'date_fin' => Carbon::now()->addMonth(),
                'statut' => 'actif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
