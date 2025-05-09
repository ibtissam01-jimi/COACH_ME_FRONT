<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{   
    protected $fillable = ['dateEmbauche','user_id','specialite','biographie'];
    protected $table = 'coaches';
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
