// --------------------------------------------------------------------------------------------------------------------
// Imports
import express from "express";  // Importing the Express.js framework to create a web server and handle HTTP requests.
import ReviewsController from "./reviews.controller.js";  // Importing the ReviewsController module, which contains the logic for handling requests related to movie reviews.

// --------------------------------------------------------------------------------------------------------------------
// Router
const router = express.Router();  // Creating a new router instance from Express to define routes for the reviews API.

// --------------------------------------------------------------------------------------------------------------------
// Routes for the reviews API
// Base route: /api/v1/reviews
router.route("/").get((request, response) => {
    // Defining a GET route for the root path of the reviews API (e.g., /api/v1/reviews/).
    response.json({
        message: "Hello, Thank you for using my Movie Reviews API!",
        help: [
            {
                endpoint: "/api/v1/reviews/movie/{id}",
                method: "GET",
                description: "Fetch reviews for a specific movie by its movie ID."
            },
            {
                endpoint: "/api/v1/reviews/new",
                method: "POST",
                description: "Create a new review for a specific movie."
            },
            {
                endpoint: "/api/v1/reviews/{id}",
                method: "GET",
                description: "Fetch a specific review by its review ID."
            },
            {
                endpoint: "/api/v1/reviews/{id}",
                method: "PUT",
                description: "Update a specific review by its review ID."
            },
            {
                endpoint: "/api/v1/reviews/{id}",
                method: "DELETE",
                description: "Delete a specific review by its review ID."
            }
        ]
    });  // JSON object in response.
});


// --------------------------------------------------------------------------------------------------------------------
// Routes for handling specific review-related operations, 

// 'GET' route for fetching reviews of a specific movie by its movie ID 
router.route("/movie/:id").get(ReviewsController.apiGetReviews);
// (e.g., /api/v1/reviews/movie/123).

// 'POST' route for creating a new review 
router.route("/new").post(ReviewsController.apiPostReview);
// (e.g., /api/v1/reviews/new).

// 'GET', 'PUT', and 'DELETE' routes for handling operations on a specific review by its review ID
router.route("/:id")
    .get(ReviewsController.apiGetReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);


// --------------------------------------------------------------------------------------------------------------------
// Exports
export default router;  // Exporting the router instance


// --------------------------------------------------------------------------------------------------------------------
