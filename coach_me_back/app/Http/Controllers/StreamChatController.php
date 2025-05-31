<?php

namespace App\Http\Controllers;

use GetStream\StreamChat\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StreamChatController extends Controller
{
public function token(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $client = new Client(config('stream.key'), config('stream.secret'));

    $client->upsertUser([
        'id' => (string)$user->id,
        'name' => $user->name,
        'image' => null,
    ]);

    $token = $client->createToken((string)$user->id);

    return response()->json([
        'token' => $token,
        'apiKey' => config('stream.key'),
        'user' => [
            'id' => (string)$user->id,
            'name' => $user->name,
            'image' => null,
        ],
    ]);
}
}