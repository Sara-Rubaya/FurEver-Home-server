import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

connectDB();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fur-ever-home-client.vercel.app",
    ],
    credentials: true,
  
  })
);

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Report routes
app.use("/api/reports", reportRoutes);

// Root
app.get("/", (req, res) => {
  res.send("FurEver Home API is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

export default app;