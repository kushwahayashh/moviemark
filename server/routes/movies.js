import { Router } from "express";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";

const TMDB_MOVIE_URL = "https://api.themoviedb.org/3/movie";

const router = Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.json(movies);
});

router.get("/:id/backdrop", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  if (movie.backdropPath) {
    return res.json({ backdropPath: movie.backdropPath });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB API key is not configured" });
  }

  const params = new URLSearchParams({ api_key: apiKey });

  try {
    const response = await fetch(
      `${TMDB_MOVIE_URL}/${movie.tmdbId}?${params}`,
    );

    if (!response.ok) {
      console.error(
        `TMDB backdrop lookup failed with status ${response.status}`,
      );
      return res
        .status(502)
        .json({ error: "Movie backdrop is unavailable right now" });
    }

    const data = await response.json();
    const backdropPath = data.backdrop_path || null;

    if (backdropPath) {
      movie.backdropPath = backdropPath;
      await movie.save();
    }

    res.json({ backdropPath });
  } catch (error) {
    console.error("TMDB backdrop error:", error.cause?.code || error.name);
    res
      .status(502)
      .json({ error: "Movie backdrop is unavailable right now" });
  }
});

router.post("/", async (req, res) => {
  const {
    tmdbId,
    title,
    year = "",
    posterPath = null,
    backdropPath = null,
  } = req.body ?? {};

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    return res.status(400).json({ error: "A valid TMDB movie id is required" });
  }
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Movie title is required" });
  }
  if (year !== "" && (typeof year !== "string" || !/^\d{4}$/.test(year))) {
    return res.status(400).json({ error: "Year must be a 4-digit string" });
  }
  if (
    posterPath !== null &&
    (typeof posterPath !== "string" || !posterPath.startsWith("/"))
  ) {
    return res.status(400).json({ error: "Invalid poster path" });
  }
  if (
    backdropPath !== null &&
    (typeof backdropPath !== "string" || !backdropPath.startsWith("/"))
  ) {
    return res.status(400).json({ error: "Invalid backdrop path" });
  }

  try {
    const movie = await Movie.create({
      tmdbId,
      title: title.trim(),
      year,
      posterPath,
      backdropPath,
    });
    res.status(201).json(movie);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "Movie is already in your collection" });
    }
    throw error;
  }
});

router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  const { rating, note } = req.body ?? {};

  if (rating === undefined && note === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  if (
    rating !== undefined &&
    rating !== null &&
    (!Number.isInteger(rating) || rating < 1 || rating > 10)
  ) {
    return res
      .status(400)
      .json({ error: "Rating must be a whole number from 1 to 10" });
  }
  if (note !== undefined && typeof note !== "string") {
    return res.status(400).json({ error: "Note must be text" });
  }
  if (typeof note === "string" && note.length > 1000) {
    return res
      .status(400)
      .json({ error: "Note must be 1000 characters or fewer" });
  }

  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  if (rating !== undefined) movie.rating = rating;
  if (note !== undefined) movie.note = note;
  await movie.save();

  res.json(movie);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid movie id" });
  }

  const deleted = await Movie.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.status(204).end();
});

export default router;
