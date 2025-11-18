import { User } from "./User";

export interface Booking {
    _id: string;
    service: string;
    user: User;
    provider: User;
    date: string;
    slot: string;
    status: 'pending' | 'accepted' | 'completed' | 'rejected';
    rejectionComment?: string;
    createdAt?: string;
}