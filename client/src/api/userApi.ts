import http from './http';
import { API_BASE_URL } from '../config/apiConfig';
import { User } from '../types/User';

export const getProfile = async (): Promise<User> => {
  const res = await http.get(`${API_BASE_URL}/users/profile`);
  return res.data;
};

export const updateProfile = async (payload: Partial<User>): Promise<User> => {
  const res = await http.put(`${API_BASE_URL}/users/profile`, payload);
  return res.data;
};

export const getBookingHistory = async () => {
  const res = await http.get(`${API_BASE_URL}/users/bookings`);
  return res.data;
};

const userApi = { getProfile, updateProfile, getBookingHistory };
export default userApi;
export {};