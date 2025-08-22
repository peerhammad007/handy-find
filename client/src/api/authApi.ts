import http from './http';
import { API_BASE_URL } from '../config/apiConfig';
import { RegisterPayload, LoginPayload, AuthResponse } from '../types/Auth';

export const register = async (payload: RegisterPayload) => {
  const response = await http.post(`${API_BASE_URL}/auth/register`, payload);
  return response.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await http.post(`${API_BASE_URL}/auth/login`, payload);
  return response.data;
};