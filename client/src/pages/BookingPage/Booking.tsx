import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getBookings as apiGetBookings, updateBookingStatus as apiUpdateBookingStatus } from '../../api/bookingApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchBookingsStart, fetchBookingsSuccess, fetchBookingsFailure, updateBookingStatus } from '../../features/bookings/bookingsSlice';
import { createReview as apiCreateReview } from '../../api/reviewApi';

function Booking() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const bookings = useSelector((state: RootState) => state.bookings.bookings);
    const loading = useSelector((state: RootState) => state.bookings.loading);
    const [error, setError] = useState<string | null>(null);
    const [openReviewId, setOpenReviewId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>('');
    // null = not yet loaded, object = map of bookingId -> reviewed boolean
    const [reviewedIds, setReviewedIds] = useState<Record<string, boolean> | null>(null);

    useEffect(() => {
        const load = async () => {
            dispatch(fetchBookingsStart());
            try {
                const res = await apiGetBookings();
                dispatch(fetchBookingsSuccess(res));
                // determine which bookings already have reviews (for users)
                if (user?.role === 'user') {
                    const completed = res.filter((b: any) => b.status === 'completed');
                    const checks = await Promise.all(completed.map((b: any) =>
                        // returns 200 if exists, 404 if not
                        (async () => {
                            try {
                                await (await import('../../api/reviewApi')).getReviewByBooking(b._id);
                                return { id: b._id, reviewed: true };
                            } catch (e: any) {
                                return { id: b._id, reviewed: false };
                            }
                        })()
                    ));
                    const map: Record<string, boolean> = {};
                    checks.forEach((c: any) => { map[c.id] = c.reviewed; });
                    setReviewedIds(map);
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
                                                {user?.role === 'user' && b.status === 'completed' && reviewedIds !== null && !reviewedIds[b._id] && (
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
                                                            setReviewedIds(prev => ({ ...(prev || {}), [b._id]: true }));
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