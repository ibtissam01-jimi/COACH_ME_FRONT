<?php

namespace App\Http\Controllers;

use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AbonnementController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin|coache')->only(['index', 'show']);
        $this->middleware('role:admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return response()->json(Abonnement::with('plan')->get(), 200);
        }

        if ($user->hasRole('coache')) {
            return response()->json(
                Abonnement::where('coache_id', $user->id)->with('plan')->get(),
                200
            );
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coache_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'date_debut' => 'required|date',
            'statut' => 'required|in:actif,inactif'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $abonnement = Abonnement::create($request->all());
        return response()->json(['message' => 'Abonnement créé avec succès', 'abonnement' => $abonnement], 201);
    }

    public function update(Request $request, $id)
    {
        $abonnement = Abonnement::find($id);

        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }

        $validator = Validator::make($request->all(), [
            'coache_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'date_debut' => 'required|date',
            'statut' => 'required|in:actif,inactif'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $abonnement->update($request->all());
        return response()->json(['message' => 'Abonnement mis à jour avec succès', 'abonnement' => $abonnement], 200);
    }

    public function destroy($id)
    {
        $abonnement = Abonnement::find($id);

        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }

        $abonnement->delete();
        return response()->json(['message' => 'Abonnement supprimé avec succès'], 200);
    }

    /**
     * Affichage des détails d'un abonnement
     */
    public function show($id)
    {
        $user = Auth::user();
        $abonnement = Abonnement::with('plan')->find($id);

        if (!$abonnement) {
            return response()->json(['message' => 'Abonnement introuvable'], 404);
        }

        // Vérification des autorisations
        if ($user->hasRole('coache') && $abonnement->coache_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json($abonnement, 200);
    }
}
