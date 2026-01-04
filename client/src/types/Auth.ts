import { User } from "./User";
export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'provider';
    location?: string;
    serviceCategories?: string[];
    bio?: string;
    profilePhoto?: string | null;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User
}