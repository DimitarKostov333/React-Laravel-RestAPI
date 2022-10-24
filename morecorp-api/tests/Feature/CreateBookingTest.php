<?php

namespace Tests\Feature;

use App\Models\Bookings;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateBookingTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Bookings::create([
            'booking_reason' => 'Vacation',
            'booking_date' => '2022-11-23',
        ]);

        $post = Bookings::where(['booking_reason' => 'Vacation'])->first();
        $this->assertEquals('Vacation', $post->booking_reason);
        $this->assertEquals('2022-11-23', $post->booking_date);
    }
}
