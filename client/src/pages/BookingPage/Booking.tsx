import React, { useEffect, useState } from 'react';
import { useNotify } from '../../components/Toast/ToastProvider';
import useAuth from '../../hooks/useAuth';
import { getBookings as apiGetBookings, updateBookingStatus as apiUpdateBookingStatus } from '../../api/bookingApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchBookingsStart, fetchBookingsSuccess, fetchBookingsFailure, updateBookingStatus } from '../../features/bookings/bookingsSlice';
import { createReview as apiCreateReview, getReviewByBooking } from '../../api/reviewApi';

function Booking() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { notify } = useNotify();
    const bookings = useSelector((state: RootState) => state.bookings.bookings);
    const loading = useSelector((state: RootState) => state.bookings.loading);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const PAGE_SIZE = 6;
    const [error, setError] = useState<string | null>(null);
    const [openReviewId, setOpenReviewId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>('');
        const [openRejectId, setOpenRejectId] = useState<string | null>(null);
        const [rejectComment, setRejectComment] = useState<string>('');
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

    const handleUpdate = async (id: string, status: any, comment?: string) => {
        try {
            await apiUpdateBookingStatus(id, status, comment);
            dispatch(updateBookingStatus({ id, status, rejectionComment: comment }));
            notify('success', 'Booking updated');
        } catch (err: any) {
            notify('error', err.response?.data?.message || 'Failed to update');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">Loading bookings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Bookings</h2>
                {error && <div className="text-red-600">{error}</div>}

                <div className="grid gap-4">
                    {bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((b: any) => {
                        const serviceLabel = typeof b.service === 'object' ? (b.service as any)?.title || (b.service as any)?._id : b.service;
                        const userLabel = typeof b.user === 'object' ? (b.user as any)?.name || (b.user as any)?._id : b.user;
                        const userPhone = typeof b.user === 'object' ? (b.user as any)?.phone : undefined;

                        return (
                            <div key={b._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="text-sm text-gray-500">Service</div>
                                    <div className="text-lg font-semibold text-gray-900">{serviceLabel}</div>
                                    <div className="text-sm text-gray-600">{b.date} • <span className="font-medium">{b.slot}</span></div>
                                    <div className="inline-flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">{b.status}</span>
                                        {reviewedMap && b._id in reviewedMap && (
                                            <span className="text-sm text-yellow-500">{renderStars(reviewedMap[b._id])}</span>
                                        )}
                                        {user?.role === 'provider' && (
                                            <div className="text-sm text-gray-600">Booked by <span className="font-medium">{userLabel}</span>{userPhone ? ` • ${userPhone}` : ''}</div>
                                        )}
                                    </div>
                                    {b.status === 'rejected' && b.rejectionComment && (
                                        <div className="mt-2 text-sm text-red-600">Reason: <span className="font-medium text-gray-800">{b.rejectionComment}</span></div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:items-end gap-2">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {user?.role === 'provider' && b.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdate(b._id, 'accepted')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Accept</button>
                                                <button onClick={() => { setOpenRejectId(b._id); setRejectComment(''); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Reject</button>
                                            </>
                                        )}
                                        {user?.role === 'provider' && b.status === 'accepted' && (
                                            <button onClick={() => handleUpdate(b._id, 'completed')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Mark Completed</button>
                                        )}
                                    </div>

                                    {user?.role === 'user' && b.status === 'completed' && reviewedMap !== null && !(b._id in reviewedMap) && (
                                        !openReviewId || openReviewId !== b._id ? (
                                            <button onClick={() => { setOpenReviewId(b._id); setReviewRating(5); setReviewComment(''); }} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Write Review</button>
                                        ) : (
                                            <div className="w-full sm:w-[320px] p-3 bg-gray-50 rounded">
                                                <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="w-full border p-2 rounded mb-2">
                                                    {[5,4,3,2,1].map(v => <option key={v} value={v}>{v}</option>)}
                                                </select>
                                                <textarea placeholder="Comment" value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="block w-full border p-2 rounded mb-2" />
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={async () => {
                                                        try {
                                                            await apiCreateReview({ bookingId: b._id, rating: reviewRating, comment: reviewComment });
                                                            notify('success', 'Review submitted');
                                                            setReviewedMap(prev => ({ ...(prev || {}), [b._id]: reviewRating }));
                                                            setOpenReviewId(null);
                                                        } catch (err: any) {
                                                            notify('error', err.response?.data?.message || 'Failed to submit review');
                                                        }
                                                    }} className="bg-green-600 text-white px-3 py-1 rounded">Submit</button>
                                                    <button onClick={() => setOpenReviewId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {/* Reject form for provider */}
                                    {user?.role === 'provider' && openRejectId === b._id && (
                                        <div className="w-full sm:w-[320px] p-3 bg-gray-50 rounded mt-2">
                                            <textarea placeholder="Rejection reason (optional)" value={rejectComment} onChange={e => setRejectComment(e.target.value)} className="w-full border p-2 rounded mb-2" />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={async () => {
                                                try {
                                                    await handleUpdate(b._id, 'rejected', rejectComment);
                                                    notify('success', 'Booking rejected');
                                                    setOpenRejectId(null);
                                                    setRejectComment('');
                                                } catch (err:any) {
                                                    // errors handled in handleUpdate
                                                }
                                                }} className="bg-red-600 text-white px-3 py-1 rounded">Confirm Reject</button>
                                                <button onClick={() => { setOpenRejectId(null); setRejectComment(''); }} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {bookings.length > PAGE_SIZE && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200">Prev</button>
                        {Array.from({ length: Math.ceil(bookings.length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${p === currentPage ? 'bg-sky-600 text-white' : 'bg-white border'}`}>{p}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(bookings.length / PAGE_SIZE), p + 1))} className="px-3 py-1 rounded bg-gray-200">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Booking;