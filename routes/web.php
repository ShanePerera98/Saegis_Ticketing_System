<?php

use App\Http\Controllers\SPAController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/tickets');
})->name('home');

// Login route to serve React login page
Route::get('/login', [SPAController::class, 'index'])
    ->name('login');

// SPA Routes for Ticketing System - this should catch all SPA routes
Route::get('/tickets/{path?}', [SPAController::class, 'index'])
    ->where('path', '.*')
    ->name('spa');

// Catch all other SPA routes (dashboard, client, etc.)
Route::get('/{path}', [SPAController::class, 'index'])
    ->where('path', '^(?!api|_debugbar|storage).*')
    ->name('spa-catchall');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
