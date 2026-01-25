import React, { useState } from 'react';
import BookingCard from './components/BookingCard';
import ReviewForm from './components/ReviewForm';
import { useBooking } from '../../hooks/useBooking';
import Pagination from '../../components/Ui/Pagination';

const PAGE_SIZE = 6;

const UserBookings = () => {
  const { bookings, loading, error, reviewedMap, markReviewed } = useBooking('user');
  const [currentPage, setCurrentPage] = useState(1);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  const paginatedBookings = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid gap-4">
        {paginatedBookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            reviewRating={reviewedMap[booking._id]}
          >
            {booking.status === 'completed' && !reviewedMap[booking._id] && (
              openReviewId === booking._id ? (
                <ReviewForm
                  bookingId={booking._id}
                  onSuccess={rating => {
                    markReviewed(booking._id, rating);
                    setOpenReviewId(null);
                  }}
                  onCancel={() => setOpenReviewId(null)}
                />
              ) : (
                <button
                  onClick={() => setOpenReviewId(booking._id)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors"
                >
                  Write Review
                </button>
              )
            )}
          </BookingCard>
        ))}
      </div>

      <Pagination total={bookings.length} pageSize={PAGE_SIZE} current={currentPage} onChange={setCurrentPage} />
    </>
  );
};

export default UserBookings;
