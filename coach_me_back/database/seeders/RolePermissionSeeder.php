<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $coach = Role::firstOrCreate(['name' => 'coach']);
        $coachee = Role::firstOrCreate(['name' => 'coache']);

        // Création des permissions
        $permissions = [
            'create session',
            'view reports',
            'manage users',
            'view profile',
            'edit profile',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Attribution des permissions aux rôles
        $admin->givePermissionTo(Permission::all());
        $coach->givePermissionTo(['create session', 'view reports']);
        $coachee->givePermissionTo(['view profile', 'edit profile']);
    }
}
