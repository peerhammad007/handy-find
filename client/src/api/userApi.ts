import http from './http';
import { User } from '../types/User';
import { Booking } from '../types/Booking';

export const getProfile = async (): Promise<User> => {
  const res = await http.get(`/users/profile`);
  return res.data;
};

export const updateProfile = async (payload: Partial<User>): Promise<User> => {
  const res = await http.put(`/users/profile`, payload);
  return res.data;
};

export const getBookingHistory = async (): Promise<Booking[]> => {
  const res = await http.get(`/users/bookings`);
  return res.data;
};