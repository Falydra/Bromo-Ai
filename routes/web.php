<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Ai\ChatController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome',);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');})->name('dashboard');

Route::post('/chat', [ChatController::class, 'askQuestion'])->name('bromo.chat');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
