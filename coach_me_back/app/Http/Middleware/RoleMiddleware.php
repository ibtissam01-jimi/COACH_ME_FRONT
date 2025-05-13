<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Non authentifié.'], 401);
        }

        if (!in_array(Auth::user()->role, $roles)) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        return $next($request);
    }
}