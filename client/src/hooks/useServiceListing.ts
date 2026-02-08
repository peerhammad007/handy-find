import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getAllServices } from "../api/serviceApi";
import { getBookings } from "../api/bookingApi";
import {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
} from "../features/services/servicesSlice";
import { Service } from "../types/Service";
import { Booking } from "../types/Booking";

type SearchField = "title" | "category";

export const useServiceListings = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector(
    (state: RootState) => state.services,
  );
  const [activeBookedServiceIds, setActiveBookedServiceIds] = useState<
    Set<string>
  >(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("title");

  const loadServices = useCallback(async () => {
    dispatch(fetchServicesStart());
    try {
      const [allServices, myBookings] = await Promise.all([
        getAllServices(),
        getBookings().catch(() => [] as Booking[]),
      ]);

      // Sort by newest first
      const sorted = [...allServices].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Dispatch to Redux store
      dispatch(fetchServicesSuccess(sorted));

      // Track active bookings (local state - only needed in this component)
      const activeIds = new Set<string>();
      myBookings.forEach((b) => {
        if (b.status === "pending" || b.status === "accepted") {
          const serviceId =
            typeof b.service === "object"
              ? (b.service as Service)._id
              : b.service;
          if (serviceId) activeIds.add(String(serviceId));
        }
      });
      setActiveBookedServiceIds(activeIds);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load services";
      dispatch(fetchServicesFailure(message));
    }
  }, [dispatch]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services;
    const term = searchTerm.trim().toLowerCase();
    return services.filter((s) => {
      const value = searchField === "title" ? s.title : s.category;
      return value?.toLowerCase().includes(term);
    });
  }, [services, searchTerm, searchField]);

  const markAsBooked = useCallback((serviceId: string) => {
    setActiveBookedServiceIds((prev) => new Set(prev).add(serviceId));
  }, []);

  return {
    services: filteredServices,
    activeBookedServiceIds,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    markAsBooked,
    reload: loadServices,
  };
};
