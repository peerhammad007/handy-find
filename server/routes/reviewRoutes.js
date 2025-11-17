const express = require('express');
const router = express.Router();
const { createReview, getReviewsForService, getReviewsForProvider, getReviewByBooking } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/service/:serviceId', getReviewsForService);
router.get('/provider/:providerId', getReviewsForProvider);
router.get('/booking/:bookingId', getReviewByBooking);

module.exports = router;
