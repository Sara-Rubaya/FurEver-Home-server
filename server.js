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
      "http://localhost:3000",
      "https://fur-ever-home-client.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Auth routes - register & login
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("FurEver Home API is running...");
});

app.use("/api/reports", reportRoutes);

// Local development
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;