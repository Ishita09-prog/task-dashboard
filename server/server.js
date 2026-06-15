import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check (used by Render and for sanity checks)
app.get("/", (req, res) =>
  res.json({ status: "ok", service: "TaskFlow API", version: "1.0.0" })
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TaskFlow API running on port ${PORT}`));
