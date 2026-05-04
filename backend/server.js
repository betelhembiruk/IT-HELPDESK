import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("API Running...");
});

// =====================
// DB CONNECTION + SERVER START
// =====================
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
    process.exit(1);
  }
};

startServer();