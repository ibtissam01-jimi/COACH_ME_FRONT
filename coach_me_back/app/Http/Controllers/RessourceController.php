<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ressource;
use App\Models\Paiement;
use App\Models\Abonnement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RessourceController extends Controller
{
    /**
     * Liste des ressources accessibles pour le coache :
     * - Ressources achetées individuellement
     * - Ressources incluses dans les plans achetés
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole(['admin', 'coach'])) {
            return response()->json(Ressource::all(), 200);
        }

        if ($user->hasRole('coache')) {
            // Ressources achetées individuellement
            $ressourcesAchetees = Paiement::where('user_id', $user->id)
                ->whereNotNull('ressource_id')
                ->pluck('ressource_id')
                ->toArray();

            // Ressources incluses dans les plans achetés
            $ressourcesPlans = Abonnement::where('coache_id', $user->id)
                ->where('statut', 'actif')
                ->with('plan.ressources')
                ->get()
                ->pluck('plan.ressources.*.id')
                ->flatten()
                ->toArray();

            $ressourcesAccessibles = array_unique(array_merge($ressourcesAchetees, $ressourcesPlans));

            $ressources = Ressource::whereIn('id', $ressourcesAccessibles)->get();

            return response()->json($ressources, 200);
        }

        return response()->json(['message' => 'Accès non autorisé'], 403);
    }

    /**
     * Création de ressources (admin et coach uniquement)
     */
    public function store(Request $request)
    {
        if (!Auth::user()->hasRole(['admin', 'coach'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        // Détermine si c'est un ajout multiple ou simple
        $isMultiple = is_array($request->all()) && array_is_list($request->all());
        $data = $isMultiple ? $request->all() : [$request->all()];
        
        $createdRessources = [];
        
        foreach ($data as $ressourceData) {
            $validator = Validator::make($ressourceData, [
                'titre' => 'required|string|max:255',
                'type' => 'required|in:pdf,video,audio,image',
                'url' => 'required|string',
                'estPremium' => 'sometimes|boolean',
                'is_individual' => 'required|boolean',
                'prix' => 'nullable|numeric'
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $ressource = Ressource::create($validator->validated());
            $createdRessources[] = $ressource;
        }

        return response()->json([
            'message' => count($createdRessources) > 1 ? 'Ressources créées avec succès' : 'Ressource créée avec succès',
            'ressources' => $createdRessources
        ], 201);
    }

    /**
     * Affichage d'une ressource
     */
    public function show($id)
    {
        $ressource = Ressource::find($id);

        if (!$ressource) {
            return response()->json(['message' => 'Ressource introuvable'], 404);
        }

        return response()->json($ressource, 200);
    }

    /**
     * Mise à jour des ressources (admin et coach uniquement)
     */
    public function update(Request $request, $id)
    {
        if (!Auth::user()->hasRole(['admin', 'coach'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $ressource = Ressource::find($id);

        if (!$ressource) {
            return response()->json(['message' => 'Ressource introuvable'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:pdf,video,audio,image',
            'url' => 'sometimes|string',
            'estPremium' => 'sometimes|boolean',
            'is_individual' => 'sometimes|boolean',
            'prix' => 'nullable|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ressource->update($validator->validated());

        return response()->json(['ressource' => $ressource, 'message' => 'Ressource mise à jour avec succès'], 200);
    }

    /**
     * Suppression de ressources (admin et coach uniquement)
     */
    public function destroy(Request $request)
    {
        if (!Auth::user()->hasRole(['admin', 'coach'])) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $ids = $request->input('ids', []);
        $deleted = Ressource::whereIn('id', $ids)->delete();

        return response()->json(['message' => "{$deleted} ressources supprimées avec succès"], 200);
    }

    /**
     * Achat d'une ressource individuelle (coache uniquement)
     */
    /**
 * Achat d'une ressource individuelle (coache uniquement)
 */
public function purchase(Request $request, $id)
{
    $user = Auth::user();

    if (!$user->hasRole('coache')) {
        return response()->json(['message' => 'Accès non autorisé'], 403);
    }

    $ressource = Ressource::find($id);

    if (!$ressource || !$ressource->is_individual) {
        return response()->json(['message' => 'Ressource non disponible pour achat individuel'], 400);
    }

    $validator = Validator::make($request->all(), [
        'payment_method' => 'required|in:cache,virement'
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    DB::beginTransaction();

    try {
        // Création du paiement avec statut "en attente"
        Paiement::create([
            'user_id' => $user->id,
            'ressource_id' => $id,
            'montant' => $ressource->prix,
            'date_paiement' => now(),
            'methode' => $request->payment_method,
            'statut' => 'en attente', // Par défaut en attente
        ]);

        DB::commit();
    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['message' => 'Erreur lors de l\'achat', 'error' => $e->getMessage()], 500);
    }

    return response()->json(['message' => 'Achat en attente de validation'], 200);
}

}