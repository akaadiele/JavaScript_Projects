// --------------------------------------------------------------------------------------------------------------------
// Imports
import mongodb from "mongodb";  // Importing the MongoDB driver to interact with a MongoDB database.

// --------------------------------------------------------------------------------------------------------------------
// Declarations
const ObjectId = mongodb.ObjectId;  // Extracting the ObjectId class from the MongoDB driver, used to create and manipulate MongoDB ObjectIDs.
let reviews;  // Variable to hold the reference to the reviews collection in the MongoDB database.

// --------------------------------------------------------------------------------------------------------------------
// Exporting the ReviewsDAO class
export default class ReviewsDAO {

    // Method to inject the MongoDB client and set up the reference to the reviews collection.
    static async injectDB(connector) {
        if (reviews) {  // Checking if the 'reviews' variable already has a reference to the reviews collection.
            return;
        }

        // If the 'reviews' variable does not have a reference to the reviews collection, 
        // Attempt to set it up using the provided MongoDB client and database reference.
        try {
            // Setting the reviews variable to reference the reviews collection in the movie_reviews database using the provided MongoDB client (connector).
            reviews = await connector.db("movies").collection("reviews");
        } catch (error) {
            // Logging an error message to the console
            console.error("Unable to establish DB connection handles in userDAO:", error);
        }
    }

    // Method to handle POST requests for creating a new review.
    static async addReview(movieId, review, user, rating=10) {
        try {
            // Creating a review document object to be inserted into the reviews collection
            const reviewDoc = {
                movieId: parseInt(movieId),  // Storing the movie ID as a number to match existing query behavior.
                user: user,     // Storing the user information in the database.
                review: review,     // Storing the review text in the database.
                rating: rating,   // Storing the rating in the database.
                date: new Date()  // Storing the current date and time when the review is created.
            };

            // Inserting the review document into the reviews collection and returning the result of the insertion operation.
            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error("Error adding review:", error);   // Logging the error to the console for debugging purposes.
            return { error: "Unable to post review", details: error.message };  // Error response
        }
    }

    // Method to fetch a specific review by its ID.
    static async getReview(reviewId) {
        try {
            // Fetching a specific review from the reviews collection by its review ID
            return await reviews.findOne(
                {
                    _id: new ObjectId(reviewId)     // Converting the review ID to a MongoDB ObjectId type for the query.
                }
            );  // Returning the review document that matches the specified review ID, or null if no review is found.
        } catch (error) {
            console.error("Error fetching review:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to get review", details: error.message }; // Error response
        }
    }

    // Method to update a specific review by its ID.
    static async updateReview(reviewId, user, review, rating) {
        try {
            // Updating a specific review in the reviews collection by its ID
            const updateResponse = await reviews.updateOne(
                // Querying for the review to update by its ID,
                {
                    _id: new ObjectId(reviewId) // Converting the review ID to a MongoDB ObjectId type for the query.
                },
                {
                    $set: {  // Using the $set operator to specify the fields to update in the review document.
                        user: user,    // Updating the user information in the review document.
                        review: review,   // Updating the review text in the review document.
                        rating: rating,   // Updating the rating in the review document.
                        date: new Date()    // Updating the date to the current date and time when the review is updated.
                    }
                }
            );

            // Returning the result of the update operation
            // This includes information about the number of documents matched and modified. (modifiedCount)
            return updateResponse;
        } catch (error) {
            console.error("Error updating review:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to update review", details: error.message };    // Error response
        }
    }

    // Method to delete a specific review by its ID.
    static async deleteReview(reviewId) {
        try {
            // Deleting a specific review from the reviews collection by its ID, converting the review ID to a MongoDB ObjectId type for the query.
            const deleteResponse = await reviews.deleteOne({ _id: new ObjectId(reviewId) });

            // Returning the result of the delete operation
            return deleteResponse;
        } catch (error) {
            console.error("Error deleting review:", error); // Logging the error to the console for debugging purposes.
            return { error: "Unable to delete review", details: error.message };    // Error response
        }
    }

    // Method to fetch all reviews for a specific movie by its ID.
    static async getReviewsByMovieId(movieId) {
        try {
            // Fetching all reviews for a specific movie by its ID.
            const cursor = await reviews.find(  // Querying the reviews collection for reviews that match the specified movie ID
                { 
                    movieId: parseInt(movieId)  // Converting the movie ID to a number to match existing query behavior
                }
            );  //  Returning a cursor to iterate over the results.

            // Returning all reviews for the specified movie ID as an array of objects.
            return await cursor.toArray();  // Converting the cursor to an array of review documents and returning it.
        } catch (error) {
            console.error("Error fetching reviews:", error);    // Logging the error to the console for debugging purposes.
            return { error: "Unable to get reviews", details: error.message };  // Error response
        }
    }

}


// --------------------------------------------------------------------------------------------------------------------
