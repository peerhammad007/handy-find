export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'provider';
    profilePhoto?: string;
    location: string;
    serviceCategories?: string[];
    bio: string;
    createdAt?: string;
}