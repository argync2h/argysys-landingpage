<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(base_path('index.html'));
});

Route::get('/styles.css', function () {
    return response()->file(base_path('styles.css'), [
        'Content-Type' => 'text/css; charset=UTF-8',
    ]);
});

Route::get('/app.js', function () {
    return response()->file(base_path('app.js'), [
        'Content-Type' => 'application/javascript; charset=UTF-8',
    ]);
});
