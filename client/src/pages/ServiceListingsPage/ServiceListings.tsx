import React, { useState } from 'react';
import ServiceCard from '../../features/services/components/ServiceCard';
import BookingForm from '../../features/services/components/BookingForm';
import SearchFilters from '../../features/services/components/SearchFilters';
import Pagination from '../../shared/components/Ui/Pagination';
import { useServiceListings } from '../../features/services/hooks/useServiceListing';

const PAGE_SIZE = 6;

const ServiceListings = () => {
  const {
    services,
    activeBookedServiceIds,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    markAsBooked,
  } = useServiceListings();

  const [currentPage, setCurrentPage] = useState(1);
  const [bookingTargetId, setBookingTargetId] = useState<string | null>(null);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFieldChange = (value: 'title' | 'category') => {
    setSearchField(value);
    setCurrentPage(1);
  };

  const handleBookingSuccess = (serviceId: string) => {
    markAsBooked(serviceId);
    setBookingTargetId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
          Loading services...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sky-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const paginatedServices = services.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-sky-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Service Listings</h2>

        <SearchFilters
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          searchField={searchField}
          onSearchFieldChange={handleFieldChange}
        />

        {services.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No services found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedServices.map(service => (
              <ServiceCard
                key={service._id}
                service={service}
                isBooked={activeBookedServiceIds.has(service._id)}
                isBookingOpen={bookingTargetId === service._id}
                onBook={() => setBookingTargetId(service._id)}
              >
                {bookingTargetId === service._id && (
                  <BookingForm
                    serviceId={service._id}
                    serviceTitle={service.title}
                    onSuccess={() => handleBookingSuccess(service._id)}
                    onCancel={() => setBookingTargetId(null)}
                  />
                )}
              </ServiceCard>
            ))}
          </div>
        )}

        <Pagination
          total={services.length}
          pageSize={PAGE_SIZE}
          current={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ServiceListings;
