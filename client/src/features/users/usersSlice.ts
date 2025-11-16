import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { Booking } from "../../types/Booking";

interface usersState {
    profile: User | null;
    bookingHistory: Booking[];
    loading: Boolean;
    error: string | null;
}

const initialState: usersState = {
    profile: null,
    bookingHistory: [],
    loading: false,
    error: null
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchProfileStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchProfileSuccess(state, action: PayloadAction<User>) {
            state.loading = false;
            state.profile = action.payload;
        },
        fetchProfileFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload
        },
        updateProfile(state, action: PayloadAction<User>) {
            state.profile = action.payload;
        },
        fetchBookingHistorySuccess(state, action: PayloadAction<Booking[]>) {
            state.bookingHistory = action.payload;
        }
    },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  fetchBookingHistorySuccess,
} = usersSlice.actions;

export default usersSlice.reducer;