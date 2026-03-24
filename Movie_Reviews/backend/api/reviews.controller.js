// --------------------------------------------------------------------------------------------------------------------
// Imports
import ReviewsDAO from "../dao/reviewsDAO.js";  // Importing the Reviews Data Access Object (DAO) module, 


// --------------------------------------------------------------------------------------------------------------------
// Exporting the ReviewsController class
export default class ReviewsController {

    // Method to handle POST requests for creating a new review.
    static async apiPostReview(request, response, next) {
        try {
            const movieId = parseInt(request.body.movieId);  // Retrieving the movie ID from the request body, and converting it to an integer.
            const review = request.body.review;  // Retrieving the review text from the request body.
            const user = request.body.user;  // Retrieving the user information from the request body.

            // Calling the addReview method from the ReviewsDAO to add a new review to the database.
            const reviewResponse = await ReviewsDAO.addReview(movieId, review, user);

            // Success response
            response.json({ status: "success" });
        } catch (error) {
            console.error("Error adding review:", error);   // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to add review", details: error.message });   // Error response
        }
    }

    // Method to handle GET requests for fetching reviews of a specific movie.
    static async apiGetReview(request, response, next) {
        try {
            let id = request.params.id || {};  // Retrieving the movie ID from the request parameters, or defaulting to an empty object if not provided.
            
            // Calling the getReview method from the ReviewsDAO to fetch a specific review by its ID.
            let review = await ReviewsDAO.getReview(id);

            if (!review) {  // Checking if no review was found for the specified ID.
                response.status(404).json({ error: "Not found" });  // Error response
                return;
            }

            // Success response
            response.json(review);
        } catch (error) {
            console.error("Error fetching review:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch review", details: error.message }); // Error response
        }
    }

    // Method to handle PUT requests for updating a specific review.
    static async apiUpdateReview(request, response, next) {
        try {
            const reviewId = request.params.id;  // Retrieving the review ID from the request parameters.
            const review = request.body.review;  // Retrieving the updated review text from the request body.
            const user = request.body.user;  // Retrieving the user information from the request body.

            // Calling the updateReview method from the ReviewsDAO to update the specified review in the database.
            const reviewResponse = await ReviewsDAO.updateReview( reviewId, user, review );

            var { error } = reviewResponse;  // Destructuring the error property from the review response.
            if (error) {  // Checking if there was an error in the review response.
                response.status(400).json({ error });   // Error response
            }

            if (reviewResponse.modifiedCount === 0) {   // Checking if no reviews were modified in the database
                throw new Error("Unable to update review");
            }

            // Success response
            response.json({ status: "success" });
        } catch (error) {
            console.error("Error updating review:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to update review", details: error.message });    // Error response
        }
    }

    // Method to handle DELETE requests for deleting a specific review.
    static async apiDeleteReview(request, response, next) {
        try {
            const reviewId = request.params.id;  // Retrieving the review ID from the request parameters.

            // Calling the deleteReview method from the ReviewsDAO to delete the specified review from the database.
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId);

            // Success response
            response.json({ status: "success" });
        } catch (error) {
            console.error("Error deleting review:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to delete review", details: error.message });    // Error response
        }
    }

    // Method to handle GET requests for fetching reviews of a specific movie.
    static async apiGetReviews(request, response, next) {
        try {
            let id = request.params.id || {};  // Retrieving the movie ID from the request parameters, or defaulting to an empty object if not provided.
            
            // Calling the getReviewsByMovieId method from the ReviewsDAO to fetch all reviews for the specified movie ID.
            let reviews = await ReviewsDAO.getReviewsByMovieId(id);

            if (!reviews) {  // Checking if no reviews were found for the specified movie ID.
                response.status(404).json({ error: "Not found" });  // Error response
                return;
            }

            // Success response
            response.json(reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error); // Logging the error to the console for debugging purposes.
            response.status(500).json({ error: "Failed to fetch reviews", details: error.message });    // Error response
        }
    }

}


// --------------------------------------------------------------------------------------------------------------------
