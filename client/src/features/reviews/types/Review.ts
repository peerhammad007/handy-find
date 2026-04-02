import { Booking } from "../../bookings/types/Booking";
import { User } from "../../users/types/User";
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
