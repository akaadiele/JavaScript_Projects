// --------------------------------------------------------------------------------------------------------------------
// Imports
import request from "supertest";    // Importing the Supertest library to make HTTP requests to the Express application for testing purposes.
import app from "../server.js";     // Importing the Express application instance from the server.js file to be used in the tests.
import { jest } from "@jest/globals";   // Importing the Jest testing framework to create mock functions and perform assertions in the tests.
import tmdbDAO from "../dao/tmdbDAO.js";

// --------------------------------------------------------------------------------------------------------------------
// Test suite for TMDB routes

describe("TMDB Routes", () => {

    // Test cases for the TMDB routes

    describe("TMDB Routes that hit the TMDb API", () => {
        // 1. Test case to check if the GET /api/v1/tmdb route returns a 'help' array
        test("GET /api/v1/tmdb; returns an array", async () => {
            const response = await request(app).get("/api/v1/tmdb"); // Making a GET request to the specified route to fetch TMDB data.

            // Below is the expected property in the response body for a successful request to the TMDB API.
            expect(Array.isArray(response.body.help)).toBe(true);  // Expecting the 'help' property in the response body to be an array.
            expect(response.body).toHaveProperty("help");  // Expecting the response body to have a property 'help'
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });
    });

    describe("TMDB Routes that hit the getPopularMovies mock method", () => {
        // Lifecycle methods to run before and after each test in this test suite
        let movieSpy;

        // 2. Test case to check if the GET /api/v1/tmdb/discover route returns an array
        test("GET /api/v1/tmdb/discover; returns an array & 'total_pages' > 0 & 'total_results' > 0", async () => {
            // Mocking the getPopularMovies method of the tmdbDAO to return a sample movie object for testing purposes.
            movieSpy = jest
                .spyOn(tmdbDAO, "getPopularMovies")
                .mockResolvedValue({
                    page: 1,
                    results: [
                        {
                            "adult": false,
                            "backdrop_path": "/9Z2uDYXqJrlmePznQQJhL6d92Rq.jpg",
                            "genre_ids": [
                                10751,
                                35,
                                12,
                                14,
                                16
                            ],
                            "id": 1226863,
                            "original_language": "en",
                            "original_title": "The Super Mario Galaxy Movie",
                            "overview": "Having thwarted Bowser's previous plot to marry Princess Peach, Mario and Luigi now face a fresh threat in Bowser Jr., who is determined to liberate his father from captivity and restore the family legacy. Alongside companions new and old, the brothers travel across the stars to stop the young heir's crusade.",
                            "popularity": 663.5937,
                            "poster_path": "/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg",
                            "release_date": "2026-04-01",
                            "title": "The Super Mario Galaxy Movie",
                            "video": false,
                            "vote_average": 6.799,
                            "vote_count": 466
                        },
                        {
                            "adult": false,
                            "backdrop_path": "/1x9e0qWonw634NhIsRdvnneeqvN.jpg",
                            "genre_ids": [
                                10749,
                                18
                            ],
                            "id": 1523145,
                            "original_language": "ru",
                            "original_title": "Твоё сердце будет разбито",
                            "overview": "High school student Polina is saved from bullying at her new school and makes a deal with the main bully Bars: he must pretend to be her boyfriend and protect her, and she must do everything he says. During this game, the couple develops real feelings, but her family and classmates have reasons to separate the lovers.",
                            "popularity": 430.5174,
                            "poster_path": "/7wIBfBl2gejt6xHxNSK0reVIm7E.jpg",
                            "release_date": "2026-03-26",
                            "title": "Your Heart Will Be Broken",
                            "video": false,
                            "vote_average": 7.2,
                            "vote_count": 61
                        },
                    ],
                    total_pages: 1,
                    total_results: 2
                });

            const response = await request(app).get("/api/v1/tmdb/discover"); // Making a GET request to the specified route to fetch popular movies.

            // Below is the expected property in the response body for a successful request to the TMDB API.
            expect(Array.isArray(response.body.results)).toBe(true);  // Expecting the response body to be an array.
            expect(response.body.total_pages).toBeGreaterThan(0);  // Expecting the 'total_pages' property in the response body to be greater than 0.
            expect(response.body.total_results).toBeGreaterThan(0);  // Expecting the 'total_results' property in the response body to be greater than 0.
            expect(response.body).toHaveProperty("results");  // Expecting the response body to have a property 'results'
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).

            // Restoring the original implementation of the getPopularMovies method after the test is complete.
            movieSpy.mockRestore();
        });
    });

    describe("TMDB Routes that hit the getMovie mock method", () => {
        // Lifecycle methods to run before and after each test in this test suite
        let movieSpy;

        afterEach(() => {   // runs automatically after every test
            // Restoring the original implementation of the getMovie method after the test is complete.
            movieSpy.mockRestore();
        });

        // 3. Test case to check if the GET /api/v1/tmdb/movie/:id route does not return 'success', 'status_code', and 'status_message' properties in the response body for a valid movie ID.
        test("GET /api/v1/tmdb/movie/:id; 'success', 'status_code', 'status_message' not to be defined", async () => {
            let test_movie_id = "507b8b9c9c9c9c9c9c9c9c9c";  // Sample valid movie ID for testing purposes.

            // Mocking the getMovie method of the tmdbDAO to return a sample movie object for testing purposes.
            movieSpy = jest
                .spyOn(tmdbDAO, "getMovie")
                .mockResolvedValue({
                    id: test_movie_id
                });  // Mocking the getMovie method to return a sample movie object with the specified ID.

            const response = await request(app).get(`/api/v1/tmdb/movie/${test_movie_id}`);  // Making a GET request to the specified route with a sample movie ID.

            // Below are the expected properties in the response body for a successful request to the TMDB API.
            expect(response.body.success).not.toBeDefined();  // Expecting the 'success' property in the response body to not be defined (null or undefined).
            expect(response.body.status_code).not.toBeDefined();  // Expecting the 'status_code' property in the response body to not be defined (null or undefined).
            expect(response.body.status_message).not.toBeDefined();  // Expecting the 'status_message' property in the response body to not be defined (null or undefined).
            expect(response.body).toHaveProperty("id");  // Expecting the response body to have a property 'id'
            expect(response.status).toBe(200);  // Expecting the HTTP status code of the response to be 200 (OK).
        });

        // 4. Test case to check if the GET /api/v1/tmdb/movie/:id route returns an error message for a syntactically valid movie ID that does not exist in the TMDB database
        test("GET /api/v1/tmdb/movie/:id; returns an error message for a valid movie ID that does not exist", async () => {
            let test_movie_id = "123456789123456789";  // Sample invalid movie ID for testing purposes.

            // Overriding the default mock implementation of the getMovie method to return a sample movie object with an error message for testing purposes.
            movieSpy = jest
                .spyOn(tmdbDAO, "getMovie")
                .mockResolvedValue({
                    error: "No movie found for movie id: '123456789123456789'",
                    status: 404,
                    success: "false",
                    status_code: 34,
                    status_message: "The resource you requested could not be found.",
                });  // Mocking the getMovie method to return a sample movie object with the specified ID.


            const response = await request(app).get(`/api/v1/tmdb/movie/${test_movie_id}`);  // Making a GET request to the specified route with a sample movie ID.

            // Below are the expected properties in the response body for an error response from the TMDB API.
            expect(response.body.error).toBe(`No movie found for movie id: '${test_movie_id}'`);
            expect(response.status).toBe(404);  // Expecting the HTTP status code of the response to be 404 (Not Found) for a valid movie ID that does not exist in the TMDB database.
        });

        // 5. Test case to check if the GET /api/v1/tmdb/movie/:id route returns an error message for an invalid movie ID
        test("GET /api/v1/tmdb/movie/:id; returns an error message for an invalid movie ID", async () => {
            let invalid_movie_id = "!!";  // Sample invalid movie ID for testing purposes.

            // Overriding the default mock implementation of the getMovie method to return a sample movie object with an error message for testing purposes.
            movieSpy = jest
                .spyOn(tmdbDAO, "getMovie")
                .mockResolvedValue({
                    id: invalid_movie_id,
                    error: "Invalid movie ID format",
                    status: 400
                });  // Mocking the getMovie method to return a sample movie object with the specified ID.


            const response = await request(app).get(`/api/v1/tmdb/movie/${invalid_movie_id}`);  // Making a GET request to the specified route with an invalid movie ID.

            // Below are the expected properties in the response body for an error response from the TMDB API.
            expect(response.body.error).toBe("Invalid movie ID format");    // Expecting the error message in the response body to indicate an invalid movie ID format.
            expect(response.status).toBe(400);  // Expecting the HTTP status code of the response to be 400 (Bad Request) for an invalid movie ID format.
        });
    });
});
// --------------------------------------------------------------------------------------------------------------------
