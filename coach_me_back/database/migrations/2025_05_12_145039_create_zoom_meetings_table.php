<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('zoom_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('topic');
            $table->datetime('start_time');
            $table->integer('duration');
            $table->unsignedBigInteger('host_id');
            $table->unsignedBigInteger('guest_id');
            $table->foreign('host_id')->references('id')->on('coaches')->onDelete('cascade');
            $table->foreign('guest_id')->references('id')->on('coachees')->onDelete('cascade');
            $table->string('meeting_id')->nullable()->unique();
            $table->string('join_url')->nullable();
            $table->string('password')->nullable();
            $table->enum('status', ['scheduled', 'started', 'finished', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('zoom_meetings');
    }
};
