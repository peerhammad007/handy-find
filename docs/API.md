# HandyFind API Documentation

## Auth
- POST `/api/auth/register` - Register user/provider
- POST `/api/auth/login` - Login

## Services
- GET `/api/services` - List services (filters)
- GET `/api/services/:id` - Service details
- POST `/api/services` - Create service (provider)
- PUT `/api/services/:id` - Edit service (provider)
- DELETE `/api/services/:id` - Delete service (provider)

## Bookings
- POST `/api/bookings` - Book service
- GET `/api/bookings` - List bookings (user/provider)
- PUT `/api/bookings/:id/status` - Update booking status (provider)

## Users
- GET `/api/users/profile` - Get profile
- PUT `/api/users/profile` - Edit profile
- GET `/api/users/bookings` - Booking history

## Reviews
- POST `/api/reviews` - Add review
- GET `/api/reviews/service/:serviceId` - Reviews for service
- GET `/api/reviews/provider/:providerId` - Reviews for provider
