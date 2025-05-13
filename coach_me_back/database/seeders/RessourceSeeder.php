<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ressource;

class RessourceSeeder extends Seeder
{
    public function run()
    {
        Ressource::create([
            'titre' => 'Guide de développement personnel',
            'type' => 'pdf',
            'url' => 'https://example.com/ressources/dev-personnel.pdf',
            'estPremium' => false,
            'is_individual' => true,
            'prix' => null,
        ]);

        Ressource::create([
            'titre' => 'Vidéo sur la gestion du stress',
            'type' => 'video',
            'url' => 'https://example.com/ressources/stress-video.mp4',
            'estPremium' => true,
            'is_individual' => false,
            'prix' => 19.99,
        ]);

        Ressource::create([
            'titre' => 'Podcast Confiance en soi',
            'type' => 'audio',
            'url' => 'https://example.com/ressources/confiance.mp3',
            'estPremium' => false,
            'is_individual' => true,
            'prix' => null,
        ]);

        Ressource::create([
            'titre' => 'Infographie Leadership',
            'type' => 'image',
            'url' => 'https://example.com/ressources/leadership.png',
            'estPremium' => true,
            'is_individual' => true,
            'prix' => 9.99,
        ]);
    }
}
