import React from 'react';
import { Booking } from '../../../types/Booking';

type BookingCardProps = {
  booking: Booking;
  showUserInfo?: boolean;
  reviewRating?: number;
  children?: React.ReactNode;
};

const renderStars = (rating: number) => {
  const full = '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))));
  const empty = '☆'.repeat(5 - full.length);
  return <span className="text-yellow-500">{full}{empty}</span>;
};

const BookingCard = ({ booking, showUserInfo, reviewRating, children }: BookingCardProps) => {
  const serviceTitle = typeof booking.service === 'object'
    ? (booking.service as any)?.title || booking.service
    : booking.service;
  const userName = typeof booking.user === 'object' ? booking.user.name : booking.user;
  const userPhone = typeof booking.user === 'object' ? booking.user.phone : undefined;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex-1 space-y-1">
        <div className="text-sm text-gray-500">Service</div>
        <div className="text-lg font-semibold text-gray-900">{serviceTitle}</div>
        <div className="text-sm text-gray-600">{booking.date} • <span className="font-medium">{booking.slot}</span></div>

        <div className="inline-flex items-center gap-2 mt-1 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">
            {booking.status}
          </span>
          {reviewRating && renderStars(reviewRating)}
          {showUserInfo && (
            <span className="text-sm text-gray-600">
              Booked by <span className="font-medium">{userName}</span>
              {userPhone && ` • ${userPhone}`}
            </span>
          )}
        </div>

        {booking.status === 'rejected' && booking.rejectionComment && (
          <div className="mt-2 text-sm text-red-600">
            Reason: <span className="font-medium text-gray-800">{booking.rejectionComment}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:items-end gap-2">{children}</div>
    </div>
  );
};

export default BookingCard;
