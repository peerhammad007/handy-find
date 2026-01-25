import React from 'react';
import useAuth from '../../hooks/useAuth';
import ProviderBookings from './ProviderBooking';
import UserBookings from './UserBooking';


const Booking = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        {user?.role === 'provider' ? <ProviderBookings /> : <UserBookings />}
      </div>
    </div>
  );
};

export default Booking;
