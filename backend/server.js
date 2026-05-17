
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const packageRoutes = require("./src/routes/package.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const sessionRoutes = require("./src/routes/session.routes");
const userRoutes = require("./src/routes/staff.routes");
const hotspotRoutes = require("./src/routes/hotspot.routes");

const rateLimit = require("express-rate-limit");

require("dotenv").config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many payment requests, please try again later"
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotspot", hotspotRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));