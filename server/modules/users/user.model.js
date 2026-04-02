const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\\S+@\\S+\\.\\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "provider"], required: true },
    profilePhoto: { type: String, default: null },
    location: { type: String, trim: true },
    serviceCategories: [{ type: String, trim: true }],
    bio: { type: String, maxlength: 500 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1, location: 1 });

module.exports = mongoose.model("User", userSchema);
