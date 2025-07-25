import { User } from "./User";
export interface Service {
    _id: string;
    provider: User;
    title: string;
    description: string;
    price: number;
    priceType: 'hour' | 'fixed';
    images?: string[];
    category: string;
    serviceableLocations: string[];
    availability?: { date: string; slots: string[] }[];
    isActive: boolean;
    createdAt: string;
}