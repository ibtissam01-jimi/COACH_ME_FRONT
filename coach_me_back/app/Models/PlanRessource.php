<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanRessource extends Model
{
    
    protected $fillable = [
        'plan_id',
        'ressource_id'
    ];

    /**
     * Relation avec le modèle Plan
     */
    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'plan_ressources', 'ressource_id', 'plan_id');
    }

    /**
     * Vérifie si la ressource peut être achetée individuellement
     */
    public function canBePurchasedIndividually() 
    {
        return $this->is_individual && $this->prix !== null;
    }
}
