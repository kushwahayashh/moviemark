import Poster from "./Poster.jsx";

export default function SearchResults({
  query,
  results,
  searching,
  savedIds,
  addingId,
  onAdd,
}) {
  return (
    <section
      className="results-section"
      aria-labelledby="results-title"
      aria-busy={searching}
    >
      <div className="section-heading">
        <h2 id="results-title">Search results</h2>
        {query && <span>for “{query}”</span>}
      </div>

      {searching ? (
        <p className="status-text" role="status">
          Searching TMDB...
        </p>
      ) : results.length === 0 ? (
        <p className="status-text" role="status">
          No films found for “{query}”. Try another title.
        </p>
      ) : (
        <ul className="results-grid">
          {results.map((result) => {
            const saved = savedIds.includes(result.tmdbId);
            const adding = addingId === result.tmdbId;
            const label = saved
              ? `${result.title} is already in your collection`
              : adding
                ? `Adding ${result.title} to your collection`
                : `Add ${result.title} to your collection`;

            return (
              <li className="result-item" key={result.tmdbId}>
                <button
                  type="button"
                  className="result-card"
                  onClick={() => onAdd(result)}
                  disabled={saved || addingId !== null}
                  aria-label={label}
                  aria-busy={adding || undefined}
                  title={label}
                >
                  <span className="result-poster">
                    <Poster
                      posterPath={result.posterPath}
                      title={result.title}
                    />
                    {(saved || adding) && (
                      <span className="result-tag">
                        {adding ? "Adding" : "Saved"}
                      </span>
                    )}
                  </span>
                  <span className="result-meta">
                    <span className="result-title">{result.title}</span>
                    <span className="result-year">
                      {result.year || "Year unknown"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
