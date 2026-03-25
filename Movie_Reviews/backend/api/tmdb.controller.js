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

            // Success response
            response.json(popularMovies);
        } catch (error) {
            console.error("Error fetching popular movies:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch popular movies", details: error.message });    // Error response
        }
    }

    // Method to handle GET requests for searching for a movie by its title.
    static async apiSearchMovie(request, response, next) {
        try {
            const title = request.params.title || request.body.title;  // Retrieving the movie title from the request parameters or the request body.

            // Calling the searchMovie method from the tmdbDAO to search for a movie by its title.
            const movies = await tmdbDAO.searchMovie(title);

            // Success response
            response.json(movies);
        } catch (error) {
            console.error("Error searching for movie:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to search for movie", details: error.message });    // Error response
        }
    }

    // Method to handle GET requests for fetching movie information by its movie ID.
    static async apiGetMovie(request, response, next) {
        try {
            const id = request.params.id || request.body.id;  // Retrieving the movie ID from the request parameters or the request body.

            // Calling the getMovie method from the tmdbDAO to fetch movie information by its movie ID.
            const movie = await tmdbDAO.getMovie(id);

            if (!movie) {  // Checking if no movie was found for the specified ID.
                response.status(404).json({ error: "Not found" });  // Error response
                return;
            }
            
            var { error } = movie;  // Destructuring the error property from the movie response.
            if (error) {  // Checking if there was an error in the movie response.
                response.status(404).json({ error: "Not found" });  // Error response
                return;
            }

            // Success response
            response.json(movie);
        } catch (error) {
            console.error("Error fetching movie:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch movie", details: error.message });    // Error response
        }
    }

}


// --------------------------------------------------------------------------------------------------------------------
