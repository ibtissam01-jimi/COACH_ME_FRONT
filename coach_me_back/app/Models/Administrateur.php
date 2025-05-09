<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administrateur extends Model
{
    protected $fillable = ['dateEmbauche','user_id'];
    protected $table = 'administrateurs';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
