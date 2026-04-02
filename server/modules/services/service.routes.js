const express = require("express");
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("./service.controller");
const { protect } = require("../../middleware/authMiddleware");

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
