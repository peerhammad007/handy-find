import http from './http';
import { Service } from '../types/Service';

export const getAllServices = async (): Promise<Service[]> => {
  const res = await http.get(`/services`);
  return res.data;
};

export const createService = async (payload: Partial<Service>): Promise<Service> => {
  const res = await http.post(`/services`, payload);
  return res.data;
};

export const updateService = async (id: string, payload: Partial<Service>): Promise<Service> => {
  const res = await http.put(`/services/${id}`, payload);
  return res.data;
};

export const removeService = async (id: string) => {
  const res = await http.delete(`/services/${id}`);
  return res.data;
};