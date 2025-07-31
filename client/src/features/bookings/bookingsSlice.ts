import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Booking } from "../../types/Booking";

interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null,
}

const BookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        fetchBookingsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchBookingsSuccess(state, action: PayloadAction<Booking[]>) {
            state.loading = false;
            state.bookings = action.payload
        },
        fetchBookingsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addBooking(state, action: PayloadAction<Booking>) {
            state.bookings.push(action.payload);
        },
        updateBookingStatus(state, action: PayloadAction<{id: string, status: Booking['status']}>) {
            const booking = state.bookings.find(b => b._id === action.payload.id);
            if(booking) {
                booking.status = action.payload.status;
            }
        },
    },
});

export const { 
     fetchBookingsStart,
     fetchBookingsSuccess, 
     fetchBookingsFailure, 
     addBooking, 
     updateBookingStatus
    } = BookingSlice.actions;

export default BookingSlice.reducer;