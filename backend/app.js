import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Import routes
import authRoutes from "./routes/auth.js";
import boardRoutes from "./routes/board.js";
import taskRoutes from "./routes/task.js";
import contributorRoutes from "./routes/contributor.js";
import userRoutes from "./routes/user.js";

// Import middleware
import { protect } from "./middleware/auth.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({ result: "Server is working!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/board", protect, boardRoutes);
app.use("/api/task", protect, taskRoutes);
app.use("/api/contributor", protect, contributorRoutes);
app.use("/api/user", protect, userRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/workflo")
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
