<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\User;



class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $user = auth()->user();

        // if ($user->hasRole('admin')) {
        //     $feedbacks = Feedback::with('user')->get();
        // } elseif ($user->hasRole('coach')) {
        //     $feedbacks = Feedback::whereHas('user', function($query) {
        //         $query->role('coach');
        //     })->with('user')->get();
        // } else {
        //     $feedbacks = Feedback::where('user_id', $user->id)->with('user')->get();
        // }
        $feedbacks = Feedback::with('user')->get();
        return response()->json($feedbacks);
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
        // Vérifier si l'utilisateur est connecté et a le rôle coaché
        if (!auth()->user()->hasRole('coache')) {
            return response()->json(['message' => 'Seuls les coachés peuvent donner des feedbacks'], 403);
        }

        // Récupérer toutes les données du request
        $data = $request->all();
        
        // Validation des données
        $validator = Validator::make($data, [
            'commentaire' => 'required|string|max:1000',
            'note' => 'required|integer|min:0|max:5',
            'date_feedback' => 'nullable|date',
            'statut' => 'in:Lu,Non Lu',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Créer le feedback avec les données validées et l'ID de l'utilisateur connecté
        $feedback = new Feedback();
        $feedback->user_id = auth()->id();
        $feedback->commentaire = $request->commentaire;
        $feedback->note = $request->note;
        $feedback->date_feedback = $request->date_feedback ?? now();
        $feedback->statut = $request->statut ?? 'Non Lu';

        // Charger la relation utilisateur pour la réponse
        $feedback->load('user');
        $feedback->save();

        return response()->json([
            'message' => 'Feedback créé avec succès',
            'feedback' => $feedback
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Feedback $feedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Feedback $feedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        //
    }
}
