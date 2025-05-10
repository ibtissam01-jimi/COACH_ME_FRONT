<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Middleware\RoleMiddleware;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ObjectifController;
use App\Http\Controllers\SousObjectifController;
use App\Models\Feedback;
use App\Models\Administrateur;
use App\Models\Coach;
use App\Models\Coache;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users', [UserController::class, 'index']); 
    Route::post('/users', [UserController::class, 'store']); 
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/feedbacks', [FeedbackController::class, 'index']);
    Route::post('/feedbacks', [FeedbackController::class, 'store']);

    
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
});
