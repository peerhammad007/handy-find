import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getReviewsForProvider } from '../../api/reviewApi';

function Reviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (user?.role !== 'provider') return;
            setLoading(true);
            try {
                const res = await getReviewsForProvider(user._id);
                setReviews(res);
            } catch (err) {
                // ignore for now
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

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
                {reviews.map((r: any) => (
                    <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm mb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{r.user?.name}</div>
                                <div className="text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                            </div>
                            <div className="text-yellow-500 text-lg">{renderStars(r.rating)}</div>
                        </div>
                        {r.comment && <div className="mt-3 text-gray-700">{r.comment}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reviews;