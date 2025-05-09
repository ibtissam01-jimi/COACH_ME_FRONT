<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coache extends Model
{
    protected $fillable = ['date_debut','user_id'];
    protected $table = 'coachees';
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
