import Poster from "./Poster.jsx";

export default function MovieCard({ movie, onOpen, onDelete }) {
  async function handleDelete() {
    if (!window.confirm(`Remove “${movie.title}” from your collection?`)) return;
    try {
      await onDelete(movie._id);
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <li className="movie-card">
      <div className="movie-card-shell">
        <button
          type="button"
          className="movie-card-button"
          onClick={() => onOpen(movie)}
          aria-label={`Edit ${movie.title}`}
        >
          <span className="movie-poster">
            <Poster posterPath={movie.posterPath} title={movie.title} />
          </span>
          <span className="movie-card-info">
            <span className="movie-card-title">{movie.title}</span>
            <span className="movie-card-meta">
              <span>{movie.year || "Year unknown"}</span>
              {typeof movie.rating === "number" && (
                <span className="movie-card-rating">{movie.rating}/10</span>
              )}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="movie-card-delete"
          onClick={handleDelete}
          aria-label={`Remove ${movie.title} from your collection`}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </li>
  );
}
