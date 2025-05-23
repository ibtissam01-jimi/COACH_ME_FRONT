<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Administrateur;
use App\Models\Coach;
use App\Models\Coache;

class AuthController extends Controller
{
    // Inscription des utilisateurs
    // public function register(Request $request)
    // {
    //     $request->validate([
    //         'nom'     => 'required|string|max:100',
    //         'prenom'  => 'required|string|max:20',
    //         'email'    => 'required|email|unique:users',
    //         'password' => 'required|string|min:6',
    //         'role' => 'required|in:admin,coach,coache',
    //         'dateNaissance' => 'required|date',
    //         'telephone' => 'required|string|max:32',
    //         'adresse' => 'required|string|max:255',
    //         'genre' => 'required|in:Homme,Femme',
    //         'statut' => 'required|in:Actif,Inactif',
    //         'situation_familliale' => 'required|in:Célibataire,Marié,Divorcé',
    //         'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'dateEmbauche' => 'required_if:role,admin|date',
    //         'specialite' => 'required_if:role,coach|string|max:100',
    //         'biographie' => 'required_if:role,coach|string|max:500',
    //         'date_debut' => 'required_if:role,coache|date',
    //     ]);
        
    //     // Création de l'utilisateur
    //     $userData = $request->only([
    //         'nom', 'prenom', 'email', 'dateNaissance', 'telephone', 'adresse', 'genre', 'statut', 'situation_familliale','role'
    //     ]);
    //     $userData['password'] = Hash::make($request->password);
    //     $user = User::create($userData);

    //     // Assignation du rôle
    //     $user->assignRole($request->role);

    //     // Création des profils spécifiques
    //     switch ($request->role) {
    //         case 'admin':
    //             Administrateur::create(['user_id' => $user->id, 'dateEmbauche' => $request->dateEmbauche]);
    //             break;
    //         case 'coach':
    //             Coach::create(['user_id' => $user->id, 'specialite' => $request->specialite, 'biographie' => $request->biographie]);
    //             break;
    //         case 'coache':
    //             Coache::create(['user_id' => $user->id, 'date_debut' => $request->date_debut]);
    //             break;
    //     }

    //     // Génération du token
    //     $token = $user->createToken('api-token')->plainTextToken;

    //     return response()->json([
    //         'message' => 'Inscription réussie',
    //         'access_token' => $token,
    //         'token_type' => 'Bearer',
    //         'user' => $user,
    //         'roles' => $user->getRoleNames(),
    //     ]);
    // }





    public function register(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:100',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6|confirmed', // Ajoute validation du mot de passe confirmé
    ]);

    $userData = [
        'nom' => $request->nom,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ];

    // Crée un utilisateur avec les champs fournis
    $user = User::create($userData);

    // Par défaut, on pourrait donner un rôle générique, ou bien laisser sans rôle
    $user->assignRole('coache'); // ou 'utilisateur', selon ton système

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

    // public function forgotPassword(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email|exists:users',
    //     ]);

    //     $status = Password::sendResetLink(
    //         $request->only('email')
    //     );

    //     if ($status === Password::RESET_LINK_SENT) {
    //         return response()->json(['message' => 'Le lien de réinitialisation a été envoyé à votre adresse e-mail']);
    //     }

    //     return response()->json(['message' => 'Impossible d\'envoyer le lien de réinitialisation'], 400);
    // }




    public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users', // Vérifie que l'email existe dans la base de données
    ]);

    // Envoi du lien de réinitialisation
    $status = Password::sendResetLink(
        $request->only('email')
    );

    // Si le lien de réinitialisation a été envoyé avec succès
    if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
            'message' => 'Le lien de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception.'
        ]);
    }

    // Si l'envoi du lien échoue
    return response()->json(['message' => 'Impossible d\'envoyer le lien de réinitialisation'], 400);
}



    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);

                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
        }

        return response()->json(['message' => 'Impossible de réinitialiser le mot de passe'], 400);
    }
}
