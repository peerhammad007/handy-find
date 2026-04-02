const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('./booking.controller');
const { protect } = require('../../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
