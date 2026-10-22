import { useState } from "react";

export default function SearchForm({ onSearch, searching }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || searching) return;
    onSearch(trimmed);
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="movie-search">
        Search for a movie title
      </label>
      <input
        id="movie-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a movie..."
        autoComplete="off"
        maxLength={100}
      />
      <button type="submit" disabled={!query.trim() || searching}>
        {searching ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
