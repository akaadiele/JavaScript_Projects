// --------------------------------------------------------------------------------------------------------------------
// Imports
import express from "express";  // Importing the Express.js framework
import cors from "cors";  // Importing the CORS middleware
import reviews from "./api/reviews.route.js";  // Importing the reviews route module

// --------------------------------------------------------------------------------------------------------------------
// Create Express App
const app = express();  // Creating an instance of the Express application.

// --------------------------------------------------------------------------------------------------------------------
// Express app configurations
app.use(cors());  // Enabling CORS for all routes, allowing the server to accept requests from any origin.
app.use(express.json());  // Middleware to accept and handle incoming JSON requestsy

// --------------------------------------------------------------------------------------------------------------------
// Routes
// Reviews Route
app.use("/api/v1/reviews", reviews);  // Mounting the reviews route at the specified path. 
// "/api/v1/reviews" => reviews route module ('./api/reviews.route.js').

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
