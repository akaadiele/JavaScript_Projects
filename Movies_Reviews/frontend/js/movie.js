// --------------------------------------------------------------------------------------------------------------------
// Declarations
const apiBaseURL = `https://movie-review-api-o8bs.onrender.com/api/v1`;  // Base URL for the backend API

const reviewsApiLink = `${apiBaseURL}/reviews/`;    // API URL for fetching reviews from the backend API (e.g., /api/v1/reviews/movie/{id}).
const tmdbMovieApiLink = `${apiBaseURL}/tmdb/movie/`;   // API URL for fetching movie information from the backend API (e.g., /api/v1/tmdb/movie/{id}).

const url = new URL(window.location.href);  // New URL object to access query parameters from the current window location.
const movieId = url.searchParams.get("id");  // Extracting the "id" query parameter from the URL, which represents the movie ID for which we want to fetch reviews.

// HTML Elements
const moviePoster = document.querySelector("#moviePoster");
const movieTitle = document.querySelector("#movieTitle");
const movieOverview = document.querySelector("#movieOverview");
const movieReleaseYear = document.querySelector("#movieReleaseYear");
const movieAverageRating = document.querySelector("#averageRating");
const imdbLinkElement = document.querySelector("#imdbLink");
const reviewsSection = document.querySelector("#reviews-section");
const titleElement = document.querySelector("title");

// Variables for calculating average rating
let sumOfRating = 0;   // Variable to store the sum of all ratings for the movie, initialized to 0
let avgRating = 0;    // Variable to store the average rating for the movie, initialized to 0
let numberOfReviews = 0;   // Variable to store the total number of reviews for the movie, initialized to 0

// --------------------------------------------------------------------------------------------------------------------
// Setting body background color to match the theme of the website
document.querySelector("body").style.backgroundColor = "#7C7C7C";

// --------------------------------------------------------------------------------------------------------------------
// New Reviews

// Setting up the rating stars in the review form for new reviews
setupReviewFormRatingStars("newRatingInput");

// Adding event listener to the save button for new reviews to save the new review when clicked
const saveNewReviewButton = document.querySelector("#save-new-review");
if (saveNewReviewButton) {
    saveNewReviewButton.addEventListener("click", function (event) {
        event.preventDefault();
        saveReview("newReviewInput", "newUserInput", "newRatingInput");
    });
}

// ----------------------------------------------------------------------------------------------------
// Movie Info

// Retrieving and displaying movie information
function fetchMovieInfo(currentMovieId) {
    const url = `${tmdbMovieApiLink}${currentMovieId}`;
    fetch(url)
        // check http status before parsing response as JSON to handle errors properly
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch movie info");
            }
            return response.json();
        })
        .then(function (data) {
            // Extracting relevant movie information from the response data to display on the page
            const title = data.title;
            const overview = data.overview;
            const releaseYear = data.release_date.split("-")[0];

            // Handling movie images
            let imgPath = "https://image.tmdb.org/t/p/w1280";
            if (data.poster_path) {
                imgPath = imgPath + data.poster_path; // Using the poster image if available
            } else if (data.backdrop_path) {
                imgPath = imgPath + data.backdrop_path;   // Using the backdrop image if the poster is not available
            } else {
                imgPath = "./img/default_movie.jpg";  // Default image if no poster or backdrop is available
            }

            titleElement.innerText += ` - ${title}`;   // Appending the movie title to the page title for better user experience and SEO

            movieTitle.innerText = title;
            movieOverview.innerText = overview;
            movieReleaseYear.innerText = `Released: ${releaseYear}`;
            moviePoster.src = imgPath;
            moviePoster.alt = title;

            if (!data.imdb_id || data.imdb_id === null || data.imdb_id === "") {
                imdbLinkElement.innerHTML = "";
            } else {
                const imdbLink = `https://www.imdb.com/title/${data.imdb_id}/`;
                imdbLinkElement.href = imdbLink;
            }
        })
        .catch(() => {
            alert("An error occurred while fetching movie information. Please try again later.");
        });
}

fetchMovieInfo(movieId);


// --------------------------------------------------------------------------------------------------------------------
// Functions

// Fetching and displaying reviews for the movie
function fetchReviews(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }
            return response.json();
        })
        .then(function (data) {
            data.reviews.forEach(review => {
                const currentReviewId = review._id;
                const currentReviewText = sanitizeUserInput(review.review);
                const currentReviewUser = sanitizeUserInput(review.user);
                let currentReviewRating;
                review.rating ? currentReviewRating = review.rating : currentReviewRating = 0;

                // Values for calculating average rating
                sumOfRating += currentReviewRating;     // Accumulating the sum of ratings
                numberOfReviews++;  // Incrementing the count of reviews

                // Creating a review card for each review and displaying it on the page
                const divReview = document.createElement("div");
                divReview.classList.add("col", "mb-3", "d-flex", "justify-content-center");

                divReview.innerHTML = `
                    <div class="card text-bg-light mb-3" id="${currentReviewId}" style="width: 18rem; max-width: 20rem;">
                        <div class="card-header bg-secondary text-light">
                            <span class="badge text-wrap" id="rating-${currentReviewId}" readonly></span>
                        </div>
                        
                        <div class="card-body">
                            <h5 class="card-title">
                                ${currentReviewUser}
                            </h5>
                            <p class="card-text font-monospace">
                                ${currentReviewText}
                            </p>

                            <p>
                                <a href="#" class="btn btn-sm btn-info" id="edit-${currentReviewId}">
                                    <i class="fa-solid fa-pencil"></i> Edit
                                </a>
                                <a href="#" class="btn btn-sm btn-secondary" id="delete-${currentReviewId}">
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </a>
                            </p>
                        </div>
                    </div>
                `;

                // Appending the created review card to the reviews section
                reviewsSection.appendChild(divReview);

                // Adding event listeners to the edit and delete buttons for each review to allow users to edit or delete their reviews
                const editButton = document.getElementById(`edit-${currentReviewId}`);
                editButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    editReview(currentReviewId, currentReviewText, currentReviewUser, currentReviewRating);
                });

                const deleteButton = document.getElementById(`delete-${currentReviewId}`);
                deleteButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    deleteReview(currentReviewId);
                });

                // Setting up the rating stars for each review based on the current review's rating
                setupReviewFormRatingStars(`rating-${currentReviewId}`, currentReviewRating, true);
            });

            // Calculating and displaying the average rating for the movie based on the fetched reviews
            if ((numberOfReviews > 0) && (sumOfRating > 0)) {
                avgRating = Math.floor(sumOfRating / numberOfReviews);
                movieAverageRating.innerHTML = `Average Rating: ${avgRating} <small class="ratingTotal">/ 10</small>`;
            } else {
                movieAverageRating.innerHTML = `Average Rating: <small class="ratingTotal fst-italic">No ratings yet</small>`;
            }
        })
        .catch(() => {
            alert("An error occurred while fetching reviews. Please try again later.");
        });
}


// Fetching the reviews for the current movie
fetchReviews(`${reviewsApiLink}movie/${movieId}`);


// --------------------------------------------------------------------------------------------------------------------
// Editing a review
function editReview(reviewId, reviewText, reviewUser, reviewRating) {
    const element = document.getElementById(reviewId);
    const reviewInputId = "review" + reviewId;
    const userInputId = "user" + reviewId;
    const ratingInputId = "rating" + reviewId;

    element.innerHTML = `
        <div class="card-header">
            <h5>Edit Review:</h5>
        </div>
        
        <div class="card-body">
            <div class="form-control mb-3">
                <label for="${ratingInputId}">Rating: <small class="fst-italic">(click star to rate)</small></label>
                <div id="${ratingInputId}">
                    
                </div>
            </div>

            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Leave a comment here" id="${reviewInputId}" style="height: 100px;">${reviewText}</textarea>
                <label for="${reviewInputId}"><em>Review:</em> </label>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="${userInputId}" value="${reviewUser}">
                <label for="${userInputId}"><em>Name:</em></label>
            </div>

            
            <a href="#" class="btn btn-success" id="save-${reviewInputId}">
                <i class="fa-regular fa-floppy-disk"> </i> Update
            </a>

            <a href="#" class="btn btn-secondary" id="cancel-${reviewInputId}">
                <i class="fa-solid fa-x"></i> Cancel
            </a>
        </div>`;

    // Adding event listener to the save button in the edit review form to save the updated review when clicked
    const saveButton = document.getElementById(`save-${reviewInputId}`);
    saveButton.addEventListener("click", function (event) {
        event.preventDefault();
        saveReview(reviewInputId, userInputId, ratingInputId, reviewId);
    });


    // Adding event listener to the cancel button in the edit review form 
    // to cancel the edit operation and revert back to the original review card when clicked
    const cancelButton = document.getElementById(`cancel-${reviewInputId}`);
    cancelButton.addEventListener("click", function (event) {
        event.preventDefault();
        cancelEdit();
    });

    // Setting up the rating stars in the review form for editing reviews
    setupReviewFormRatingStars(ratingInputId, reviewRating);
}


// --------------------------------------------------------------------------------------------------------------------
// Saving a new review or updating an existing review
function saveReview(reviewInputId, userInputId, ratingInputId, reviewId = null) {
    const updatedReview = document.getElementById(reviewInputId).value;
    const updatedUser = document.getElementById(userInputId).value;
    const updatedRating = document.getElementById(ratingInputId);

    const tmdbMovieTitle = movieTitle.innerText;

    // Getting the updated rating value from the rating stars in the edit review form
    const selectedRatingStars = updatedRating.querySelectorAll(".fa-solid");    // Selecting all the filled star elements
    const updatedRatingValue = selectedRatingStars.length;   // counting the number of filled stars to determine the selected rating value

    if (reviewId) {
        // Updating an existing review
        fetch(`${reviewsApiLink}${reviewId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "review": updatedReview,
                    "user": updatedUser,
                    "rating": updatedRatingValue,
                    "movieTitle": tmdbMovieTitle
                }
            )
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update review");
                }
                return response.json();
            })
            .then(() => window.location.reload())     // Reloading the page
            .catch(() => {
                alert("An error occurred while updating the review. Please try again later.");
            });
    } else {
        // Creating a new review
        fetch(`${reviewsApiLink}new`, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "movieId": movieId,
                "review": updatedReview,
                "user": updatedUser,
                "rating": updatedRatingValue,
                "movieTitle": tmdbMovieTitle
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to create review");
                }
                return response.json();
            })
            .then(() => window.location.reload())     // Reloading the page
            .catch(() => {
                alert("An error occurred while creating the review. Please try again later.");
            });
    }
}


// --------------------------------------------------------------------------------------------------------------------
// Deleting a review
function deleteReview(reviewId) {
    fetch(`${reviewsApiLink}${reviewId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete review");
            }
            return response.json();
        })
        .then(() => window.location.reload())     // Reloading the page
        .catch(() => {
            alert("An error occurred while deleting the review. Please try again later.");
        });
}


// --------------------------------------------------------------------------------------------------------------------
// Canceling the edit operation
function cancelEdit() {
    window.location.reload();  // Reloading the page
}


// --------------------------------------------------------------------------------------------------------------------

// ********************************************************************************************************************
// Handling Star Ratings

// Functions
// Creating the star elements for the rating system in the review form
function createRatingStars(ratingCount, ratingElement) {
    for (let i = 0; i < ratingCount; i++) {
        const star = document.createElement("i");
        star.classList.add("fa-star", "edit-allowed", "fa-regular");
        ratingElement.appendChild(star);
    }
}

// Updating the filled star elements based on the selected rating
function updateRatingStars(ratingValue, ratingStarElements) {
    ratingStarElements.forEach((star, index) => {
        if (index < ratingValue) {
            // Activate the star by changing its classes to represent a filled star
            star.classList.remove("fa-regular");
            star.classList.add("fa-solid");
            star.classList.add("text-warning");
        } else {
            // Deactivate the star by changing its classes to represent an empty star
            star.classList.remove("fa-solid");
            star.classList.remove("text-warning");
            star.classList.add("fa-regular");
        }
    });
}

// --------------------------------------------------------------------------------------------------------------------
// Handling the rating stars in the review form
function setupReviewFormRatingStars(ratingElementId, initialRating = 10, isReadOnly = false) {
    // Creating the rating stars in ratingElement
    const ratingElement = document.querySelector(`#${ratingElementId}`);    // Selecting the rating element where the rating stars will be displayed
    const numberOfStars = 10;   // Total number of stars for the rating system
    createRatingStars(numberOfStars, ratingElement);

    // Selecting all the star elements within the ratingElement to add event listeners for click events
    const allRatingStars = ratingElement.querySelectorAll(".fa-star");

    // Updating the star elements based on the initial rating value when the form is set up
    updateRatingStars(initialRating, allRatingStars);

    // Making the rating stars read-only if specified
    if (isReadOnly) {
        allRatingStars.forEach(star => {
            // removing the "edit-allowed" class and disabling pointer events for the stars to prevent user interaction
            star.classList.remove("edit-allowed");
            star.style.pointerEvents = "none";
        });
    }

    // Selecting all the star elements within the ratingElement to add event listeners for click events
    const editableRatingStars = ratingElement.querySelectorAll(".edit-allowed");

    let currentRating = initialRating;   // Variable to keep track of the current selected rating value
    // Adding event listeners to each star for user interaction
    editableRatingStars.forEach((star, index) => {
        // Updating star and selected rating value based on user interactions with the stars in the review form

        // When a star is clicked
        star.addEventListener("click", function () {
            currentRating = index + 1;
            updateRatingStars(currentRating, editableRatingStars);
        });

        // When a star is hovered over
        star.addEventListener("mouseover", function () {
            const tempRating = index + 1;
            updateRatingStars(tempRating, editableRatingStars);
        });

        // When the mouse leaves a star
        star.addEventListener("mouseout", function () {
            updateRatingStars(currentRating, editableRatingStars);
        });
    });
}

// ********************************************************************************************************************
// --------------------------------------------------------------------------------------------------------------------
// Function to clean up and return user input to prevent XSS attacks 
// by escaping special characters in user input before displaying it on the page
function sanitizeUserInput(inputText) {
    // clean up text and return clean text
    const tempElement = document.createElement("div");

    // Using textContent to set the input text as the content of a temporary DOM element, 
    // This automatically escapes any special characters in the input text, preventing them from being interpreted as HTML
    tempElement.textContent = inputText;
    const sanitizedText = tempElement.innerHTML;   // Retrieving the sanitized text from the temporary element

    // Removing 'tempElement' from the DOM
    tempElement.remove();

    return sanitizedText;   // Returning the sanitized text
}


// --------------------------------------------------------------------------------------------------------------------

