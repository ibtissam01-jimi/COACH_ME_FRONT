<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('abonnement_id')->nullable();
            $table->unsignedBigInteger('ressource_id')->nullable();
            $table->float('montant');
            $table->date('date_paiement');
            $table->enum('methode', ['cache', 'virement']);
            $table->enum('statut', ['payé', 'en attente', 'annulé']);
            $table->timestamps();
        
            $table->foreign('abonnement_id')->references('id')->on('abonnements')->onDelete('cascade');
            $table->foreign('ressource_id')->references('id')->on('ressources')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
