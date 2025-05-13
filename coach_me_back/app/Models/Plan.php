<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['titre', 'description', 'prix', 'duree', 'categorie_id'];

    public function ressources()
    {
        return $this->belongsToMany(Ressource::class, 'plan_ressources');
    }
}
