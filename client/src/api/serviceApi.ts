import http from './http';
import { API_BASE_URL } from '../config/apiConfig';
import { Service } from '../types/Service';

export const getAllServices = async (): Promise<Service[]> => {
  const res = await http.get(`${API_BASE_URL}/services`);
  return res.data;
};

export const createService = async (payload: Partial<Service>) => {
  const res = await http.post(`${API_BASE_URL}/services`, payload);
  return res.data;
};

export const updateService = async (id: string, payload: Partial<Service>) => {
  const res = await http.put(`${API_BASE_URL}/services/${id}`, payload);
  return res.data;
};

export const removeService = async (id: string) => {
  const res = await http.delete(`${API_BASE_URL}/services/${id}`);
  return res.data;
};

const serviceApi = {
  getAllServices,
  createService,
  updateService,
  removeService,
};

export default serviceApi;
export {};