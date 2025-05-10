<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SousObjectif extends Model
{
    protected $fillable = ['objectif_id', 'titre', 'statut'];
    protected $table = 'sous_objectifs';

    public function objectif()
    {
        return $this->belongsTo(Objectif::class, 'objectif_id');
    }
}
