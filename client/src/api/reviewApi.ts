import http from './http';
import { Review } from '../types/Review';

export const createReview = async (payload: { bookingId: string; rating: number; comment?: string }): Promise<Review> => {
  const res = await http.post(`/reviews`, payload);
  return res.data
};

export const getReviewsForService = async (serviceId: string): Promise<Review[]> => {
  const res = await http.get(`/reviews/service/${serviceId}`);
  return res.data
};

export const getReviewsForProvider = async (providerId: string): Promise<Review[]> => {
  const res = await http.get(`/reviews/provider/${providerId}`);
  return res.data
};

export const getReviewByBooking = async (bookingId: string): Promise<Review> => {
  const res = await http.get(`/reviews/booking/${bookingId}`);
  return res.data
};