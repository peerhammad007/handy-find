import React from 'react';

type PaginationProps = {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
};

const Pagination = ({ total, pageSize, current, onChange }: PaginationProps) => {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center flex-wrap justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            p === current
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white border border-sky-200 text-sky-700 hover:bg-sky-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pages, current + 1))}
        className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
