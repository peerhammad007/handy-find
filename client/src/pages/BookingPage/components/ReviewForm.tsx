import React, { useState } from 'react';
import { createReview } from '../../../api/reviewApi';
import { useNotify } from '../../../components/Toast/ToastProvider';

type ReviewFormProps = {
  bookingId: string;
  onSuccess: (rating: number) => void;
  onCancel: () => void;
};

const ReviewForm = ({ bookingId, onSuccess, onCancel }: ReviewFormProps) => {
  const { notify } = useNotify();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createReview({ bookingId, rating, comment });
      notify('success', 'Review submitted');
      onSuccess(rating);
    } catch (err: any) {
      notify('error', err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full sm:w-[320px] p-3 bg-gray-50 rounded">
      <select
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        className="w-full border p-2 rounded mb-2"
      >
        {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} Star{v > 1 && 's'}</option>)}
      </select>
      <textarea
        placeholder="Comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="block w-full border p-2 rounded mb-2"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
