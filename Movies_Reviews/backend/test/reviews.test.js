// --------------------------------------------------------------------------------------------------------------------
// Imports
import request from "supertest";    // Importing the Supertest library to make HTTP requests to the Express application for testing purposes.
import app from "../server.js";     // Importing the Express application instance from the server.js file to be used in the tests.
import { expect, jest, test } from "@jest/globals";   // Importing the Jest testing framework to create mock functions and perform assertions in the tests.
import ReviewsDAO from "../dao/reviewsDAO.js";  // Importing the Reviews Data Access Object (DAO) module to mock its methods for testing purposes.

// --------------------------------------------------------------------------------------------------------------------
// Test suite for TMDB routes

describe("Reviews Routes", () => {
    let reviewsSpy; // Variable for spying on the ReviewsDAO methods to mock their behavior in the tests.


    // Test cases for the Reviews routes
    describe("Reviews Routes that hit the Reviews API", () => {
        // 1. Test case to check if the GET /api/v1/reviews route returns a 'help' array
        test("GET /api/v1/reviews; returns an array", async () => {
            const response = await request(app).get("/api/v1/reviews"); // Making a GET request to the specified route to fetch reviews.

            // Below is the expected property in the response body for a successful request to the Reviews API.
            expect(Array.isArray(response.body.help)).toBe(true);  // Expecting the 'help' property in the response body to be an array.
            expect(response.body).toHaveProperty("help");  // Expecting the response body to have a property 'help'
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });
    });

    describe("Reviews Routes that hit the getReviewsByMovieId mock method", () => {
        afterEach(() => {   // runs automatically after every test
            // Restoring the original implementation of the getReviewsByMovieId method after the test is complete.
            reviewsSpy.mockRestore();
        });


        // 2. Test case to check if the GET /api/v1/reviews/movie/:id route returns an array of reviews for a valid movie ID with reviews
        test("GET /api/v1/reviews/movie/:id; returns an array of reviews for a valid movie ID", async () => {
            let test_movie_id = "507b8b9c9c9c9c9c9c9c9c9c";  // Sample valid movie ID for testing purposes.

            // Mocking the getReviewsByMovieId method of the ReviewsDAO to return an empty array for testing purposes.
            reviewsSpy = jest
                .spyOn(ReviewsDAO, "getReviewsByMovieId")
                .mockResolvedValue({
                    "reviews": [
                        {
                            "_id": "69c136e04c2054c96d31a9fb",
                            "movieId": test_movie_id,
                            "user": "Byte101",
                            "review": "Really dope movie. I recommend",
                            "date": "2026-03-26T14:15:21.902Z",
                            "rating": 5
                        },
                        {
                            "_id": "69c137774c2054c96d31a9fc",
                            "movieId": test_movie_id,
                            "user": "Crimson--Diva",
                            "review": "A must-watch!!!",
                            "date": "2026-03-26T14:15:48.466Z",
                            "rating": 4
                        }
                    ]
                });  // Mocking the getReviewsByMovieId method to return a sample array of reviews for testing purposes.


            const response = await request(app).get(`/api/v1/reviews/movie/${test_movie_id}`); // Making a GET request to the specified route with a sample movie ID.

            // Below is the expected property in the response body for a successful request to the Reviews API.
            expect(response.body).toHaveProperty("reviews");  // Expecting the response body to have a property 'reviews'
            expect(Array.isArray(response.body.reviews)).toBe(true);  // Expecting the 'reviews' property in the response body to be an array.
            expect(response.body.reviews.length).toBeGreaterThan(0);  // Expecting the array to contain at least one review.
            expect(reviewsSpy).toHaveBeenCalledWith(test_movie_id);  // Expecting the getReviewsByMovieId method to have been called with the specified movie ID.
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });

        // 3. Test case to check if the GET /api/v1/reviews/movie/:id route returns an empty array for a valid movie ID with no reviews
        test("GET /api/v1/reviews/movie/:id; returns an empty array for a valid movie ID with no reviews", async () => {
            let test_movie_id = "123456789123456789";  // Sample syntactically valid movie ID (but not existing) for testing purposes.

            reviewsSpy = jest
                .spyOn(ReviewsDAO, "getReviewsByMovieId")
                .mockResolvedValue({
                    "reviews": []
                }); // Mocking the getReviewsByMovieId method to return a sample empty array of reviews for testing purposes.

            const response = await request(app).get(`/api/v1/reviews/movie/${test_movie_id}`); // Making a GET request to the specified route with a sample movie ID.

            expect(response.body).toHaveProperty("reviews");  // Expecting the response body to have a property 'reviews'
            expect(Array.isArray(response.body.reviews)).toBe(true);  // Expecting the 'reviews' property in the response body to be an array.
            expect(response.body.reviews.length).toBe(0);  // Expecting the array to be empty.
            expect(reviewsSpy).toHaveBeenCalledWith(test_movie_id);  // Expecting the getReviewsByMovieId method to have been called with the specified movie ID.
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });

        // 4. Test case to check if the GET /api/v1/reviews/movie/:id route returns an error for an invalid movie ID
        test("GET /api/v1/reviews/movie/:id; returns an error for an invalid movie ID", async () => {
            let invalid_movie_id = "!!";  // Sample invalid movie ID for testing purposes.

            reviewsSpy = jest
                .spyOn(ReviewsDAO, "getReviewsByMovieId")
                .mockResolvedValue({
                    "error": "Invalid movie ID format"
                }); // Mocking the getReviewsByMovieId method to return a sample error response for testing purposes.

            const response = await request(app).get(`/api/v1/reviews/movie/${invalid_movie_id}`); // Making a GET request to the specified route with an invalid movie ID.

            expect(response.body).not.toHaveProperty("reviews");    // Expecting the response body to not have a property 'reviews' since the movie ID is invalid.
            expect(response.body).toHaveProperty("error");  // Expecting the response body to have a property 'error'
            expect(response.body.error).toBe("Invalid movie ID format");  // Expecting the error message in the response body to indicate an invalid movie ID format.
            expect(response.status).toBe(400);  // Expecting the HTTP status code of the response to be 400 (Bad Request).

        });

        // 5. Test case to check if the GET /api/v1/reviews/movie/:id route returns error 500 for an internal server error
        test("GET /api/v1/reviews/movie/:id; returns error 500 for an internal server error", async () => {
            let test_movie_id = "507b8b9c9c9c9c9c9c9c9c9c";  // Sample valid movie ID for testing purposes.

            reviewsSpy = jest
                .spyOn(ReviewsDAO, "getReviewsByMovieId")
                .mockRejectedValue(new Error("Error fetching reviews")); // Mocking the getReviewsByMovieId method to simulate an internal server error.

            const response = await request(app).get(`/api/v1/reviews/movie/${test_movie_id}`); // Making a GET request to the specified route with the test movie ID.

            expect(response.body).not.toHaveProperty("reviews");    // Expecting the response body to not have a property 'reviews' since an error occurred.
            expect(response.body).toHaveProperty("error");  // Expecting the response body to have a property 'error'
            expect(response.body.error).toBe("Failed to fetch reviews");  // Expecting the error message in the response body to indicate a failure to fetch reviews.
            expect(response.status).toBe(500);  // Expecting the HTTP status code of the response to be 500 (Internal Server Error).
        });
    });

    describe("Reviews Routes that hit the addReview mock method", () => {
        // Lifecycle methods to run after each test in this test suite
        afterEach(() => {   // runs automatically after every test
            // Restoring the original implementation of the addReview method after the test is complete.
            reviewsSpy.mockRestore();
        });


        // 6. Test case to check if the POST /api/v1/reviews route returns success for creating a new review with valid input data
        test("POST /api/v1/reviews; creates a new review successfully with valid input data", async () => {
            let test_movie_id = "507b8b9c9c9c9c9c9c9c9c9c";  // Sample valid movie ID for testing purposes.

            let test_request_body = {
                movieId: test_movie_id,
                user: "TestUser",
                review: "This is a test review.",
                rating: 10
            };

            // Mocking the addReview method of the ReviewsDAO to return a success response for testing purposes.
            reviewsSpy = jest
                .spyOn(ReviewsDAO, "addReview")
                .mockResolvedValue({ status: "success" });  // Mocking the addReview method to return a success response for testing purposes.

            const response = await request(app).post("/api/v1/reviews/new").send(test_request_body); // Making a POST request to the specified route with the new review data.

            expect(reviewsSpy).toHaveBeenCalledWith(
                test_request_body.movieId, 
                test_request_body.review, 
                test_request_body.user, 
                test_request_body.rating
            );    // Expecting the addReview method to have been called with the new review data.
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });

        // 7. Test case to check if the POST /api/v1/reviews route returns an error for missing required fields in the request body
        test("POST /api/v1/reviews; returns error 400 for missing required fields", async () => {
            let test_movie_id = "507b8b9c9c9c9c9c9c9c9c9c";  // Sample valid movie ID for testing purposes.

            let test_request_body = {
                movieId: test_movie_id,
                user: "TestUser",
                rating: 10
            };  // Sample request body with missing 'review' field for testing purposes.

            // Mocking the addReview method of the ReviewsDAO to return an error response for testing purposes.
            reviewsSpy = jest
                .spyOn(ReviewsDAO, "addReview")
                .mockResolvedValue({
                    error: "Missing required fields: movieId, review, user, and rating are required."
                });  // Mocking the addReview method to return an error response for testing purposes.
                
            const response = await request(app).post("/api/v1/reviews/new").send(test_request_body); // Making a POST request to the specified route with the new review data.

            expect(response.body).toHaveProperty("error");  // Expecting the response body to have a property 'error' since required fields are missing.
            expect(response.body.error).toBe("Missing required fields: movieId, review, user, and rating are required.");   // Expecting the error message in the response body to indicate that required fields are missing.
            expect(reviewsSpy).not.toHaveBeenCalled();    // Expecting addReview not to be called when required fields are missing.
            expect(response.status).toBe(400);  // Expecting the HTTP status code of the response to be 400 (Bad Request).
        });
    });

    describe("Reviews Routes that hit the updateReview mock method", () => {
        // Lifecycle methods to run after each test in this test suite
        afterEach(() => {   // runs automatically after every test
            // Restoring the original implementation of the addReview method after the test is complete.
            reviewsSpy.mockRestore();
        });


        // 8. Test case to check if the PUT /api/v1/reviews/:id route returns success for updating an existing review with valid input data
        test("PUT /api/v1/reviews/:id; updates a review successfully with valid input data", async () => {
            let test_review_id = "69e13a0ced9e3fc9079d787c";  // Sample valid review ID for testing purposes.

            let test_request_body = {
                user: "TestUser",
                review: "This is a test review.",
                rating: 10
            };

            // Mocking the updateReview method of the ReviewsDAO to return a success response for testing purposes.
            reviewsSpy = jest
                .spyOn(ReviewsDAO, "updateReview")
                .mockResolvedValue({ status: "success" });  // Mocking the updateReview method to return a success response for testing purposes.

            const response = await request(app).put(`/api/v1/reviews/${test_review_id}`).send(test_request_body); // Making a PUT request to the specified route with the updated review data.

            expect(reviewsSpy).toHaveBeenCalledWith(
                test_review_id, test_request_body.user, test_request_body.review, test_request_body.rating
            );    // Expecting the updateReview method to have been called with the updated review data.
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });
    });

    describe("Reviews Routes that hit the deleteReview mock method", () => {
        // Lifecycle methods to run after each test in this test suite
        afterEach(() => {   // runs automatically after every test
            // Restoring the original implementation of the addReview method after the test is complete.
            reviewsSpy.mockRestore();
        });


        // 9. Test case to check if the DELETE /api/v1/reviews/:id route returns success for deleting an existing review with valid input data
        test("DELETE /api/v1/reviews/:id; deletes a review successfully with valid input data", async () => {
            let test_review_id = "69e13a0ced9e3fc9079d787c";  // Sample valid review ID for testing purposes.

            // Mocking the deleteReview method of the ReviewsDAO to return a success response for testing purposes.
            reviewsSpy = jest
                .spyOn(ReviewsDAO, "deleteReview")
                .mockResolvedValue({ status: "success" });  // Mocking the deleteReview method to return a success response for testing purposes.

            const response = await request(app).delete(`/api/v1/reviews/${test_review_id}`); // Making a DELETE request to the specified route with the review ID.

            expect(reviewsSpy).toHaveBeenCalledWith(test_review_id);    // Expecting the deleteReview method to have been called with the review ID.
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });
    });
});

