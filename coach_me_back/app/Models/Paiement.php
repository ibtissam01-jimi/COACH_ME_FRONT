<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = ['abonnement_id', 'ressource_id', 'montant', 'date_paiement', 'methode', 'statut'];

    public function abonnement() {
        return $this->belongsTo(Abonnement::class);
    }

    public function ressource() {
        return $this->belongsTo(Ressource::class);
    }
}
