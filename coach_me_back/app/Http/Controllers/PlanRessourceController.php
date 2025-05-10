<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\Ressource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PlanRessourceController extends Controller
{
    /**
     * Associer des ressources à un plan (admin/coach uniquement)
     */
    public function attachResources(Request $request, $planId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ressources' => 'required|array',
                'ressources.*' => 'exists:ressources,id'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $plan = Plan::findOrFail($planId);

            DB::beginTransaction();
            
            // Synchronisation des ressources avec gestion des erreurs
            $plan->ressources()->sync($request->ressources);
            
            DB::commit();

            return response()->json([
                'message' => 'Ressources associées au plan avec succès',
                'ressources_attachees' => count($request->ressources)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de l\'association des ressources', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Détacher une ressource d'un plan
     */
    public function detachResources(Request $request, $planId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ressources' => 'required|array',
                'ressources.*' => 'exists:ressources,id'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $plan = Plan::findOrFail($planId);

            DB::beginTransaction();
            
            // Détachement multiple des ressources
            $plan->ressources()->detach($request->ressources);
            
            DB::commit();

            return response()->json([
                'message' => 'Ressources détachées du plan avec succès',
                'ressources_detachees' => count($request->ressources)
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors du détachement des ressources', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Liste des ressources associées à un plan
     */
    public function getPlanResources($planId)
    {
        $plan = Plan::with('ressources')->find($planId);

        if (!$plan) {
            return response()->json(['message' => 'Plan introuvable'], 404);
        }

        return response()->json(['ressources' => $plan->ressources], 200);
    }
}
