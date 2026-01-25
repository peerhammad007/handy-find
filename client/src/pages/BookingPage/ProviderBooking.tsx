import React, { useState } from 'react';
import BookingCard from './components/BookingCard';
import RejectForm from './components/RejectForm';
import { useBooking } from '../../hooks/useBooking';
import Pagination from '../../components/Ui/Pagination';

const PAGE_SIZE = 6;

const ProviderBookings = () => {
  const { bookings, loading, error, handleStatusUpdate } = useBooking('provider');
  const [currentPage, setCurrentPage] = useState(1);
  const [openRejectId, setOpenRejectId] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  const paginatedBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid gap-4">
        {paginatedBookings.map(booking => (
          <BookingCard key={booking._id} booking={booking} showUserInfo>
            {booking.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => setOpenRejectId(booking._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors"
                >
                  Reject
                </button>
              </div>
            )}

            {booking.status === 'accepted' && (
              <button
                onClick={() => handleStatusUpdate(booking._id, 'completed')}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors"
              >
                Mark Completed
              </button>
            )}

            {openRejectId === booking._id && (
              <RejectForm
                onConfirm={comment => handleStatusUpdate(booking._id, 'rejected', comment)}
                onCancel={() => setOpenRejectId(null)}
              />
            )}
          </BookingCard>
        ))}
      </div>

      <Pagination total={bookings.length} pageSize={PAGE_SIZE} current={currentPage} onChange={setCurrentPage} />
    </>
  );
};

export default ProviderBookings;
