import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getReviewsForProvider } from '../../api/reviewApi';

function Reviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const PAGE_SIZE = 6;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (user?.role !== 'provider') return;
            setLoading(true);
            try {
                const res = await getReviewsForProvider(user._id);
                const sorted = [...res].sort((a: any, b: any) => getItemTime(b) - getItemTime(a));
                setReviews(sorted);
            } catch (err) {
                // ignore for now
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const getItemTime = (item: any): number => {
        if (item?.createdAt) {
            const t = Date.parse(item.createdAt);
            if (!isNaN(t)) return t;
        }
        if (item?._id && typeof item._id === 'string' && item._id.length >= 8) {
            const seconds = parseInt(item._id.substring(0, 8), 16);
            if (!isNaN(seconds)) return seconds * 1000;
        }
        return 0;
    };

    if (user?.role !== 'provider') {
        return (
            <div className="min-h-screen bg-sky-50 pt-20">
                <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    <p>Only providers can view aggregated reviews. If you are a user, submit reviews from your Bookings page once a booking is completed.</p>
                </div>
            </div>
        );
    }

    const renderStars = (rating: number) => {
        const full = '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))));
        const empty = '☆'.repeat(5 - full.length);
        return <span className="text-yellow-500">{full}{empty}</span>;
    };

    return (
        <div className="min-h-screen bg-sky-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Reviews for Your Services</h2>
                {loading && <div>Loading...</div>}
                {reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((r: any) => (
                    <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div className="font-medium">{r.user?.name}</div>
                                <div className="text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                            </div>
                            <div className="text-yellow-500 text-lg sm:self-center">{renderStars(r.rating)}</div>
                        </div>
                        {r.comment && <div className="mt-3 text-gray-700">{r.comment}</div>}
                    </div>
                ))}
                {reviews.length > PAGE_SIZE && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200">Prev</button>
                        {Array.from({ length: Math.ceil(reviews.length / PAGE_SIZE) }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded ${p === currentPage ? 'bg-sky-600 text-white' : 'bg-white border'}`}>{p}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(reviews.length / PAGE_SIZE), p + 1))} className="px-3 py-1 rounded bg-gray-200">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reviews;