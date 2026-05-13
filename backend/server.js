
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes")
const packageRoutes = require("./src/routes/package.routes")
const paymentRoutes = require("./src/routes/payment.routes")
// const sessionRoutes = require("./src/routes/package.routes")

require("dotenv").config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
// app.use("/api/sessions", sessionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));