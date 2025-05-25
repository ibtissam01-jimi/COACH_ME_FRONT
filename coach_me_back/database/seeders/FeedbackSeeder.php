<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class FeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('feedback')->insert([
            [
                'user_id' => 1,
                'commentaire' => 'Très bonne expérience avec l\'application.',
                'note' => 5,
                'statut' => 'Lu',
                'date_feedback' => Carbon::now()->subDays(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'commentaire' => 'L\'interface est intuitive et facile à utiliser.',
                'note' => 4,
                'statut' => 'Non Lu',
                'date_feedback' => Carbon::now()->subDays(3),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'commentaire' => 'des meilleurs coachs!.',
                'note' => 3,
                'statut' => 'Lu',
                'date_feedback' => Carbon::now()->subDays(2),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'commentaire' => 'Support client réactif et efficace.',
                'note' => 5,
                'statut' => 'Lu',
                'date_feedback' => Carbon::now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'commentaire' => 'Je recommande cette plateforme à mes amis.',
                'note' => 4,
                'statut' => 'Non Lu',
                'date_feedback' => Carbon::now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
