// All requests go to the Express server through Vite's /api proxy.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error("Could not reach the server. Is it running?");
  }

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export function getMovies() {
  return request("/api/movies");
}

export function searchMovies(query) {
  return request(`/api/search?query=${encodeURIComponent(query)}`);
}

export function getMovieBackdrop(id) {
  return request(`/api/movies/${id}/backdrop`);
}

export function addMovie(movie) {
  return request("/api/movies", {
    method: "POST",
    body: JSON.stringify(movie),
  });
}

export function updateMovie(id, updates) {
  return request(`/api/movies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteMovie(id) {
  return request(`/api/movies/${id}`, { method: "DELETE" });
}
