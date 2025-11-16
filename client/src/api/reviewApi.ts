import http from './http';
import { API_BASE_URL } from '../config/apiConfig';
import { Review } from '../types/Review';

export const createReview = async (payload: { bookingId: string; rating: number; comment?: string }) => {
  const res = await http.post(`${API_BASE_URL}/reviews`, payload);
  return res.data as Review;
};

export const getReviewsForService = async (serviceId: string) => {
  const res = await http.get(`${API_BASE_URL}/reviews/service/${serviceId}`);
  return res.data as Review[];
};

export const getReviewsForProvider = async (providerId: string) => {
  const res = await http.get(`${API_BASE_URL}/reviews/provider/${providerId}`);
  return res.data as Review[];
};

export default { createReview, getReviewsForService, getReviewsForProvider };
export {};