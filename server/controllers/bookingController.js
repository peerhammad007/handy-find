const Booking = require('../models/Booking');
const Service = require('../models/Service');

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, slot } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    const booking = new Booking({
      service: serviceId,
      user: req.user.userId,
      provider: service.provider,
      date,
      slot,
      status: 'pending',
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};
    if (role === 'provider') query.provider = req.user.userId;
    else query.user = req.user.userId;
    const bookings = await Booking.find(query).populate('service user provider');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Only provider can update status
    if (booking.provider.toString() !== req.user.userId) return res.status(403).json({ message: 'Unauthorized' });

    booking.status = status;
    // If provider rejects, store the rejection comment
    if (status === 'rejected') {
      booking.rejectionComment = comment || '';
    } else {
      // clear any previous rejection comment for other statuses
      booking.rejectionComment = undefined;
    }

    await booking.save();
    const populated = await Booking.findById(booking._id).populate('service user provider');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
