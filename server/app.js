const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked"));
    },
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/services", require("./modules/services/service.routes"));
app.use("/api/bookings", require("./modules/bookings/booking.routes"));
app.use("/api/users", require("./modules/users/user.routes"));
app.use("/api/reviews", require("./modules/reviews/review.routes"));
app.use("/api/uploads", require("./modules/uploads/upload.routes"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Error handling middleware
app.use(require("./middleware/errorMiddleware"));

module.exports = app;
