import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import "dotenv/config";

import userRouter from "./routes/user.js";
import boardRouter from "./routes/board.js";
import contributorRouter from "./routes/contributor.js";
import taskRouter from "./routes/task.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/api", (req, res) => {
  res.status(200).json({ result: "Server is working!" });
});
app.use("/api/user", userRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
  });
