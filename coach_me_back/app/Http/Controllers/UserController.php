<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Administrateur;
use App\Models\Coach;
use App\Models\Coache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user(); 
    
        if ($user->hasRole('coache')) {
            $users = [$user]; 
        } 
        elseif ($user->hasRole('coach')) {
            $users = [$user]; 
        } 
        elseif ($user->hasRole('admin')) {
            $users = User::all();
        } else {
            return response()->json(['message' => 'Role non autorisé'], 403);
        }

        // Add photo URL to each user
        foreach ($users as $user) {
            $user->photo = $user->photo;
        }

        return $users;
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
        if(!auth()->user()->hasRole('admin')){
            return response()->json(['message' => 'Vous n\'avez pas l\'autorisation d\'accéder à cette ressource'], 403);
        }
        $rules = [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:20',
            'telephone' => 'required|string|max:32',
            'adresse' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dateNaissance' => 'required|date',
            'genre' => 'required|in:Homme,Femme',
            'statut' => 'required|in:Actif,Inactif',
            'situation_familliale' => 'required|in:Célibataire,Marié,Divorcé',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,coach,coache',
            'date_debut' => 'required_if:role,coache|date',
            'specialite' => 'required_if:role,coach|string|max:100',
            'biographie' => 'required_if:role,coach|string|max:500',
            'dateEmbauche' => 'required_if:role,admin|date'
        ];

        // Détermine si c'est un ajout multiple ou simple
        $isMultiple = is_array($request->all()) && array_is_list($request->all());
        $data = $isMultiple ? $request->all() : [$request->all()];
        
        $createdUsers = [];
        
        foreach ($data as $userData) {
            $validator = Validator::make($userData, $rules);
            
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $validated = $validator->validated();

            // Gestion des photos
            if (isset($userData['photo']) && base64_decode($userData['photo'], true)) {
                $fileName = time() . '_' . uniqid() . '.jpg';
                Storage::disk('public')->put("profile_picture/$fileName", base64_decode($userData['photo']));
                $validated['photo'] = $fileName;
            } elseif (isset($userData['photo']) && $userData['photo'] instanceof \Illuminate\Http\UploadedFile && $userData['photo']->isValid()) {
                $profilePicture = $userData['photo'];
                $fileName = time() . '_' . $profilePicture->getClientOriginalName();
                $profilePicture->storeAs('profile_picture', $fileName, 'public');
                $validated['photo'] = $fileName;
            }

            // Hash du mot de passe
            $validated['password'] = Hash::make($validated['password']);
            
            // Création de l'utilisateur avec les champs de base
            $userFields = [
                'nom', 'prenom', 'telephone', 'adresse', 'photo', 'dateNaissance',
                'genre', 'statut', 'situation_familliale', 'email', 'password'
            ];
            $userData = array_intersect_key($validated, array_flip($userFields));
            
            $user = User::create($userData);
            $user->assignRole($validated['role']);

            // Création des profils spécifiques selon le rôle
            switch ($validated['role']) {
                case 'admin':
                    if (isset($validated['dateEmbauche'])) {
                        Administrateur::create([
                            'user_id' => $user->id,
                            'dateEmbauche' => $validated['dateEmbauche']
                        ]);
                    }
                    break;
                case 'coach':
                    if (isset($validated['specialite']) && isset($validated['biographie'])) {
                        Coach::create([
                            'user_id' => $user->id,
                            'specialite' => $validated['specialite'],
                            'biographie' => $validated['biographie']
                        ]);
                    }
                    break;
                case 'coache':
                    if (isset($validated['date_debut'])) {
                        Coache::create([
                            'user_id' => $user->id,
                            'date_debut' => $validated['date_debut']
                        ]);
                    }
                    break;
            }

            $user->load('roles');
            $createdUsers[] = [
                'user' => $user,
                'roles' => $user->getRoleNames()
            ];
        }

        return response()->json([
            'message' => count($createdUsers) > 1 ? 'Utilisateurs créés avec succès' : 'Utilisateur créé avec succès',
            'data' => $createdUsers
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Load related data based on the role
        $user->load(['administrateurs', 'coaches', 'coachees']);
    
        // Add profile picture URL
        $user->profile_picture_url = $user->photo ? asset('storage/profile_picture/' . $user->photo) : null;
    
        return response()->json($user);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // Vérifier les autorisations
        if (!auth()->user()->hasRole('admin') && auth()->id() !== $user->id) {
            return response()->json(['message' => 'Vous n\'avez pas l\'autorisation de modifier cet utilisateur'], 403);
        }

        $rules = [
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:20',
            'telephone' => 'sometimes|string|max:32',
            'adresse' => 'sometimes|string|max:255',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dateNaissance' => 'sometimes|date',
            'genre' => 'sometimes|in:Homme,Femme',
            'statut' => 'sometimes|in:Actif,Inactif',
            'situation_familliale' => 'sometimes|in:Célibataire,Marié,Divorcé',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:admin,coach,coache',
        ];

        // Ajouter les règles spécifiques selon le rôle
        if ($request->has('role')) {
            switch ($request->role) {
                case 'admin':
                    $rules['dateEmbauche'] = 'required|date';
                    break;
                case 'coach':
                    $rules['specialite'] = 'required|string|max:100';
                    $rules['biographie'] = 'required|string|max:500';
                    $rules['dateEmbauche'] = 'required|date';
                    break;
                case 'coache':
                    $rules['date_debut'] = 'required|date';
                    break;
            }
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Gérer la photo si elle est envoyée
        if ($request->hasFile('photo')) {

            $file = $request->file('photo');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('profile_picture', $fileName, 'public');

            if ($user->photo && Storage::disk('public')->exists('profile_picture/' . $user->photo)) {
                Storage::disk('public')->delete('profile_picture/' . $user->photo);
            }

            $data['photo'] = $fileName;
            \Log::info('Photo saved:', ['file_name' => $fileName]);
        } elseif (isset($data['photo']) && base64_decode($data['photo'], true)) {
            $fileName = time() . '_' . uniqid() . '.jpg';
            Storage::disk('public')->put("profile_picture/$fileName", base64_decode($data['photo']));

            if ($user->photo && Storage::disk('public')->exists('profile_picture/' . $user->photo)) {
                Storage::disk('public')->delete('profile_picture/' . $user->photo);
            }

            $data['photo'] = $fileName;
        }
        // Hasher le mot de passe si fourni
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Gérer le changement de rôle si fourni
        if (isset($data['role'])) {
            $currentRole = $user->roles->first()->name;
            $newRole = $data['role'];

            if ($currentRole !== $newRole) {
                // Supprimer l'ancien profil selon le rôle actuel
                switch ($currentRole) {
                    case 'admin':
                        $user->administrateurs()->delete();
                        break;
                    case 'coach':
                        $user->coaches()->delete();
                        break;
                    case 'coache':
                        $user->coachees()->delete();
                        break;
                }

                // Créer le nouveau profil selon le nouveau rôle
                switch ($newRole) {
                    case 'admin':
                        Administrateur::create([
                            'user_id' => $user->id,
                            'dateEmbauche' => $data['dateEmbauche']
                        ]);
                        break;
                    case 'coach':
                        Coach::create([
                            'user_id' => $user->id,
                            'specialite' => $data['specialite'],
                            'biographie' => $data['biographie'],
                            'dateEmbauche' => $data['dateEmbauche']
                        ]);
                        break;
                    case 'coache':
                        Coache::create([
                            'user_id' => $user->id,
                            'date_debut' => $data['date_debut']
                        ]);
                        break;
                }

                // Mettre à jour le rôle dans la table users et dans Spatie
                $user->role = $newRole; // Update the role column
                $user->save();
                $user->syncRoles([$newRole]); // Update Spatie roles
            }
        }

        // Mettre à jour les informations de base de l'utilisateur
        $user->update($data);

        // Mettre à jour les informations spécifiques au rôle si nécessaire
        if ($user->hasRole('admin') && isset($data['dateEmbauche'])) {
            $user->administrateurs()->update(['dateEmbauche' => $data['dateEmbauche']]);
        } elseif ($user->hasRole('coach') && (isset($data['specialite']) || isset($data['biographie']) || isset($data['dateEmbauche']))) {
            $coachData = array_filter([
                'specialite' => $data['specialite'] ?? null,
                'biographie' => $data['biographie'] ?? null,
                'dateEmbauche' => $data['dateEmbauche'] ?? null
            ]);
            if (!empty($coachData)) {
                $user->coaches()->update($coachData);
            }
        } elseif ($user->hasRole('coache') && isset($data['date_debut'])) {
            $user->coachees()->update(['date_debut' => $data['date_debut']]);
        }

        // Charger les relations pour la réponse
        $user->load(['administrateurs', 'coaches', 'coachees', 'roles']);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Permet de supprimer un ou plusieurs utilisateurs
     */
    public function destroy(Request $request, string $id = null)
    {
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'Vous n\'avez pas l\'autorisation de supprimer des utilisateurs'], 403);
        }

        // Si on reçoit des IDs dans le corps de la requête
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            $users = User::whereIn('id', $ids)->get();
        } 
        // Si on reçoit un ID dans l'URL
        else if ($id) {
            $users = collect([User::findOrFail($id)]);
        } else {
            return response()->json(['message' => 'Aucun utilisateur spécifié'], 400);
        }

        $deletedCount = 0;
        foreach ($users as $user) {
            
            if ($user->photo && Storage::disk('public')->exists('profile_picture/' . $user->photo)) {
                Storage::disk('public')->delete('profile_picture/' . $user->photo);
            }
            
            $user->delete();
            $deletedCount++;
        }

        return response()->json([
            'message' => $deletedCount > 1 ? 
                        $deletedCount . ' utilisateurs supprimés avec succès' : 
                        'Utilisateur supprimé avec succès',
            'count' => $deletedCount
        ]);
    }
}
