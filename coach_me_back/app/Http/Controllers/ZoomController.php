<?php

namespace App\Http\Controllers;

use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use App\Models\ZoomMeeting;
use App\Models\Coach;
use App\Models\Coache;
use Illuminate\Support\Facades\Auth;
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
        // Vérifier si l'utilisateur connecté est un coach
        $user = Auth::user();
        $coach = Coach::where('user_id', $user->id)->first();

        if (!$coach) {
            return response()->json([
                'success' => false,
                'message' => 'Seul un coach peut créer une réunion'
            ], 403);
        }

        $request->validate([
            'topic' => 'required|string',
            'start_time' => 'required|date',
            'duration' => 'required|integer|min:15',
            'guest_id' => 'required|exists:coachees,id'
        ]);

        try {
            // Vérifier que le coaché existe
            $coache = Coache::findOrFail($request->guest_id);

            $meeting = ZoomMeeting::create([
                'topic' => $request->topic,
                'start_time' => $request->start_time,
                'duration' => $request->duration,
                'host_id' => $coach->id, // Utiliser l'ID du coach authentifié
                'guest_id' => $request->guest_id,
                'status' => 'scheduled',
                'password' => \Str::random(6),
            ]);

            // Charger les relations
            $meeting->load(['host', 'guest']);

            return response()->json([
                'success' => true,
                'meeting' => $meeting,
                'jwt' => $this->jwt
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Échec de la création de la réunion : ' . $e->getMessage()
            ], 500);
        }
    }

    public function joinMeeting(Request $request, $meetingId)
    {
        try {
            $meeting = ZoomMeeting::with(['host', 'guest'])->findOrFail($meetingId);
            $user = Auth::user();
            
            // Vérifier si la réunion peut être rejointe
            if ($meeting->status !== 'scheduled' && $meeting->status !== 'started') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette réunion ne peut pas être rejointe actuellement'
                ], 400);
            }

            // Vérifier les permissions
            $coach = Coach::where('user_id', $user->id)->first();
            $coache = Coache::where('user_id', $user->id)->first();

            $isHost = $coach && $coach->id === $meeting->host_id;
            $isGuest = $coache && $coache->id === $meeting->guest_id;

            if (!$isHost && !$isGuest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à rejoindre cette réunion'
                ], 403);
            }

            // Si c'est le coach qui rejoint et que la réunion n'est pas démarrée
            if ($isHost && $meeting->status === 'scheduled') {
                $meeting->status = 'started';
                $meeting->save();
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
                    'host' => $meeting->host ? [
                        'id' => $meeting->host->id,
                        'name' => $meeting->host->user->name
                    ] : null,
                    'guest' => $meeting->guest ? [
                        'id' => $meeting->guest->id,
                        'name' => $meeting->guest->user->name
                    ] : null
                ],
                'signature' => $this->jwt,
                'sdkKey' => config('zoom.sdk_key'),
                'userIdentity' => $user->name,
                'role' => $isHost ? 1 : 0, // 1 pour host, 0 pour participant
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
                        'enable' => $isHost // Seul le coach peut partager son écran
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
