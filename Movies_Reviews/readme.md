# Movie Reviews

A small scale full-stack app for browsing movies and managing user reviews.

## Backend Summary
- Built with Node.js, Express, and MongoDB.
- Connects to MongoDB at startup, injects the collection through a DAO layer, then starts the API server.
- Exposes REST endpoints under `/api/v1/reviews` for full review CRUD.
- Stores reviews with `movieId`, `user`, `review`, `rating`, and `date` fields.
- Includes a custom TMDB proxy API under `/api/v1/tmdb` so the frontend can fetch movie data through your backend.

## Custom TMDB API
- `GET /api/v1/tmdb/discover`: fetches popular movies.
- `GET /api/v1/tmdb/search/:title`: searches movies by title.
- `GET /api/v1/tmdb/movie/:id`: fetches detailed data for one movie.
- Backend calls TMDB through a dedicated DAO (`tmdbDAO`).

## Frontend Summary
- HTML/CSS/JavaScript frontend.
- `index.html` + `script.js` fetch popular/search movie data via your custom `/api/v1/tmdb` backend routes.
- `movie.html` + `movie.js` fetch detailed movie info, then fetch matching reviews by movie ID.
- Users can add, edit, and delete reviews.

## Star Rating System
- Each review includes a 10-star rating.
- New and edited reviews submit a numeric rating to the backend.
- Ratings are rendered as interactive stars in edit/create mode and read-only stars when displaying saved reviews.

## Other Notable Implementations
- Loading screen behavior while movie lists are being fetched.
- Fallback movie poster handling when poster/backdrop paths are missing.
- Direct IMDb link rendering when an `imdb_id` is available in movie details.
- Decoupled architecture with route-controller-DAO layers for both reviews and TMDB features.

## Frontend Testing (Playwright + ESLint)
- Test stack includes ___

## Backend Testing (Jest + Supertest)
- Test stack includes `jest` and `supertest` in backend dev dependencies.
- Test command configured in backend scripts: `npm test`.
- Route tests cover both `/api/v1/reviews` and `/api/v1/tmdb` endpoints.
- Tests use DAO method spies/mocks to isolate route/controller behavior.
- Current test files:
	- `backend/test/reviews.test.js`
	- `backend/test/tmdb.test.js`

## CI/CD pipeline (GitHub Actions)
- Workflow file: `.github/workflows/movies-reviews-ci.yml`.
- Runs on push and pull request events to `main`.
- Path-filtered to run when changes affect `Movies_Reviews/**` or the workflow file itself.
- Uses Ubuntu runner and Node.js setup with npm caching.
- Installs dependencies with `npm ci` in `Movies_Reviews/backend`.
- Executes the backend test suite with required secrets.

## Deployment (Render)
- Backend deployment target: Render Web Service (Node.js API).
- Frontend deployment target: Render Static Site (frontend build/static assets).
- Setup with environment variables for backend on Render.
- Render backend URL (placeholder): `https://movie-review-api-o8bs.onrender.com/api/v1`
- Render frontend URL (placeholder): `https://movies-and-reviews.onrender.com/`

### --------------------------------------------------
## Run on Local
From `Movies_Reviews/backend`:

```bash
    npm install
    npm start
```

Then open `Movies_Reviews/frontend/index.html` in a browser.


### GitHub Pages
Link - https://akaadiele.github.io/JavaScript_Projects/Movies_Reviews/frontend