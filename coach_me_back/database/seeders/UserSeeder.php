<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Création des rôles s'ils n'existent pas
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $coachRole = Role::firstOrCreate(['name' => 'coach']);
        $coacheRole = Role::firstOrCreate(['name' => 'coache']);

        // Création d'un administrateur
        $admin = User::create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'email' => 'admin@coachme.com',
            'password' => Hash::make('password'),
            'dateNaissance' => '1990-01-01',
            'telephone' => '0600000000',
            'adresse' => '123 Rue Admin',
            'genre' => 'Homme',
            'photo' => 'https://example.com/default-admin.jpg',
            'statut' => 'Actif',
            'situation_familliale' => 'Célibataire',
            'role' => 'admin',
            'email_verified_at' => now()
        ]);
        $admin->assignRole($adminRole);

        // Création d'un coach
        $coach = User::create([
            'nom' => 'Coach',
            'prenom' => 'Test',
            'email' => 'coach@coachme.com',
            'password' => Hash::make('password'),
            'dateNaissance' => '1985-05-15',
            'telephone' => '0600000001',
            'adresse' => '456 Rue Coach',
            'genre' => 'Femme',
            'photo' => 'https://example.com/default-coach.jpg',
            'statut' => 'Actif',
            'situation_familliale' => 'Marié',
            'role' => 'coach',
            'email_verified_at' => now()
        ]);
        $coach->assignRole($coachRole);

        // Création d'un coaché
        $coache = User::create([
            'nom' => 'Coaché',
            'prenom' => 'Test',
            'email' => 'coache@coachme.com',
            'password' => Hash::make('password'),
            'dateNaissance' => '1995-10-20',
            'telephone' => '0600000002',
            'adresse' => '789 Rue Coaché',
            'genre' => 'Homme',
            'photo' => 'https://example.com/default-coache.jpg',
            'statut' => 'Actif',
            'situation_familliale' => 'Célibataire',
            'role' => 'coache',
            'email_verified_at' => now()
        ]);
        $coache->assignRole($coacheRole);

        // Création de quelques utilisateurs aléatoires
        User::factory(5)->create()->each(function ($user) use ($coacheRole) {
            $user->assignRole($coacheRole);
        });
    }
}