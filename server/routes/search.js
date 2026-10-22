import { Router } from "express";

const router = Router();
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

router.get("/", async (req, res) => {
  const query =
    typeof req.query.query === "string" ? req.query.query.trim() : "";

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }
  if (query.length > 100) {
    return res.status(400).json({ error: "Search query is too long" });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB API key is not configured" });
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    query,
    language: "en-US",
    include_adult: "false",
  });

  try {
    const response = await fetch(`${TMDB_SEARCH_URL}?${params}`);

    if (!response.ok) {
      console.error(`TMDB search failed with status ${response.status}`);
      return res
        .status(502)
        .json({ error: "Movie search is unavailable right now" });
    }

    const data = await response.json();
    const results = data.results
      .slice(0, 10)
      .map((movie) => ({
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.slice(0, 4) : "",
        posterPath: movie.poster_path || null,
        backdropPath: movie.backdrop_path || null,
      }));

    res.json(results);
  } catch (error) {
    console.error(
      "TMDB search error:",
      error.cause?.code || error.name,
    );
    res
      .status(502)
      .json({ error: "Movie search is unavailable right now" });
  }
});

export default router;
