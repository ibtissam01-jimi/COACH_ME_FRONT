<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Administrateur;
use App\Models\Coach;
use App\Models\Coache;

class AuthController extends Controller
{
    // Inscription des utilisateurs
    public function register(Request $request)
    {
        $request->validate([
            'nom'     => 'required|string|max:100',
            'prenom'  => 'required|string|max:20',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,coach,coache',
            'dateNaissance' => 'required|date',
            'telephone' => 'required|string|max:32',
            'adresse' => 'required|string|max:255',
            'genre' => 'required|in:Homme,Femme',
            'statut' => 'required|in:Actif,Inactif',
            'situation_familliale' => 'required|in:Célibataire,Marié,Divorcé',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dateEmbauche' => 'required_if:role,admin|date',
            'specialite' => 'required_if:role,coach|string|max:100',
            'biographie' => 'required_if:role,coach|string|max:500',
            'date_debut' => 'required_if:role,coache|date',
        ]);
        
        // Création de l'utilisateur
        $userData = $request->only([
            'nom', 'prenom', 'email', 'dateNaissance', 'telephone', 'adresse', 'genre', 'statut', 'situation_familliale'
        ]);
        $userData['password'] = Hash::make($request->password);
        $user = User::create($userData);

        // Assignation du rôle
        $user->assignRole($request->role);

        // Création des profils spécifiques
        switch ($request->role) {
            case 'admin':
                Administrateur::create(['user_id' => $user->id, 'dateEmbauche' => $request->dateEmbauche]);
                break;
            case 'coach':
                Coach::create(['user_id' => $user->id, 'specialite' => $request->specialite, 'biographie' => $request->biographie]);
                break;
            case 'coache':
                Coache::create(['user_id' => $user->id, 'date_debut' => $request->date_debut]);
                break;
        }

        // Génération du token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'roles' => $user->getRoleNames(),
        ]);
    }

    // Connexion des utilisateurs
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'roles' => $user->getRoleNames(),
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    // Récupération des informations utilisateur
    public function me(Request $request)    
    {
        return response()->json($request->user());
    }
}
