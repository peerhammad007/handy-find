import { Booking } from "./Booking";
import { User } from "./User";
export interface Review {
    _id: string;
    booking: Booking;
    service: string;
    user: User;
    provider: User;
    rating: number;
    comment?: string;
    createdAt?: string;
}