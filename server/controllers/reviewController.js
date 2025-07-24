const Review = require('../models/Review');
const Booking = require('../models/Booking');

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') return res.status(400).json({ message: 'Review not allowed' });
    const review = new Review({
      booking: bookingId,
      service: booking.service,
      user: booking.user,
      provider: booking.provider,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForService = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId }).populate('user', 'name profilePhoto');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForProvider = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId }).populate('user', 'name profilePhoto');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
