
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const auth = require("./src/routes/auth.routes")

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", auth);
// app.use("/api/packages", require("./routes/packageRoutes"));
// app.use("/api/payments", require("./routes/paymentRoutes"));
// app.use("/api/sessions", require("./routes/sessionRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));