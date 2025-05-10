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
        Schema::create('sous_objectifs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('objectif_id')->constrained('objectifs')->onDelete('cascade');
            $table->string('titre');
            $table->enum('statut', ['En cours', 'Terminé'])->default('En cours');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sous_objectifs');
    }
};
