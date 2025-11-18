import React from 'react';
import { Link } from 'react-router-dom';

const SAMPLE_SERVICES = [
  { id: 'plumbing', name: 'Plumbing' , desc: 'Fix leaks, install taps, and unclog drains.'},
  { id: 'electrical', name: 'Electrical', desc: 'Wiring, switches, fixtures and safety checks.'},
  { id: 'cleaning', name: 'Home Cleaning', desc: 'Regular, deep and move-out cleaning services.'},
  { id: 'carpentry', name: 'Carpentry', desc: 'Custom shelves, repairs and furniture assembly.'},
];

const ServicesInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Services</h2>
        <p className="text-gray-600 mb-6">We connect you with vetted local professionals across common home and business needs.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_SERVICES.map(s => (
            <div key={s.id} className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-medium text-lg text-gray-800">{s.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
              <div className="mt-3">
                <Link to={`/services?category=${s.id}`} className="text-sky-600 hover:underline text-sm">Browse {s.name}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesInfo;
