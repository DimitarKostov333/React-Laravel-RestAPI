<?php

namespace App\Http\Controllers;

use App\Models\Bookings;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class BookingController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct(Request $request){
        $request->user();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showBookings()
    {
        // Get data for selection in the form
        $bookings = Bookings::all();

        // Return json object
        return response()->json($bookings);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createBooking(Request $request)
    {


        $booking = Bookings::create([
            'booking_reason' => $request->booking_reason,
            'booking_date' => $request->booking_date
        ]);

        $booking->save();

        // Get all bookings again
        $bookingsUpdate = Bookings::all();

        // Return json object
        return response()->json($bookingsUpdate);
    }
}
