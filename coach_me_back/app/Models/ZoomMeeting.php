<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZoomMeeting extends Model
{
    protected $fillable = [
        'topic',
        'start_time',
        'duration',
        'meeting_id',
        'join_url',
        'host_id',
        'password',
        'status'
    ];

    protected $casts = [
        'start_time' => 'datetime'
    ];
    public function coach()
    {
        return $this->belongsTo(Coach::class, 'host_id');
    }
    public function coachees(){
        return $this->hasMany(Coachee::class, 'meeting_id');
    }
}
