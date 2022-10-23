import React, { useEffect, useState } from "react";
import { login } from '../api_service'

// Input box for filtering bookings
const BookingInputComponent = () => {
	// Set state hooks
	const [reasonInput, setReasonInput] = useState('');
	const [dateInput, setDateInput] = useState('');
	const [token, setToken] = useState('');

	const handleSubmit = event => {
		// Stop the form from submitting by default
	  	event.preventDefault();

		const formData = new FormData();
		formData.append("booking_reason", reasonInput);
		formData.append("booking_date", dateInput);
  
		// Do xhr ajax request
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost/morecorp-api/public/api/create-booking');
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				alert('Booking added');
			} else {
				return {
					status: xhr.status,
					statusText: xhr.statusText
				};
			}

		});

		// Set headers
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.setRequestHeader('Authorization', 'Bearer ' + token);
		xhr.onerror = function () {
			return {
				status: xhr.status,
				statusText: xhr.statusText
			};
		};
		
		// Send request
		xhr.send(formData);
	};

	useEffect(() => {
		// Authenticate api calls before data is fetched
	   login().then((data) => {setToken(data);});
   },[]);

	// Clear all input values in the form
	const clearFields = () => {
		setReasonInput('');
		setDateInput('');
	}

	return (
		<div className="row mt-5 mb-5">
			<form className="input-group" onSubmit={handleSubmit}>
				<div className="col-4 m-1">
					<label htmlFor="bookingReason">Booking Reason</label>
					<input
						id="bookingReason"
						type="text"
						className="form-control "
						name="booking_reason"
						value={reasonInput} 
						onInput={e => setReasonInput(e.target.value)}
						aria-label="Booking Reason"
					/>
				</div>
				<div className="col-2 m-1">
					<label htmlFor="bookingDate">Booking Date</label>
					<input
						id="bookingDate"
						type="date"
						className="form-control"
						name="booking_date"
						value={dateInput} 
						onInput={e => setDateInput(e.target.value)}
						data-date-format="yyyy-mm-dd"
						aria-label="Booking Date"
					/>
				</div>
				<div className="col-2 m-1">
					<button className="btn btn-primary mt-4" type="submit">Submit Booking</button>
					<button className="btn btn-danger mt-4 ms-2" onClick={clearFields}>Clear</button>
				</div>
			</form>
		</div>
	)
};

// Export component
export default BookingInputComponent;