const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider'], required: true },
  profilePhoto: { type: String },
  location: { type: String },
  serviceCategories: [{ type: String }], // for providers
  bio: { type: String }, // for providers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
