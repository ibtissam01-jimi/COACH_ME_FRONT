<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    protected $fillable = ['coache_id', 'plan_id', 'date_debut', 'date_fin', 'statut'];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }


    public function coache()
{
    return $this->belongsTo(User::class, 'coache_id');
}

public function coachChoisi()
{
    return $this->belongsTo(User::class, 'coach_choisi_id');
}

    
}
