<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;



class PlanController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
{
    return response()->json(Plan::with(['ressources', 'categorie'])->get(), 200);
}


    public function store(Request $request)
    {
        // Détermine si c'est un ajout multiple ou simple
        $isMultiple = is_array($request->all()) && array_is_list($request->all());
        $data = $isMultiple ? $request->all() : [$request->all()];
        
        $createdPlans = [];
        
        foreach ($data as $planData) {
    $validator = Validator::make($planData, [
        'titre' => 'required|string|max:255',
        'description' => 'nullable|string',
        'prix' => 'required|numeric',
        'duree' => 'required|integer',
        'categorie_id' => 'required|exists:categories,id',
        'ressource_id' => 'exists:ressources,id',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $ressourceIds = $planData['ressources_ids'] ?? [];


    unset($planData['ressources']);
    $plan = Plan::create($planData);
    $plan->ressources()->sync($ressourceIds);

    $createdPlans[] = $plan;
}

        return response()->json([
            'message' => count($createdPlans) > 1 ? 'Plans créés avec succès' : 'Plan créé avec succès',
            'plans' => $createdPlans
        ], 201);
    }

    public function show($id)
    {
        $plan = Plan::with('ressources')->find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan introuvable'], 404);
        }

        return response()->json($plan, 200);
    }

    public function update(Request $request, $id)
{
    $plan = Plan::find($id);

    if (!$plan) {
        return response()->json(['message' => 'Plan introuvable'], 404);
    }

    $validator = Validator::make($request->all(), [
        'titre' => 'required|string|max:255',
        'description' => 'nullable|string',
        'prix' => 'required|numeric',
        'duree' => 'required|integer',
        'categorie_id' => 'required|exists:categories,id',
        'ressources_ids' => 'sometimes|array',
        'ressources_ids.*' => 'exists:ressources,id',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $plan->update($request->only(['titre', 'description', 'prix', 'duree', 'categorie_id']));

    // Mise à jour des ressources liées (ManyToMany)
    if ($request->has('ressources_ids')) {
        $plan->ressources()->sync($request->input('ressources_ids'));
    }

    return response()->json(['message' => 'Plan mis à jour avec succès', 'plan' => $plan], 200);
}



    public function getPlanById($id)
{
    $plan = Plan::find($id);
    if (!$plan) {
        return response()->json(['message' => 'Plan non trouvé'], 404);
    }
    return response()->json($plan);
}



    public function destroy(Request $request, string $id = null)
    {
        // Si on reçoit des IDs dans le corps de la requête
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            $plans = Plan::whereIn('id', $ids)->get();
        } 
        // Si on reçoit un ID dans l'URL
        else if ($id) {
            $plans = collect([Plan::findOrFail($id)]);
        } else {
            return response()->json(['message' => 'Aucun plan spécifié'], 400);
        }

        $deletedCount = 0;
        foreach ($plans as $plan) {
            $plan->delete();
            $deletedCount++;
        }

        return response()->json([
            'message' => $deletedCount > 1 ? 
                        $deletedCount . ' plans supprimés avec succès' : 
                        'Plan supprimé avec succès',
            'count' => $deletedCount
        ]);
    }
}
