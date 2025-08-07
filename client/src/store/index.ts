import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import bookingsReducer from '../features/bookings/bookingsSlice'
import reviewsReducer from '../features/reviews/reviewsSlice';
import servicesReducer from '../features/services/servicesSlice';
import usersReducer from '../features/users/usersSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingsReducer,
        reviews: reviewsReducer,
        services: servicesReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;