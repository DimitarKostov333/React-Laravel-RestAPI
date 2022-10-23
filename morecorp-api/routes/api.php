<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Get api token with user credentials
Route::post('/login', [AuthController::class, 'login']);

// Only users with tokens have access to these endpoints.
Route::group(['middleware' => ['auth:sanctum']], function(){
    Route::post('/show-bookings', [BookingController::class, 'showBookings']);
    Route::post('/create-booking', [BookingController::class, 'createBooking']);
});

