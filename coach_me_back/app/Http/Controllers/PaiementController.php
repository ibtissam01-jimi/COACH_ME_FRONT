<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('role:admin|coache')->only(['index', 'update']);
    //     $this->middleware('role:coache')->only(['store']);
    // }

    // PaiementController.php
public function index()
{
    $paiements = Paiement::with('ressource')->get(); // Assurez-vous que la relation est définie dans le modèle
    return response()->json($paiements);
}



    public function show($id)
{
    $paiement = Paiement::find($id);
    if (!$paiement) {
        return response()->json(['message' => 'Paiement introuvable'], 404);
    }
    return response()->json($paiement, 200);
}


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'user_id' => 'required|exists:users,id',
            'ressource_id' => 'nullable|exists:ressources,id',
            'montant' => 'required|numeric',
            'date_paiement' => 'required|date',
            'methode' => 'required|in:cache,virement',
            'statut' => 'required|in:en attente,payé,annulé'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $paiement = Paiement::create($request->all());
        return response()->json(['message' => 'Paiement créé avec succès', 'paiement' => $paiement], 201);
    }



    // public function update(Request $request, $id)
    // {
    //     $paiement = Paiement::find($id);

    //     if (!$paiement) {
    //         return response()->json(['message' => 'Paiement introuvable'], 404);
    //     }

    //     $validator = Validator::make($request->all(), [
    //         'statut' => 'required|in:en attente,payé,annulé'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     $paiement->update(['statut' => $request->statut]);
    //     return response()->json(['message' => 'Statut de paiement mis à jour', 'paiement' => $paiement], 200);
    // }


    public function update(Request $request, $id)
{
    $paiement = Paiement::findOrFail($id);

    $paiement->update($request->only([
        'montant',
        'date_paiement',
        'methode',
        'statut',
        'abonnement_id',
        'ressource_id',
    ]));

    return response()->json($paiement);
}





    public function destroy($id)
{
    $paiement = Paiement::find($id);

    if (!$paiement) {
        return response()->json(['message' => 'Paiement introuvable'], 404);
    }

    $paiement->delete();
    return response()->json(['message' => 'Paiement supprimé avec succès'], 200);
}

}
