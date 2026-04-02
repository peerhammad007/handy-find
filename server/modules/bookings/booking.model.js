const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
    rejectionComment: { type: String, maxlength: 500 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

bookingSchema.index({ service: 1, date: 1, slot: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
