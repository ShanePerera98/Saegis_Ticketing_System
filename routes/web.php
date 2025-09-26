<?php

use App\Http\Controllers\SPAController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// SPA Routes for Ticketing System
Route::get('/tickets/{path?}', [SPAController::class, 'index'])
    ->where('path', '.*')
    ->name('spa');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
