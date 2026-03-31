// --------------------------------------------------------------------------------------------------------------------
// Initial checks
import dotenv from "dotenv";  // Importing the dotenv package to load environment variables
dotenv.config();  // Loading environment variables

// --------------------------------------------------------------------------------------------------------------------
// Imports
import mongodb from "mongodb";  // Importing the MongoDB driver to interact with a MongoDB database.
import app from "./server.js";  // Importing the Express application instance from the server.js file
import ReviewsDAO from "./dao/reviewsDAO.js";  // Importing the Reviews Data Access Object (DAO) module

// --------------------------------------------------------------------------------------------------------------------
// MongoDB Connection
const serverPort = process.env.PORT;
const mongoDb_U = process.env.MONGODB_U;
const mongoDb_P = process.env.MONGODB_P;
const mongoUri = `mongodb+srv://${mongoDb_U}:${mongoDb_P}@cluster0.bfqdijr.mongodb.net/?appName=Cluster0`;  // MongoDB connection URI
const MongoClient = mongodb.MongoClient;    // Creating a MongoClient instance to connect to the MongoDB database.

MongoClient.connect(  // Connecting to the MongoDB database using the connection URI and options for the connection.
    mongoUri,
    {
        maxPoolSize: 50,    // Maximum number of connections in the connection pool
        wtimeoutMS: 2500,   // Write timeout in milliseconds
    })
    .catch((err) => {
        // Handling any errors that occur during the connection to MongoDB.
        console.error(`Failed to connect to MongoDB: ${err}`);  // Logging an error message to the console if the connection fails.
        process.exit(1);  // Exiting the process
    })
    .then(async (client) => {
        // Handling the successful connection to MongoDB
        await ReviewsDAO.injectDB(client);  // Injecting the MongoDB client into the ReviewsDAO, allowing it to interact with the database.

        // Starting the Express server and listening on the specified port.
        app.listen(serverPort, () => {
            console.log(`Server is running on port ${serverPort}`);  // Logging a message to the console indicating that the server is running and on which port.
        });
    });


// --------------------------------------------------------------------------------------------------------------------
