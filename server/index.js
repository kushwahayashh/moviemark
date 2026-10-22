import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import moviesRouter from "./routes/movies.js";
import searchRouter from "./routes/search.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/moviemark";

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

app.use("/api/movies", moviesRouter);
app.use("/api/search", searchRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid movie id" });
  }
  if (err.name === "ValidationError") {
    const message =
      Object.values(err.errors)[0]?.message || "Invalid movie data";
    return res.status(400).json({ error: message });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`API listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
