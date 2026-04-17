// --------------------------------------------------------------------------------------------------------------------
// Imports
import express from "express";  // Importing the Express.js framework to create a web server and handle HTTP requests.
import TMDB_Controller from "../controller/tmdb.controller.js";  // Importing the TMDB_Controller module, which contains the logic for handling requests related to TMDB third-party API.

// --------------------------------------------------------------------------------------------------------------------
// Router
const tmdbRouter = express.Router();  // Creating a new router instance from Express to define routes for the tmdb API.

// --------------------------------------------------------------------------------------------------------------------
// Routes for the tmdb API
// Base route: /api/v1/tmdb
tmdbRouter.route("/").get((request, response) => {
    // Defining a GET route for the root path of the tmdb API (e.g., /api/v1/tmdb/).
    response.json({
        message: "Hello, Thank you for using my TMDB API!",
        help: [
            {
                endpoint: "/api/v1/tmdb/discover",
                method: "GET",
                description: "Fetch popular movies."
            },
            {
                endpoint: "/api/v1/tmdb/search/{title}",
                method: "GET",
                description: "Search for a movie by its title (in the parameters or in the body - 'title')."
            },
            {
                endpoint: "/api/v1/tmdb/movie/{id}",
                method: "GET",
                description: "Fetch movie information by its movie ID. ('id' is mandatory)."
            }
        ]
    });  // JSON object in response.
});


// --------------------------------------------------------------------------------------------------------------------
// Routes for handling specific tmdb-related operations, 

// 'GET' route for fetching popular movies
tmdbRouter.route("/discover").get(TMDB_Controller.apiGetPopularMovies);
// (e.g., /api/v1/tmdb/discover).

// 'GET' route for searching for a movie by its title
tmdbRouter.route("/search/{:title}").get(TMDB_Controller.apiSearchMovie);
// (e.g., /api/v1/tmdb/search/Inception or /api/v1/tmdb/search/ with body { "title": "Inception" }).

// 'GET' route for fetching movie information by its movie ID
tmdbRouter.route("/movie/{:id}").get(TMDB_Controller.apiGetMovie);
// (e.g., /api/v1/tmdb/movie/123 or /api/v1/tmdb/movie/ with body { "id": 123 }).

// The '{}' in the route URL ('/movie/{:id}' | '/search/{:title}') makes the route parameter optional.

// --------------------------------------------------------------------------------------------------------------------
// Exports
export default tmdbRouter;  // Exporting the tmdbRouter instance


// --------------------------------------------------------------------------------------------------------------------
