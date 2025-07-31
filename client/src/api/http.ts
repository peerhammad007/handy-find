import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

// Create Axios instance
const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optionally handle global errors here
        return Promise.reject(error)
    }
);

export default http;

