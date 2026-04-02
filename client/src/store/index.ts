import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import bookingsReducer from "../features/bookings/store/bookingsSlice";
import reviewsReducer from "../features/reviews/store/reviewsSlice";
import servicesReducer from "../features/services/store/servicesSlice";
import usersReducer from "../features/users/store/usersSlice";

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
