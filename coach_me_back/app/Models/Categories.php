<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class Categories extends Model
{
    

    // Autorise le champ 'nom' à être inséré ou mis à jour en masse
    protected $fillable = ['nom'];
}
