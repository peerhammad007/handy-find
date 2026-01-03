import http from './http';
import { Booking } from '../types/Booking';

export const createBooking = async (payload: { serviceId: string; date: string; slot: string }) => {
  const res = await http.post(`/bookings`, payload);
  return res.data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const res = await http.get(`/bookings`);
  return res.data;
};

export const updateBookingStatus = async (id: string, status: Booking['status'], comment?: string): Promise<Booking> => {
  const payload = { status, comment };
  const res = await http.put(`/bookings/${id}/status`, payload);
  return res.data;
};

const bookingApi = { createBooking, getBookings, updateBookingStatus };
export default bookingApi;