import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { login } from '../api_service'

// Create columns constant
const columns = [
    {
        name: 'Reason',
        selector: row => row.booking_reason,
    },
    {
        name: 'Booking Date',
        selector: row => row.booking_date,
    },
];

// Styling for input
const TextField = styled.input`
	height: 32px;
	width: 200px;
	border-radius: 3px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;
	&:hover {
		cursor: pointer;
	}
`;

// Styling for clear button in input
const ClearButton = styled.button`
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	height: 34px;
	width: 32px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

// Input box for filtering bookings
const InputFilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <TextField
            id="search"
            type="text"
            placeholder="Filter By Name"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        <ClearButton type="button" onClick={onClear}>
            X
        </ClearButton>
    </>
);

// Create datable component
let DataTableComponent = () => {
    const [token, setToken] = useState('');
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [data, setData] = useState('');
    const didMountRef = useRef(false);

	const [reasonInput, setReasonInput] = useState('');
	const [dateInput, setDateInput] = useState('');


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
            let jsonResponse = JSON.parse(xhr.responseText);

			if (xhr.status >= 200 && xhr.status < 300) {
				setData(jsonResponse);
                console.log(jsonResponse);
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

	// Clear all input values in the form
	const clearFields = () => {
		setReasonInput('');
		setDateInput('');
	}


    // Get data with ajax
    useEffect(() => {

        // If mounted do ajax request for datatable data
        if(didMountRef.current) {
            // Do xhr ajax request
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost/morecorp-api/public/api/show-bookings');
            xhr.addEventListener('load', () => {
                let jsonResponse = JSON.parse(xhr.responseText);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    setData(jsonResponse);
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
            xhr.send();
        }else{
            didMountRef.current = true;
        }
    },[token]); 

    useEffect(() => {
         // Authenticate api calls before data is fetched
        login().then((data) => {setToken(data);});
    },[]);


    // Clear filter array
    let filteredItems = [];

    
    // If data has any values filter the data - this is case sensitive
    if((data?.length > 0)){
        filteredItems = data.filter(
            item => (item.booking_reason && item.booking_reason.includes(filterText)) 
            || (item.booking_date && item.booking_date.includes(filterText))
        );
    }

    // Create header component for the text input and clear button
    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <InputFilterComponent 
                onFilter={e => setFilterText(e.target.value)} 
                onClear={handleClear} 
                filterText={filterText} 
            />
        );
    }, [filterText, resetPaginationToggle]);


    return (
        <>
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
        <div className="card">
            <div className="card-header">Bookings</div>
            <div className="card-body">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    reactive
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                />
            </div>
        </div>
        </>
    );
};

// Export component
export default DataTableComponent;