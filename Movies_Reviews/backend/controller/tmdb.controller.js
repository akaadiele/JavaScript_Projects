// --------------------------------------------------------------------------------------------------------------------
// Imports
import tmdbDAO from "../dao/tmdbDAO.js";  // Importing the TMDB Data Access Object (DAO) module, 


// --------------------------------------------------------------------------------------------------------------------
// Exporting the TMDB_Controller class
export default class TMDB_Controller {

    // Method to handle GET requests for fetching popular movies.
    static async apiGetPopularMovies(request, response, next) {
        try {
            // Calling the getPopularMovies method from the tmdbDAO to fetch popular movies from the TMDB API.
            const popularMovies = await tmdbDAO.getPopularMovies();

            var { total_results } = popularMovies;  // Destructuring the total_results property from the popularMovies response to check if any movies were found.
            if (total_results === 0) {  // Checking if no movies were found.
                response.status(404).json({
                    error: `No movies discovered`,
                    status: 404,
                    results: [],
                    total_results: 0
                });  // Error response
                return;
            }

            // Success response
            response.json(popularMovies);
        } catch (error) {
            console.error("Error fetching popular movies:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch popular movies", details: error.message, status: 500 });    // Error response
        }
    }

    // Method to handle GET requests for searching for a movie by its title.
    static async apiSearchMovie(request, response, next) {
        try {
            const title = request.params.title || request.body.title;  // Retrieving the movie title from the request parameters or the request body.

            // Calling the searchMovie method from the tmdbDAO to search for a movie by its title.
            const movies = await tmdbDAO.searchMovie(title);

            var { total_results } = movies;  // Destructuring the total_results property from the movies response to check if any movies were found for the specified title.
            if (total_results === 0) {  // Checking if no movies were found for the specified title.
                response.status(404).json({
                    error: `No movies found for title: '${title}'`,
                    status: 404,
                    results: [],
                    total_results: 0
                });  // Error response
                return;
            }

            // Success response
            response.json(movies);
        } catch (error) {
            console.error("Error searching for movie:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to search for movie", details: error.message, status: 500 });    // Error response
        }
    }

    // Method to handle GET requests for fetching movie information by its movie ID.
    static async apiGetMovie(request, response, next) {
        try {
            const id = request.params.id || request.body.id;  // Retrieving the movie ID from the request parameters or the request body.

            // Validate the id parameter to ensure it is a valid movie id (non-empty string, no contains only special characters, etc.)
            if (!id || typeof id !== "string" || id.trim() === "" || id.match(/^[!@#$%^&*(),.?":{}|<>]+$/)) {
                response.status(400).json({ error: "Invalid movie ID format", status: 400 });  // Error response for invalid movie ID format
                return;
            }

            // Calling the getMovie method from the tmdbDAO to fetch movie information by its movie ID.
            const movie = await tmdbDAO.getMovie(id);

            // Checking if the movie response is null or undefined, which indicates that no movie was found for the specified ID.
            if (!movie) {  // Checking if no movie was found for the specified ID.
                response.status(404).json({ error: `No movie found for movie id: '${id}'`, status: 404 });  // Error response
                return;
            }

            // Destructuring the error property from the movie response to check for an invalid movie ID.
            var { error } = movie;  // Destructuring the error property from the movie response.
            if (error) {  // Checking if there was an error in the movie response.
                response.status(404).json({ error: `No movie found for movie id: '${id}'`, status: 404 });  // Error response
                return;
            }

            // Destructuring the success, status_code, and status_message properties from the movie response to check for an invalid movie ID.
            var { success, status_code, status_message } = movie;  // Destructuring the success, status_code, and status_message properties from the movie response.
            if (success === false && status_code != null && status_message !== "") {  // Checking if the response indicates an invalid movie ID.
                response.status(404).json({
                    error: `No movie found for movie id: '${id}'`,
                    status: 404,
                    success,
                    status_code,
                    status_message
                });  // Error response

                return;
            }

            // Success response
            response.json(movie);
        } catch (error) {
            console.error("Error fetching movie:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch movie", details: error.message, status: 500 });    // Error response
        }
    }

}


// --------------------------------------------------------------------------------------------------------------------
