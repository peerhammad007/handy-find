import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Review } from "../../types/Review";

interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null
}

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        fetchReviewsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchReviewsSuccess(state, action: PayloadAction<Review[]>) {
            state.loading = false;
            state.reviews = action.payload;
        },
        fetchReviewsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addReview(state, action: PayloadAction<Review>) {
            state.reviews.push(action.payload);
        }
    }
})

export const {
    fetchReviewsStart,
    fetchReviewsSuccess,
    fetchReviewsFailure,
    addReview
} = reviewSlice.actions;

export default reviewSlice.reducer;