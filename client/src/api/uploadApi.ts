import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export const uploadImage = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('image', file);
  const token = localStorage.getItem('token');
  const endpoint = token ? `${API_BASE_URL}/uploads` : `${API_BASE_URL}/uploads/public`;
  const res = await axios.post(endpoint, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data.url as string;
};
