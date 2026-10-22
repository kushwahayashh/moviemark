import { useState } from "react";

export default function Poster({ posterPath, title }) {
  const [failed, setFailed] = useState(false);

  if (!posterPath || failed) {
    return (
      <span className="poster-fallback" aria-hidden="true">
        <span>{title}</span>
      </span>
    );
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/w342${posterPath}`}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
