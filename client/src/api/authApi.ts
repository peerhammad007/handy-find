import http from './http';
import { RegisterPayload, LoginPayload, AuthResponse } from '../types/Auth';

export const register = async (payload: RegisterPayload) => {
  const response = await http.post(`/auth/register`, payload);
  return response.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await http.post(`/auth/login`, payload);
  return response.data;
};