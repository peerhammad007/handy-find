const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    price: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ["hour", "fixed"], required: true },
    images: [{ type: String }],
    category: { type: String, required: true, trim: true, index: true },
    serviceableLocations: [{ type: String, trim: true }],
    availability: [
      {
        date: { type: String },
        slots: [{ type: String }],
      },
    ],
    isActive: { type: Boolean, default: true, index: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ provider: 1, isActive: 1 });
serviceSchema.index({ price: 1 });

module.exports = mongoose.model("Service", serviceSchema);
