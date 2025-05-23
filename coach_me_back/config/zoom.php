<?php

return [
    'sdk_key' => env('ZOOM_SDK_KEY', ''),
    'sdk_secret' => env('ZOOM_SDK_SECRET', ''),
    'base_url' => env('ZOOM_BASE_URL', 'https://zoom.us'),
    'version' => env('ZOOM_SDK_VERSION', '2.19.0'),
    'settings' => [
        'pay_mode' => 'Pay_as_you_go',
        'cloud_recording' => false,
        'meeting_defaults' => [
            'host_video' => true,
            'participant_video' => true,
            'join_before_host' => false,
            'mute_upon_entry' => true,
            'waiting_room' => true
        ]
    ]
];