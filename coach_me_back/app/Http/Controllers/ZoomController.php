<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use App\Models\ZoomMeeting;
use Illuminate\Support\Facades\Config;

class ZoomController extends Controller
{
    private $zoomBaseUrl;
    private $jwt;

    public function __construct()
    {
        $this->zoomBaseUrl = config('zoom.base_url');
        $this->generateZoomJWT();
    }

    private function generateZoomJWT()
    {
        $apiKey = config('zoom.sdk_key');
        $apiSecret = config('zoom.sdk_secret');

        $payload = [
            "app_key" => $apiKey,
            "iat" => time(),
            "exp" => time() + 3600,
            "tokenExp" => time() + 3600,
            "user_identity" => uniqid('user_'),
            "user_type" => 1,
            "pay_mode" => config('zoom.settings.pay_mode', 'Pay_as_you_go'),
            "cloud_recording_option" => 0,
            "version" => config('zoom.version')
        ];

        $this->jwt = JWT::encode($payload, $apiSecret, 'HS256');
    }

    public function getJWT()
    {
        return response()->json([
            'success' => true,
            'token' => $this->jwt,
            'expires_in' => 3600
        ]);
    }

    public function createMeeting(Request $request)
    {
        $request->validate([
            'topic' => 'required|string',
            'start_time' => 'required|date',
            'duration' => 'required|integer|min:15',
            'host_id' => 'required|string'
        ]);

        try {
            $meeting = ZoomMeeting::create([
                'topic' => $request->topic,
                'start_time' => $request->start_time,
                'duration' => $request->duration,
                'host_id' => $request->host_id,
                'status' => 'scheduled'
            ]);

            return response()->json([
                'success' => true,
                'meeting' => $meeting,
                'jwt' => $this->jwt
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create meeting: ' . $e->getMessage()
            ], 500);
        }
    }

    public function joinMeeting(Request $request, $meetingId)
    {
        try {
            $meeting = ZoomMeeting::where('id', $meetingId)->firstOrFail();
            
            // Vérifier si la réunion peut être rejointe
            if ($meeting->status !== 'scheduled' && $meeting->status !== 'started') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette réunion ne peut pas être rejointe actuellement'
                ], 400);
            }

            // Générer les informations de connexion
            $joinInfo = [
                'success' => true,
                'meeting' => [
                    'id' => $meeting->id,
                    'topic' => $meeting->topic,
                    'start_time' => $meeting->start_time,
                    'duration' => $meeting->duration,
                    'status' => $meeting->status,
                ],
                'signature' => $this->jwt,
                'sdkKey' => config('zoom.sdk_key'),
                'userIdentity' => $request->input('user_name', 'Guest ' . uniqid()),
                'role' => ($meeting->host_id === $request->input('user_id')) ? 1 : 0, // 1 pour host, 0 pour participant
                'password' => $meeting->password,
                'lang' => $request->input('lang', 'fr-FR'),
                'sessionConfig' => [
                    'video' => [
                        'mute_upon_entry' => true,
                        'show_video' => true
                    ],
                    'audio' => [
                        'auto_mute' => true,
                        'mute_upon_entry' => true
                    ],
                    'chat' => [
                        'enable' => true
                    ],
                    'screen_share' => [
                        'enable' => true
                    ]
                ]
            ];

            return response()->json($joinInfo);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Meeting non trouvé ou erreur : ' . $e->getMessage()
            ], 404);
        }
    }
}
