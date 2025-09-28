<?php

use App\Http\Controllers\SPAController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard route removed — SPA handles tickets and role-based redirects.
// Keep any authenticated routes inside the SPA. The SPA route below serves the ticketing app.

// SPA Routes for Ticketing System
Route::get('/tickets/{path?}', [SPAController::class, 'index'])
    ->where('path', '.*')
    ->name('spa');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
