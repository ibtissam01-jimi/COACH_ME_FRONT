<?php

namespace App\Http\Controllers;

use App\Models\Objectif;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ObjectifController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    //     $this->middleware('role:coach|coache');
    // }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('coach')) {
            $objectifs = Objectif::where('creer_par', $user->id)
                                ->with(['coach', 'coache'])
                                ->get();
        } else {
            $objectifs = Objectif::where('dedie_a', $user->id)
                                ->orWhere('creer_par', $user->id)
                                ->with(['coach', 'coache'])
                                ->get();
        }

        return response()->json($objectifs);
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

        if (!$user->hasRole(['coach', 'coache'])) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $rules = [
            'titre' => 'required|string',
            'statut' => 'in:En cours,Terminé',
            'progression' => 'numeric|min:0|max:100',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ];

        if ($user->hasRole('coach')) {
            $rules['dedie_a'] = 'required|exists:users,id';
            $rules['statut']='prohibited';
            
            $dedie_a_user = User::find($request->dedie_a);
            if (!$dedie_a_user) {
                return response()->json(['message' => 'L\'utilisateur spécifié n\'existe pas'], 422);
            }

            if (!$dedie_a_user->hasRole('coache') || $dedie_a_user->hasRole(['admin', 'coach'])) {
                return response()->json(['message' => 'L\'objectif ne peut être dédié qu\'à un utilisateur ayant uniquement le rôle coaché'], 422);
            }
        } else {
            $rules['dedie_a'] = 'prohibited';
            $rules['statut'] = 'in:En cours,Terminé';
        }

        $validated = $request->validate($rules);

        $objectif = new Objectif();
        $objectif->titre = $validated['titre'];
        $objectif->date_debut = $validated['date_debut'];
        $objectif->date_fin = $validated['date_fin'];
        $objectif->creer_par = $user->id;
        $objectif->statut = $user->hasRole('coache') ? $validated['statut'] : 'En cours';
        $objectif->progression = $validated['progression'] ?? 0;
        $objectif->dedie_a = $user->hasRole('coach') ? $validated['dedie_a'] : $user->id;

        $objectif->save();

        return response()->json($objectif->load(['coach', 'coache']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Objectif $objectif)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Objectif $objectif)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Objectif $objectif)
    {
        $user = Auth::user();

        if (!$user->hasRole(['coach', 'coache'])) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez modifier que vos propres objectifs'], 403);
            }
            if ($request->has('statut')) {
                return response()->json(['message' => 'Seul le coaché peut modifier le statut de l\'objectif'], 403);
            }
        } else {
            if ($objectif->dedie_a !== $user->id && $objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez modifier que vos objectifs'], 403);
            }
        }

        $validated = $request->validate([
            'titre' => 'sometimes|string',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after:date_debut',
            'progression' => 'sometimes|numeric|min:0|max:100',
            'statut' => $user->hasRole('coache') ? 'sometimes|in:En cours,Terminé' : 'prohibited',
            'dedie_a' => $user->hasRole('coach') ? 'sometimes|exists:users,id' : 'prohibited'
        ]);

        $objectif->fill($validated);
        $objectif->save();

        return response()->json($objectif->load(['coach', 'coache']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Objectif $objectif)
    {
        $user = Auth::user();

        if (!$user->hasRole(['coach', 'coache'])) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($user->hasRole('coach')) {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez supprimer que vos propres objectifs'], 403);
            }
        } else {
            if ($objectif->creer_par !== $user->id) {
                return response()->json(['message' => 'Vous ne pouvez supprimer que les objectifs que vous avez créés'], 403);
            }
        }

        $objectif->delete();

        return response()->json(['message' => 'Objectif supprimé avec succès']);
    }
}
