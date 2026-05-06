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


# 

# Movies & Reviews - v1

🎬 A full-stack movie discovery and review platform built with vanilla JavaScript, Express, and MongoDB.

This release marks Version 1 (v1): a stable milestone that includes movie browsing, review CRUD, star ratings, automated tests, and CI/CD validation.

## Overview
- Frontend fetches movie discovery/search/details through your backend TMDB proxy.
- Users can create, edit, and delete reviews per movie. (edit and delete options currently hidden)
- Reviews support a 10-star rating system and movie-level average rating display.
- Backend follows a layered structure: routes -> controllers -> DAOs.

## Core Features

### Movie discovery and details
- Popular movies and title search are available from the homepage.
- Movie detail page includes poster, overview, release year, IMDb link (when available), and review thread.
- Fallback image handling is applied when poster/backdrop data is missing.

### Review system
- Full CRUD for reviews via backend API.
- Review payload supports: movieId, user, review, rating, and optional movieTitle.
- Review cards support inline edit/delete actions. (edit and delete options currently hidden)

### Star ratings
- ⭐ 10-star interactive rating widget for new and edited reviews.
- Read-only stars are rendered for saved reviews.
- Movie page computes and displays average rating from submitted reviews.

### UX and reliability improvements
- Loading screen during movie fetch operations.
- Defensive fetch error handling with clear failure feedback.
- Input sanitization for user-provided review content before rendering.

## Backend API

### Reviews endpoints
- GET /api/v1/reviews
- GET /api/v1/reviews/movie/:id
- POST /api/v1/reviews/new
- GET /api/v1/reviews/:id
- PUT /api/v1/reviews/:id
- DELETE /api/v1/reviews/:id

### TMDB proxy endpoints
- GET /api/v1/tmdb
- GET /api/v1/tmdb/discover
- GET /api/v1/tmdb/search/:title
- GET /api/v1/tmdb/movie/:id

## Testing and Code Quality

### Backend tests (Jest + Supertest)
- Frameworks: jest, supertest.
- Focus: route/controller behavior for reviews and TMDB APIs.
- Strategy: DAO-level spies/mocks to isolate API behavior.
- Test files:
	- backend/test/reviews.test.js
	- backend/test/tmdb.test.js
- Command:

```bash
cd Movies_Reviews/backend
npm test
```

### Frontend quality checks (ESLint + Playwright)
- ESLint validates frontend JavaScript consistency and common error patterns.
- Playwright e2e covers homepage smoke checks, index interactions, and movie page behavior.
- E2E test files:
	- frontend/tests/e2e/smoke.test.js
	- frontend/tests/e2e/index.test.js
	- frontend/tests/e2e/movie.test.js
- Commands:

```bash
cd Movies_Reviews/frontend
npm run lint
npm run test:e2e
```

## CI/CD Pipeline (GitHub Actions)

Workflow file:
- .github/workflows/movies-reviews-ci.yml

Pipeline behavior:
- Triggers on push and pull_request to main.
- Path-filtered to run only when Movies_Reviews files or workflow file change.
- Job order:
	- 1) Frontend lint
	- 2) Backend tests
	- 3) Frontend e2e tests
- Uses Node.js 24 and npm caching for faster runs.
- Uploads Playwright artifacts/screenshots on failure.

## Deployment (Render)

### Backend (Render Web Service)
- Type: Node.js API service.
- Required environment variables:
	- PORT
	- MONGODB_U
	- MONGODB_P
	- TMDB_K
- Placeholder URL:
	- https://movie-review-api-o8bs.onrender.com/api/v1

### Frontend (Render Static Site)
- Type: static web app serving frontend assets.
- Placeholder URL:
	- https://movies-and-reviews.onrender.com


### Current deployed references
- Backend API base URL used by frontend code:
	- https://movie-review-api-o8bs.onrender.com/api/v1
- Frontend base URL used in Playwright config:
	- https://movies-and-reviews.onrender.com/

## Local Run Guide

### 1) Start backend

```bash
cd Movies_Reviews/backend
npm install
npm start
```

### 2) Open frontend
- Open Movies_Reviews/frontend/index.html in your browser.

## Project Links
- GitHub Pages: https://akaadiele.github.io/JavaScript_Projects/Movies_Reviews/frontend

## Version Status
- ✅ Version: v1
- ⏸️ Development status: paused after v1 milestone