import React from 'react';
import { Service } from '../../../types/Service';

type ServiceCardProps = {
  service: Service;
  isBooked: boolean;
  isBookingOpen: boolean;
  onBook: () => void;
  children?: React.ReactNode;
};

const ServiceCard = ({ service, isBooked, isBookingOpen, onBook, children }: ServiceCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
        <div className="mt-2 text-sm text-gray-600">
          Provider: <span className="font-medium text-gray-800">{service.provider?.name || 'Unknown'}</span>
        </div>
        <div className="text-sm mt-1">
          Price: <span className="font-medium">{service.price} ({service.priceType})</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">
            {service.category}
          </span>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
        {isBooked ? (
          <button disabled className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium cursor-not-allowed">
            Already booked
          </button>
        ) : (
          <button
            onClick={onBook}
            disabled={isBookingOpen}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            Book
          </button>
        )}
      </div>
    </div>

    {children}
  </div>
);

export default ServiceCard;
