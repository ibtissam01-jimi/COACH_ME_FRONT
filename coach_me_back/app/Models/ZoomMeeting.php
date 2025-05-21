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
        'guest_id',
        'password',
        'status'
    ];

    protected $casts = [
        'start_time' => 'datetime'
    ];

    public function host()
    {
        return $this->belongsTo(Coach::class, 'host_id');
    }

    public function guest()
    {
        return $this->belongsTo(Coache::class, 'guest_id');
    }
}
