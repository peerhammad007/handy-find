const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('service provider');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
