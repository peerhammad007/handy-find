import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getBookings as apiGetBookings, updateBookingStatus as apiUpdateBookingStatus } from '../../api/bookingApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchBookingsStart, fetchBookingsSuccess, fetchBookingsFailure, updateBookingStatus } from '../../features/bookings/bookingsSlice';
import { createReview as apiCreateReview, getReviewByBooking } from '../../api/reviewApi';

function Booking() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const bookings = useSelector((state: RootState) => state.bookings.bookings);
    const loading = useSelector((state: RootState) => state.bookings.loading);
    const [error, setError] = useState<string | null>(null);
    const [openReviewId, setOpenReviewId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>('');
    // null = not yet loaded, otherwise map bookingId -> rating number
    const [reviewedMap, setReviewedMap] = useState<Record<string, number> | null>(null);

    const renderStars = (rating: number) => {
        const full = '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))));
        const empty = '☆'.repeat(5 - full.length);
        return <span className="text-yellow-500">{full}{empty}</span>;
    };

    useEffect(() => {
        const load = async () => {
            dispatch(fetchBookingsStart());
            try {
                const res = await apiGetBookings();
                dispatch(fetchBookingsSuccess(res));
                // determine which bookings already have reviews (for users)
                if (user?.role === 'user') {
                    const completed = res.filter((b: any) => b.status === 'completed');
                    const checks = await Promise.all(completed.map(async (b: any) => {
                        try {
                            const review = await getReviewByBooking(b._id);
                            return { id: b._id, rating: review.rating };
                        } catch (e: any) {
                            return { id: b._id, rating: null };
                        }
                    }));
                    const map: Record<string, number> = {};
                    checks.forEach((c: any) => { if (c.rating !== null && c.rating !== undefined) map[c.id] = c.rating; });
                    setReviewedMap(map);
                }
            } catch (err: any) {
                dispatch(fetchBookingsFailure(err.message || 'Failed to load bookings'));
                setError(err.message || 'Failed to load bookings');
            }
        };
        load();
    }, [dispatch]);

    const handleUpdate = async (id: string, status: any) => {
        try {
            await apiUpdateBookingStatus(id, status);
            dispatch(updateBookingStatus({ id, status }));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    if (loading) return <div className="max-w-4xl mx-auto mt-12 p-6">Loading bookings...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>
            {error && <div className="text-red-600">{error}</div>}
            <div className="grid gap-4">
                {bookings.map(b => {
                    const serviceLabel = typeof b.service === 'object' ? (b.service as any)?.title || (b.service as any)?._id : b.service;
                    const userLabel = typeof b.user === 'object' ? (b.user as any)?.name || (b.user as any)?._id : b.user;
                    const userPhone = typeof b.user === 'object' ? (b.user as any)?.phone : undefined;

                    return (
                        <div key={b._id} className="border p-3 rounded flex justify-between items-center">
                            <div>
                                <div><strong>Service:</strong> {serviceLabel}</div>
                                <div><strong>Date:</strong> {b.date} <strong>Slot:</strong> {b.slot}</div>
                                <div><strong>Status:</strong> {b.status}</div>
                                {reviewedMap && b._id in reviewedMap && (
                                    <div className="mt-1"><strong>Rating:</strong> {renderStars(reviewedMap[b._id])}</div>
                                )}
                                {user?.role === 'provider' && (
                                  <div><strong>Booker:</strong> {userLabel}{userPhone ? ` — ${userPhone}` : ''}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {user?.role === 'provider' && (
                                    <>
                                        {b.status === 'pending' && <button onClick={() => handleUpdate(b._id, 'accepted')} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>}
                                        {b.status === 'accepted' && <button onClick={() => handleUpdate(b._id, 'completed')} className="bg-blue-600 text-white px-3 py-1 rounded">Mark Completed</button>}
                                    </>
                                )}
                                                {user?.role === 'user' && b.status === 'completed' && reviewedMap !== null && !(b._id in reviewedMap) && (
                                    <>
                                        {!openReviewId || openReviewId !== b._id ? (
                                            <button onClick={() => { setOpenReviewId(b._id); setReviewRating(5); setReviewComment(''); }} className="bg-yellow-500 text-white px-3 py-1 rounded">Write Review</button>
                                        ) : (
                                            <div className="p-2 border rounded bg-gray-50">
                                                <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="border p-1 rounded mb-2">
                                                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                                                </select>
                                                <textarea placeholder="Comment" value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="block w-full border p-2 rounded mb-2" />
                                                <div className="flex gap-2">
                                                    <button onClick={async () => {
                                                            try {
                                                                await apiCreateReview({ bookingId: b._id, rating: reviewRating, comment: reviewComment });
                                                                alert('Review submitted');
                                                                setReviewedMap(prev => ({ ...(prev || {}), [b._id]: reviewRating }));
                                                                setOpenReviewId(null);
                                                            } catch (err: any) {
                                                                alert(err.response?.data?.message || 'Failed to submit review');
                                                            }
                                                    }} className="bg-green-600 text-white px-3 py-1 rounded">Submit</button>
                                                    <button onClick={() => setOpenReviewId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default Booking;