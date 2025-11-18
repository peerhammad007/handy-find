import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-6">A simple, three-step process to find and book trusted local professionals.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sky-600 font-bold text-lg">1</div>
            <h4 className="mt-2 font-medium">Search</h4>
            <p className="text-sm text-gray-600 mt-1">Browse services by category, location and rating to find the right pro.</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sky-600 font-bold text-lg">2</div>
            <h4 className="mt-2 font-medium">Book</h4>
            <p className="text-sm text-gray-600 mt-1">Pick a convenient slot and confirm your booking within seconds.</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sky-600 font-bold text-lg">3</div>
            <h4 className="mt-2 font-medium">Review</h4>
            <p className="text-sm text-gray-600 mt-1">Rate your experience to help other users choose the best professionals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
