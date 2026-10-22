# MovieMark

A college MERN project for saving movies, giving them a rating, and writing personal notes.

## Run locally

You need Node.js, MongoDB, and a TMDB API key.

1. Run `npm install` in the project folder, then `npm run setup`.
2. Copy `server/.env.example` to `server/.env` and enter your TMDB API key. Set `MONGODB_URI` if you use a different database address.
3. Start MongoDB, then run `npm run dev` in the project folder.
4. Open the local URL printed by Vite. The API uses port 5000 by default.

## How it works

React displays the pages and stores the current screen's data in state. It uses `fetch` to send requests to Express. Express reads or writes movies in MongoDB using the Mongoose model. For searches, Express requests movie information from TMDB and sends the results to React.

TMDB provides movie information and image paths. MongoDB stores the movies you add, including your own ratings and notes. The TMDB API key stays on the server.

## Main files

| File | Purpose |
| --- | --- |
| `client/src/App.jsx` | Loads the collection, handles search/add/update/delete, and chooses which screen to show |
| `client/src/api.js` | Functions that send requests to Express |
| `client/src/components/SearchForm.jsx` | Movie search input |
| `client/src/components/SearchResults.jsx` | Displays search results and lets you add a movie |
| `client/src/components/MovieGrid.jsx` | Displays the collection |
| `client/src/components/MovieCard.jsx` | One saved movie and its remove button |
| `client/src/components/MoviePage.jsx` | Movie backdrop, note, and rating form |
| `client/src/components/Poster.jsx` | Reusable poster with a fallback if the image is missing |
| `client/src/index.css` | Styling for the laptop layout |
| `server/index.js` | Starts Express and connects to MongoDB |
| `server/models/Movie.js` | Defines the fields and validation for a saved movie |
| `server/routes/movies.js` | Collection CRUD routes and backdrop lookup |
| `server/routes/search.js` | Searches TMDB |

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/movies` | Read all saved movies, newest first |
| POST | `/api/movies` | Create a saved movie |
| PATCH | `/api/movies/:id` | Update its rating or note |
| DELETE | `/api/movies/:id` | Delete a saved movie |
| GET | `/api/search?query=title` | Search TMDB and return up to 10 results |
| GET | `/api/movies/:id/backdrop` | Find and save a backdrop when a saved movie does not have one |

## Concepts to understand for a viva

- **State and props:** `useState` holds changing data; props pass data and functions to child components.
- **useEffect:** Loads saved movies when the app opens. The movie page also loads a backdrop if needed.
- **Forms:** React state tracks the search text, note, and rating. Submitting a form calls the relevant handler.
- **async/await:** Waits for network requests or database operations. `try/catch` handles failures.
- **CRUD:** `Movie.create`, `Movie.find`, `movie.save`, and `Movie.findByIdAndDelete` create, read, update, and delete records.
- **Two IDs:** MongoDB `_id` identifies your saved record; `tmdbId` identifies the movie in TMDB. A unique `tmdbId` prevents duplicates.
- **Validation:** Ratings are whole numbers from 1 to 10, notes allow up to 1000 characters, and invalid requests return errors.
- **JSON:** React and Express exchange data as JSON. `express.json()` reads request bodies.
- **Vite proxy:** During development, requests beginning with `/api` go to Express on port 5000.

The app has one shared collection and no login. Selecting a movie changes React state; it does not create a separate URL.
