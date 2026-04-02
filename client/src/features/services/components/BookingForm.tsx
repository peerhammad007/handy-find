import React, { useState } from 'react';
import { createBooking } from '../../bookings/api/bookingApi';
import { useNotify } from '../../../shared/components/Toast/ToastProvider';

type BookingFormProps = {
  serviceId: string;
  serviceTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const BookingForm = ({ serviceId, serviceTitle, onSuccess, onCancel }: BookingFormProps) => {
  const { notify } = useNotify();
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !slot) {
      notify('warning', 'Please pick date and slot');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({ serviceId, date, slot });
      notify('success', 'Booking created');
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Booking failed';
      notify('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="mt-4 border-t pt-4 bg-gray-50 p-3 rounded">
      <h4 className="font-semibold">Create Booking for {serviceTitle}</h4>
      <div className="grid grid-cols-1 gap-2 mt-2">
        <input
          type="date"
          min={minDateStr}
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <select
          value={slot}
          onChange={e => setSlot(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          <option value="">Select a time slot</option>
          <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
          <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
          <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
          <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
        </select>
        <div className="flex flex-col sm:flex-row gap-2 justify-end sm:items-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
