const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceType: { type: String, enum: ['hour', 'fixed'], required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  serviceableLocations: [{ type: String }],
  availability: [{ date: String, slots: [String] }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
