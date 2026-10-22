import { useEffect, useState } from "react";
import { getMovieBackdrop } from "../api.js";

export default function MoviePage({ movie, onBack, onSave }) {
  const [rating, setRating] = useState(movie.rating ?? "");
  const [note, setNote] = useState(movie.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [backdropPath, setBackdropPath] = useState(movie.backdropPath ?? null);

  useEffect(() => {
    if (movie.backdropPath) {
      setBackdropPath(movie.backdropPath);
      return;
    }

    async function loadBackdrop() {
      try {
        const data = await getMovieBackdrop(movie._id);
        setBackdropPath(data.backdropPath);
      } catch {
        setBackdropPath(null);
      }
    }

    loadBackdrop();
  }, [movie._id, movie.backdropPath]);

  async function handleNoteSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(movie._id, {
        rating: rating === "" ? null : Number(rating),
        note,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="movie-page" aria-label={`${movie.title} backdrop`}>
      {backdropPath && (
        <div
          className="movie-backdrop"
          aria-hidden="true"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${backdropPath})`,
          }}
        />
      )}
      <button type="button" className="back-button" onClick={onBack} disabled={saving}>
        ← Back
      </button>
      <div className="movie-backdrop-caption">
        <h1 className="movie-backdrop-title">{movie.title}</h1>
        <form className="movie-note-form" onSubmit={handleNoteSubmit}>
          <textarea
            id="movie-note-quick"
            className="movie-note-input"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="A scene, the score, the way it stayed with you..."
            aria-label="Movie note"
          />
          <div className="movie-note-actions">
            <label className="movie-rating-button">
              <span>Rating :</span>
              <input
                className="movie-rating-input"
                type="number"
                inputMode="numeric"
                min="1"
                max="10"
                step="1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                placeholder="X"
                aria-label="Your rating from 1 to 10"
              />
            </label>
            <button
              type="submit"
              className="movie-note-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save note"}
            </button>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
