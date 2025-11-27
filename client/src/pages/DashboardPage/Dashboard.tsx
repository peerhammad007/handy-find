import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllServices } from '../../api/serviceApi';
import { getBookings } from '../../api/bookingApi';
import { getReviewsForProvider } from '../../api/reviewApi';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [myServicesCount, setMyServicesCount] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // My services: fetch all services and filter by provider id
        const services = await getAllServices();
        const myServices = services.filter((s: any) => {
          const providerId = (s.provider as any)?._id;
          return providerId === user._id;
        });
        setMyServicesCount(myServices.length);

        // Total bookings: server's GET /bookings returns bookings for current user/provider
        const bookings = await getBookings();
        // For providers show only bookings that they have completed
        let bookingCount = bookings.length;
        if (user.role === 'provider') {
          const completedForProvider = bookings.filter((b: any) => {
            const providerId = typeof b.provider === 'string' ? b.provider : (b.provider as any)?._id;
            return providerId === user._id && b.status === 'completed';
          });
          bookingCount = completedForProvider.length;
        }
        setTotalBookings(bookingCount);

        // Avg rating: fetch reviews for provider and calculate average
        if (user.role === 'provider') {
          const reviews = await getReviewsForProvider(user._id);
          if (reviews.length > 0) {
            const sum = reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
            setAvgRating(Number((sum / reviews.length).toFixed(2)));
          } else {
            setAvgRating(null);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-sky-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Welcome, {user.name}!</h2>
        <p className="mb-8 text-gray-600">Manage your services, bookings, and see your performance at a glance.</p>

        {loading ? (
          <div>Loading stats...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <Link to="/my-services" className="bg-white border border-sky-100 p-6 rounded-lg shadow-sm flex flex-col items-center transition hover:shadow-md">
                <span className="text-4xl font-extrabold text-blue-600 mb-2">{myServicesCount}</span>
                <span className="text-gray-700">My Services</span>
              </Link>

              <Link to="/booking" className="bg-white border border-sky-100 p-6 rounded-lg shadow-sm flex flex-col items-center transition hover:shadow-md">
                <span className="text-4xl font-extrabold text-blue-600 mb-2">{totalBookings}</span>
                <span className="text-gray-700">Total Bookings</span>
              </Link>

              <Link to="/reviews" className="bg-white border border-sky-100 p-6 rounded-lg shadow-sm flex flex-col items-center transition hover:shadow-md">
                <span className="text-4xl font-extrabold text-blue-600 mb-2">{avgRating !== null ? avgRating : '—'}</span>
                <span className="text-gray-700">Avg. Rating</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/my-services" className="bg-sky-50 text-sky-700 px-6 py-3 rounded-md text-center hover:bg-sky-100 transition">View My Services</Link>
              <Link to="/booking" className="bg-sky-50 text-sky-700 px-6 py-3 rounded-md text-center hover:bg-sky-100 transition">View Bookings</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;