import http from './http';
import { API_BASE_URL } from '../config/apiConfig';
import { Booking } from '../types/Booking';

export const createBooking = async (payload: { serviceId: string; date: string; slot: string }) => {
  const res = await http.post(`${API_BASE_URL}/bookings`, payload);
  return res.data as Booking;
};

export const getBookings = async () => {
  const res = await http.get(`${API_BASE_URL}/bookings`);
  return res.data as Booking[];
};

export const updateBookingStatus = async (id: string, status: Booking['status'], comment?: string) => {
  // server expects PUT /bookings/:id/status
  // include Authorization header explicitly as a fallback in case interceptor misses it
  const token = localStorage.getItem('token');
  const payload: any = { status };
  if (comment) payload.comment = comment;
  const res = await http.put(
    `${API_BASE_URL}/bookings/${id}/status`,
    payload,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  return res.data as Booking;
};

export default { createBooking, getBookings, updateBookingStatus };
export {};