import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import boardRouter from "./routes/board.js";
import contributorRouter from "./routes/contributor.js";
import taskRouter from "./routes/task.js";
import inviteRouter from "./routes/invite.js";
import { auth } from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.get("/api", (req, res) => {
  res.status(200).json({ result: "Server is working!" });
});
app.use("/api/auth", authRouter);
app.use("/api/user", auth, userRouter);
app.use("/api/contributor", auth, contributorRouter);
app.use("/api/board", auth, boardRouter);
app.use("/api/task", auth, taskRouter);
app.use("/api/invite", auth, inviteRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
