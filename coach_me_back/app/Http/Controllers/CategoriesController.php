<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategorieController extends Controller
{
    /**
     * Afficher toutes les catégories
     */
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories, 200);
    }

    /**
     * Créer une nouvelle catégorie
     */
    public function store(Request $request)
    {
        // Détermine si c'est un ajout multiple ou simple
        $isMultiple = is_array($request->all()) && array_is_list($request->all());
        $data = $isMultiple ? $request->all() : [$request->all()];
        
        $createdCategories = [];
        
        foreach ($data as $categorieData) {
            $validator = Validator::make($categorieData, [
                'nom' => 'required|string|max:255'
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $categorie = Categorie::create($categorieData);
            $createdCategories[] = $categorie;
        }

        return response()->json([
            'message' => count($createdCategories) > 1 ? 'Catégories créées avec succès' : 'Catégorie créée avec succès',
            'categories' => $createdCategories
        ], 201);
    }

    /**
     * Afficher une catégorie spécifique
     */
    public function show($id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable'], 404);
        }

        return response()->json($categorie, 200);
    }

    /**
     * Mettre à jour une catégorie
     */
    public function update(Request $request, $id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $categorie->update($request->all());
        return response()->json(['message' => 'Catégorie mise à jour avec succès', 'categorie' => $categorie], 200);
    }

    /**
     * Supprimer une catégorie
     */
    public function destroy(Request $request, string $id = null)
    {
        // Si on reçoit des IDs dans le corps de la requête
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            $categories = Categorie::whereIn('id', $ids)->get();
        } 
        // Si on reçoit un ID dans l'URL
        else if ($id) {
            $categories = collect([Categorie::findOrFail($id)]);
        } else {
            return response()->json(['message' => 'Aucune catégorie spécifiée'], 400);
        }

        $deletedCount = 0;
        foreach ($categories as $categorie) {
            $categorie->delete();
            $deletedCount++;
        }

        return response()->json([
            'message' => $deletedCount > 1 ? 
                        $deletedCount . ' catégories supprimées avec succès' : 
                        'Catégorie supprimée avec succès',
            'count' => $deletedCount
        ]);
    }
}
