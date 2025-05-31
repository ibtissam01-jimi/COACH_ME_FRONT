<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanRessourceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('plan_ressources')->insert([
            [
                'plan_id' => 1,
                'ressource_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => 1,
                'ressource_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => 2,
                'ressource_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => 2,
                'ressource_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => 3,
                'ressource_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'plan_id' => 3,
                'ressource_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'plan_id' => 4,
                'ressource_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'plan_id' => 4,
                'ressource_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
