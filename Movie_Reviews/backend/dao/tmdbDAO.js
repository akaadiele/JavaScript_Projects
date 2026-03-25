// --------------------------------------------------------------------------------------------------------------------
// Imports
const tmdbBaseURL = "https://api.themoviedb.org/3";

import dotenv from "dotenv";  // Importing the dotenv package to load environment variables
dotenv.config();  // Loading environment variables
const tmdbApiKey = process.env.TMDB_K;

// --------------------------------------------------------------------------------------------------------------------
// Exporting the tmdbDAO class
export default class tmdbDAO {

    // Method to fetch popular movies from the TMDB API.
    static async getPopularMovies() {
        try {
            // Fetching popular movies from the TMDB API using the fetch function and returning the results as JSON.
            const tmdbDiscoverURL = `${tmdbBaseURL}/discover/movie?sort_by=popularity.desc&api_key=${tmdbApiKey}&page=1`;
            const tmdbResponse = await fetch(tmdbDiscoverURL);
            
            return await tmdbResponse.json();
        } catch (error) {
            console.error("Error fetching popular movies:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to fetch popular movies", details: error.message };  // Error response
        }
    }

    // Method to search for a movie by its title using the TMDB API.
    static async searchMovie(title) {
        try {
            // Searching for a movie by its title using the TMDB API and returning the results as JSON.
            const searchText = encodeURIComponent(title);
            const tmdbSearchURL = `${tmdbBaseURL}/search/movie?api_key=${tmdbApiKey}&query=${searchText}`;
            const tmdbResponse = await fetch(tmdbSearchURL);

            return await tmdbResponse.json();
        } catch (error) {
            console.error("Error searching for movie:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to search for movie", details: error.message };  // Error response
        }
    }

    // Method to fetch movie information by its movie ID using the TMDB API.
    static async getMovie(id) {
        try {
            // Fetching movie information by its movie ID using the TMDB API and returning the result as JSON.
            const tmdbMovieURL = `${tmdbBaseURL}/movie/${id}?api_key=${tmdbApiKey}`;
            const tmdbResponse = await fetch(tmdbMovieURL);

            return await tmdbResponse.json();
        } catch (error) {
            console.error("Error fetching movie:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to fetch movie", details: error.message };  // Error response
        }
    }

}


// --------------------------------------------------------------------------------------------------------------------
