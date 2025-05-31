<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Objectif extends Model
{
    protected $fillable = [ 'date_debut', 'date_fin', 'statut','titre','dedie_a','creer_par','progression'];
    protected $table = 'objectifs';

    public function coach()
    {
        return $this->belongsTo(User::class, 'creer_par');
    }
    public function coache()
    {
        return $this->belongsTo(User::class, 'dedie_a');
    }

    public function sousObjectifs()
{
    return $this->hasMany(SousObjectif::class);
}

    public function progression()
{
    $total = $this->sousObjectifs()->count();
    $completed = $this->sousObjectifs()->where('completed', true)->count();

    return $total > 0 ? round(($completed / $total) * 100) : 0;
}

}
