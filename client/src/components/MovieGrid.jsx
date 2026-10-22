import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({ movies, loading, onOpen, onDelete }) {
  if (loading) {
    return <p className="status-text">Loading your shelf...</p>;
  }

  if (movies.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">Your shelf is waiting.</p>
        <p>Search for a film above and add the first one.</p>
      </div>
    );
  }

  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
