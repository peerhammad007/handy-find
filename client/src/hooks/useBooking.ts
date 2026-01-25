import { useDispatch, useSelector } from "react-redux";
import { useNotify } from "../components/Toast/ToastProvider";
import { RootState } from "../store";
import { useCallback, useEffect, useState } from "react";
import { Booking } from "../types/Booking";
import { getBookings as apiGetBookings, updateBookingStatus as apiUpdateBookingStatus } from "../api/bookingApi";
import { fetchBookingsFailure, fetchBookingsStart, fetchBookingsSuccess, updateBookingStatus } from "../features/bookings/bookingsSlice";
import { getReviewByBooking } from "../api/reviewApi";

export const useBooking = (userRole?: "user" | "provider") => {
  const dispatch = useDispatch();
  const { notify } = useNotify();

  const { bookings, loading } = useSelector(
    (state: RootState) => state.bookings,
  );
  const [error, setError] = useState<string | null>("");
  const [reviewedMap, setReviewedMap] = useState<Record<string, number>>({});

  const getItemTime = useCallback((item: Booking): number => {
    if (item.createdAt) {
      const t = Date.parse(item.createdAt);
      if (!isNaN(t)) return t;
    }
    return 0;
  }, []);

  const loadBookings = useCallback(async () => {
    dispatch(fetchBookingsStart());
    try {
      const res = await apiGetBookings();
      const sorted = [...res].sort((a, b) => getItemTime(b) - getItemTime(b));
      dispatch(fetchBookingsSuccess(sorted));

      if(userRole === 'user') {
        const completed = sorted.filter(b => b.status === 'completed');
        const checks = await Promise.allSettled(
            completed.map(async b => {
                const review = await getReviewByBooking(b._id);
                return {id: b._id, rating: review.rating};
            })
        )
        const map: Record<string, number> ={};
        checks.forEach((result) => {
            if(result.status === 'fulfilled' && result.value.rating) {
                map[result.value.id] = result.value.rating;
            }
        })
        setReviewedMap(map);
      }
      
    } catch (err: any) {
        const msg = err.message || 'Failed to load bookings';
        dispatch(fetchBookingsFailure(msg));
        setError(msg);
    }
  }, [dispatch, userRole, getItemTime]);

    useEffect(() => {
      loadBookings();
    }, [loadBookings])

    const handleStatusUpdate = useCallback(
      async (id: string, status: Booking['status'], comment?: string) => {
        try {
            await apiUpdateBookingStatus(id, status, comment);
            dispatch(updateBookingStatus({id, status, rejectionComment: comment}))
            notify('success', 'Status updated');
            return true;
        } catch (err: any) {
            notify('error', err.response?.data?.message || 'Failed to update');
            return false;
        }
      },
      [dispatch, notify],
    )
    
    const markReviewed = useCallback(
      (bookingId: string, rating: number) => {
        setReviewedMap((prev) => ({...prev, [bookingId]: rating}))
      },
      [],
    )
    
    return {bookings, loading, error, reviewedMap, reload: loadBookings, markReviewed, handleStatusUpdate};
      
};
