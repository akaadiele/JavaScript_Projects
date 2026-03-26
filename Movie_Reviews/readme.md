# Movie Reviews

A small full-stack app for browsing movies and managing user reviews.

## Backend summary
- Built with Node JS, Express and MongoDB.
- Connects to MongoDB at startup, injects the DB collection into a DAO, then starts the API server.
- Exposes REST endpoints under `/api/v1/reviews` to create, read, update, and delete reviews.
- Stores reviews with `movieId`, `user`, `review`, and `date` fields.
- Exposes REST endpoints under `/api/v1/tmdb` to fetch movie data from the tmdb third party API.


## Frontend summary
- HTML/CSS/JavaScript frontend.
- `index.html` + `script.js` fetch popular/search movie data from TMDB and render movie cards.
- Each movie links to `movie.html`, where `movie.js` reads query params and calls the backend API.
- Users can add reviews from the movie page.

## Run backend
From `Movie_Reviews/backend`:

```bash
npm install
npm start
```

Then open `Movie_Reviews/frontend/index.html` in a browser.
