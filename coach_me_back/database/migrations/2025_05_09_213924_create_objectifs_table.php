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
        Schema::create('objectifs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dedie_a');
            $table->unsignedBigInteger('creer_par');
            $table->string('titre');
            $table->enum('statut', ['En cours', 'Terminé'])->default('En cours');
            $table->foreign('dedie_a')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('creer_par')->references('id')->on('users')->onDelete('cascade');
            $table->float('progression')->default(0);
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('objectifs');
    }
};
