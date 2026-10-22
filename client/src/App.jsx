import { useEffect, useState } from "react";
import {
  addMovie,
  deleteMovie,
  getMovies,
  searchMovies,
  updateMovie,
} from "./api.js";
import MoviePage from "./components/MoviePage.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import SearchForm from "./components/SearchForm.jsx";
import SearchResults from "./components/SearchResults.jsx";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMovies(false);
      }
    }

    loadMovies();
  }, []);

  const savedIds = movies.map((movie) => movie.tmdbId);

  async function handleSearch(query) {
    setSearching(true);
    setError("");
    setLastQuery(query);

    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (err) {
      setSearchResults([]);
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(result) {
    if (addingId !== null) return;

    setAddingId(result.tmdbId);
    setError("");
    try {
      const saved = await addMovie(result);
      setMovies((current) => [saved, ...current]);
      setSearchResults(null);
      setLastQuery("");
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingId(null);
    }
  }

  async function handleSave(id, updates) {
    const updated = await updateMovie(id, updates);
    setMovies((current) =>
      current.map((movie) => (movie._id === updated._id ? updated : movie)),
    );
    setEditingMovie(updated);
  }

  async function handleDelete(id) {
    await deleteMovie(id);
    setMovies((current) => current.filter((movie) => movie._id !== id));
    setEditingMovie(null);
  }

  return (
    <div className="app">
      {!editingMovie && (
        <header className="site-header">
          <div className="brand">
            <span>
              Movie<span className="brand-accent">Mark</span>
            </span>
          </div>
        </header>
      )}

      <main>
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              Dismiss
            </button>
          </div>
        )}

        {editingMovie ? (
          <MoviePage
            movie={editingMovie}
            onBack={() => setEditingMovie(null)}
            onSave={handleSave}
          />
        ) : (
          <>
            <section className="hero">
              <SearchForm onSearch={handleSearch} searching={searching} />
            </section>

            {searchResults !== null && (
              <SearchResults
                query={lastQuery}
                results={searchResults}
                searching={searching}
                savedIds={savedIds}
                addingId={addingId}
                onAdd={handleAdd}
              />
            )}

            <section
              className="collection-section"
              aria-labelledby="collection-title"
            >
              <div className="section-heading">
                <h2 id="collection-title">Your collection</h2>
                <span>
                  {movies.length} {movies.length === 1 ? "film" : "films"}
                </span>
              </div>
              <MovieGrid
                movies={movies}
                loading={loadingMovies}
                onOpen={setEditingMovie}
                onDelete={handleDelete}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
