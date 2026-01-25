import React, { useState } from 'react';

type RejectFormProps = {
  onConfirm: (comment: string) => Promise<boolean>;
  onCancel: () => void;
};

const RejectForm = ({ onConfirm, onCancel }: RejectFormProps) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    const success = await onConfirm(comment);
    if (success) onCancel();
    setSubmitting(false);
  };

  return (
    <div className="w-full sm:w-[320px] p-3 bg-gray-50 rounded mt-2">
      <textarea
        placeholder="Rejection reason (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          {submitting ? 'Rejecting...' : 'Confirm Reject'}
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

export default RejectForm;
