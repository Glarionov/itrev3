<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserVisitController;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/create', [UserVisitController::class, 'create']);
Route::get('/get-unique-visits', [UserVisitController::class, 'getUniqueVisits']);
