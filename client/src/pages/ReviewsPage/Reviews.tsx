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
            <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <p>Only providers can view aggregated reviews. If you are a user, submit reviews from your Bookings page once a booking is completed.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Reviews for Your Services</h2>
            {loading && <div>Loading...</div>}
            {reviews.map(r => (
                <div key={r._id} className="border p-3 rounded mb-2">
                    <div className="flex items-center gap-2">
                        <strong>{r.user?.name}</strong>
                        <span className="text-sm text-gray-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="text-sm">Rating: {r.rating}</div>
                    <div className="text-sm text-gray-700">{r.comment}</div>
                </div>
            ))}
        </div>
    );
}

export default Reviews;