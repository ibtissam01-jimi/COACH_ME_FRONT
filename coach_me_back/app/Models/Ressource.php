<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ressource extends Model
{
    protected $fillable = ['titre', 'type', 'url', 'estPremium', 'is_individual', 'prix', 'photo'];


    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'plan_ressource');
    }

    public function canBePurchasedIndividually() {
        return $this->is_individual && $this->prix !== null;
    }
}
