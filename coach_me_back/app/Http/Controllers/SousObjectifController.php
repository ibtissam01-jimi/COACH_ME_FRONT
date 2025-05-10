<?php

namespace App\Http\Controllers;

use App\Models\SousObjectif;
use App\Models\Objectif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SousObjectifController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $objectif_id = $request->query('objectif_id');

        if (!$objectif_id) {
            return response()->json(['message' => 'L\'ID de l\'objectif parent est requis'], 400);
        }

        $objectif = Objectif::findOrFail($objectif_id);

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous n\'avez pas accès à cet objectif'], 403);
            }
        } else {
            if ($objectif->dedie_a !== $user->id && $objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous n\'avez pas accès à cet objectif'], 403);
            }
        }

        $sousObjectifs = SousObjectif::where('objectif_id', $objectif_id)->get();
        return response()->json($sousObjectifs);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'objectif_id' => 'required|exists:objectifs,id',
            'titre' => 'required|string',
            'statut' => 'in:En cours,Terminé'
        ]);

        $objectif = Objectif::findOrFail($validated['objectif_id']);

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez ajouter des sous-objectifs qu\'à vos propres objectifs'], 403);
            }
        } else {
            if ($objectif->dedie_a !== $user->id && $objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez pas ajouter de sous-objectifs à cet objectif'], 403);
            }
        }

        $sousObjectif = new SousObjectif();
        $sousObjectif->objectif_id = $validated['objectif_id'];
        $sousObjectif->titre = $validated['titre'];
        $sousObjectif->statut = $validated['statut'] ?? 'En cours';
        $sousObjectif->save();

        return response()->json($sousObjectif, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SousObjectif $sousObjectif)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SousObjectif $sousObjectif)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SousObjectif $sousObjectif)
    {
        $user = Auth::user();
        $objectif = $sousObjectif->objectif;

        if (!$objectif) {
            return response()->json(['message' => 'Objectif parent non trouvé'], 404);
        }

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez modifier que les sous-objectifs de vos objectifs'], 403);
            }
            if ($request->has('statut')) {
                return response()->json(['message' => 'Seul le coaché peut modifier le statut du sous-objectif'], 403);
            }
        } else {
            if ($objectif->dedie_a !== $user->id && $objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez pas modifier ce sous-objectif'], 403);
            }
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string',
            'statut' => $user->hasRole('coache') ? 'sometimes|in:En cours,Terminé' : 'prohibited'
        ]);

        $sousObjectif->fill($validated);
        $sousObjectif->save();

        return response()->json($sousObjectif);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SousObjectif $sousObjectif)
    {
        $user = Auth::user();
        $objectif = $sousObjectif->objectif;

        if (!$objectif) {
            return response()->json(['message' => 'Objectif parent non trouvé'], 404);
        }

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez supprimer que les sous-objectifs de vos objectifs'], 403);
            }
        } else {
            if ($objectif->dedie_a !== $user->id && $objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez pas supprimer ce sous-objectif'], 403);
            }
        }

        $sousObjectif->delete();
        return response()->json(['message' => 'Sous-objectif supprimé avec succès']);
    }
}
