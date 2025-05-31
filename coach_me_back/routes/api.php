<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ObjectifController;
use App\Http\Controllers\SousObjectifController;
use App\Http\Controllers\RessourceController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\PlanRessourceController;
use App\Http\Controllers\AbonnementController;
use App\Models\Feedback;
use App\Models\Administrateur;
use App\Models\Coach;
use App\Models\Coache;
use App\Http\Controllers\ZoomController;

Route::prefix('zoom')->middleware('auth:sanctum')->group(function () {
    Route::get('/token', [ZoomController::class, 'getJWT']);
    Route::post('/meetings', [ZoomController::class, 'createMeeting']);
    Route::get('/meetings/{meetingId}/join', [ZoomController::class, 'joinMeeting']);


});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users', [UserController::class, 'index']); 
    Route::post('/users', [UserController::class, 'store']); 
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
  


    Route::get('/feedback', [FeedbackController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store']);

    
  
    // Routes pour les ressources
    Route::get('/ressources', [RessourceController::class, 'index']);
    Route::get('/ressources/{id}', [RessourceController::class, 'show']);
    Route::post('/ressources/{id}/purchase', [RessourceController::class, 'purchase'])->middleware('role:coache');




    

    
   // Routes pour les plans
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);
    Route::get('/plans/{id}', [PlanController::class, 'getPlanById']);


    // Routes pour la gestion des ressources des plans
    Route::get('/plans/{planId}/ressources', [PlanRessourceController::class, 'getPlanResources']);
});

// Routes protégées pour les admins et coachs
Route::middleware(['auth:sanctum', 'role:admin,coach'])->group(function () {
    // Gestion des ressources
    Route::post('/ressources', [RessourceController::class, 'store']);
    Route::put('/ressources/{id}', [RessourceController::class, 'update']);
    Route::delete('/ressources', [RessourceController::class, 'destroy']);

    // Gestion des ressources des plans
    Route::post('/plans/{planId}/ressources', [PlanRessourceController::class, 'attachResources']);
    Route::delete('/plans/{planId}/ressources', [PlanRessourceController::class, 'detachResources']);

    
        // Routes des objectifs
        Route::get('/objectifs', [ObjectifController::class, 'index']);
        Route::post('/objectifs', [ObjectifController::class, 'store']);
        Route::put('/objectifs/{objectif}', [ObjectifController::class, 'update']);
        Route::delete('/objectifs/{objectif}', [ObjectifController::class, 'destroy']);

        // Routes des sous-objectifs
        Route::get('/sous-objectifs', [SousObjectifController::class, 'index']);
        Route::post('/sous-objectifs', [SousObjectifController::class, 'store']);
        Route::put('/sous-objectifs/{sousObjectif}', [SousObjectifController::class, 'update']);
        Route::delete('/sous-objectifs/{sousObjectif}', [SousObjectifController::class, 'destroy']);
    
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/assign-role', [AuthController::class, 'assignRole']);
    Route::get('/user_permission', function () {
        $user = auth()->user();
        return response()->json([
            'user' => $user->name,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions(),
        ]);
    });




 
    Route::get('/categories', [CategoriesController::class, 'index']);
    Route::get('/categories/{id}', [CategoriesController::class, 'show']);
    Route::post('/categories', [CategoriesController::class, 'store']);
    Route::put('/categories/{id}', [CategoriesController::class, 'update']);
    Route::delete('/categories/{id?}', [CategoriesController::class, 'destroy']);



    // Routes de gestion des plans (admin uniquement)
    Route::post('/plans', [PlanController::class, 'store']);
    Route::put('/plans/{id}', [PlanController::class, 'update']);
    Route::delete('/plans/{id}', [PlanController::class, 'destroy']);

});




    Route::get('/abonnements', [AbonnementController::class, 'index']);
    Route::post('/abonnements', [AbonnementController::class, 'store']);
    Route::get('/abonnements/{id}', [AbonnementController::class, 'show']);
    Route::put('/abonnements/{id}', [AbonnementController::class, 'update']);
    Route::delete('/abonnements/{id}', [AbonnementController::class, 'destroy']);
    


    

    Route::get('/paiements', [PaiementController::class, 'index']);         // accessible aux rôles admin et coache
    Route::post('/paiements', [PaiementController::class, 'store']);        // accessible au rôle coache uniquement
    Route::put('/paiements/{id}', [PaiementController::class, 'update']);   // accessible aux rôles admin et coache
    Route::delete('/paiements/{id}', [PaiementController::class, 'destroy']); // admin ou coache
    Route::get('/paiements/{id}', [PaiementController::class, 'show']);



    Route::get('/coachs', [UserController::class, 'getCoachs']);
     Route::get('/allUsers', [UserController::class, 'allUsers']);



    Route::get('/objectifs/{id}', [ObjectifController::class, 'show']);
    Route::put('/sous-objectifs/{id}/toggle', [SousObjectifController::class, 'toggleCompleted']);
