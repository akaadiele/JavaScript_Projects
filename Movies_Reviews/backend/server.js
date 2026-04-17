// --------------------------------------------------------------------------------------------------------------------
// Imports
import express from "express";  // Importing the Express.js framework
import cors from "cors";  // Importing the CORS middleware
import reviews from "./route/reviews.route.js";  // Importing the reviews route module
import tmdb from "./route/tmdb.route.js";  // Importing the TMDB route module

// --------------------------------------------------------------------------------------------------------------------
// Create Express App
const app = express();  // Creating an instance of the Express application.

// --------------------------------------------------------------------------------------------------------------------
// Express app configurations
// app.use(cors());  // Enabling CORS for all routes, allowing the server to accept requests from any origin.
app.use(cors({
    // origin: "*",  // Allowing requests from any origin (for development purposes). In production, specify allowed origins for better security.
    // methods: ["GET", "POST", "PUT", "DELETE"],  // Allowing specific HTTP methods for CORS requests.
    // allowedHeaders: ["Content-Type", "Authorization"]  // Allowing specific headers in CORS requests.
    origin: [
        "http://localhost:5500",  // Allowing requests from the local development frontend.
        "http://127.0.0.1:5500",  // Allowing requests from the local development frontend (alternative localhost address).
        "https://movies-and-reviews.onrender.com"  // Allowing requests from the deployed frontend on Render.
    ]
}));
app.use(express.json());  // Middleware to accept and handle incoming JSON requestsy

// --------------------------------------------------------------------------------------------------------------------
// Routes
// Reviews Route
app.use("/api/v1/reviews", reviews);  // Mounting the reviews route at the specified path. 
// "/api/v1/reviews" => reviews route module ('./api/reviews.route.js').

// TMDB Route
app.use("/api/v1/tmdb", tmdb);  // Mounting the TMDB route at the specified path. 
// "/api/v1/tmdb" => tmdb route module ('./api/tmdb.route.js').


// Backup Route
app.use(/./, (request, response) => {  
    // A catch-all route that matches any request that doesn't match the defined route above.
    // Custom error handling
    response.status(404).json({ error: "Not Found" });
});

// --------------------------------------------------------------------------------------------------------------------
// Exports
export default app;  // Exporting the Express application instance 

// --------------------------------------------------------------------------------------------------------------------
