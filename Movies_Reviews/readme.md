# Movie Reviews

A small full-stack app for browsing movies and managing user reviews.

## Backend summary
- Built with Node.js, Express, and MongoDB.
- Connects to MongoDB at startup, injects the collection through a DAO layer, then starts the API server.
- Exposes REST endpoints under `/api/v1/reviews` for full review CRUD.
- Stores reviews with `movieId`, `user`, `review`, `rating`, and `date` fields.
- Includes a custom TMDB proxy API under `/api/v1/tmdb` so the frontend can fetch movie data through your backend.
- 

## Custom TMDB API
- `GET /api/v1/tmdb/discover`: fetches popular movies.
- `GET /api/v1/tmdb/search/:title`: searches movies by title.
- `GET /api/v1/tmdb/movie/:id`: fetches detailed data for one movie.
- Backend calls TMDB through a dedicated DAO (`tmdbDAO`).

## Frontend summary
- HTML/CSS/JavaScript frontend.
- `index.html` + `script.js` fetch popular/search movie data via your custom `/api/v1/tmdb` backend routes.
- `movie.html` + `movie.js` fetch detailed movie info, then fetch matching reviews by movie ID.
- Users can add, edit, and delete reviews.

## Star rating system
- Each review includes a 10-star rating.
- New and edited reviews submit a numeric rating to the backend.
- Ratings are rendered as interactive stars in edit/create mode and read-only stars when displaying saved reviews.

## Other notable implementations
- Loading screen behavior while movie lists are being fetched.
- Fallback movie poster handling when poster/backdrop paths are missing.
- Direct IMDb link rendering when an `imdb_id` is available in movie details.
- Decoupled architecture with route-controller-DAO layers for both reviews and TMDB features.

## Run backend
From `Movie_Reviews/backend`:

```bash
npm install
npm start
```

Then open `Movie_Reviews/frontend/index.html` in a browser.


### Links
GitHub Pages Link - https://akaadiele.github.io/JavaScript_Projects/Movie_Reviews/frontend