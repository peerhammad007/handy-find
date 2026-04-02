const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getBookingHistory,
} = require("./user.controller");
const { protect } = require("../../middleware/authMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/bookings", protect, getBookingHistory);

module.exports = router;
