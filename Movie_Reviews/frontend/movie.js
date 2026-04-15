// --------------------------------------------------------------------------------------------------------------------
// Declarations
// const apiBaseURL = `https://movie-review-api-o8bs.onrender.com/api/v1`;  // Base URL for the backend API
const apiBaseURL = `http://localhost:8000/api/v1`;  // Base URL for the backend API (local development)

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

let selectedRating = 10;    // Selected rating for new reviews initialized to 10

// Variables for calculating average rating
let sumOfRating = 0;   // Variable to store the sum of all ratings for the movie, initialized to 0
let avgRating = 0;    // Variable to store the average rating for the movie, initialized to 0
let numberOfReviews = 0;   // Variable to store the total number of reviews for the movie, initialized to 0

// --------------------------------------------------------------------------------------------------------------------
// Setting body background color to match the theme of the website
document.querySelector("body").style.backgroundColor = "#7C7C7C";

// --------------------------------------------------------------------------------------------------------------------
// Setting up the rating stars in the review form for new reviews
setupReviewFormRatingStars("newRatingInput");

// ----------------------------------------------------------------------------------------------------
// Movie Info

// Retrieving and displaying movie information
function fetchMovieInfo(currentMovieId) {
    const url = `${tmdbMovieApiLink}${currentMovieId}`;
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            // Extracting relevant movie information from the response data to display on the page
            const title = data.title;
            const overview = data.overview;
            const releaseYear = data.release_date.split("-")[0]

            // Handling movie images
            let imgPath = "";
            let imgBasePath = "https://image.tmdb.org/t/p/w1280";
            if (data.poster_path) {
                imgPath = imgBasePath + data.poster_path; // Using the poster image if available
            } else if (data.backdrop_path) {
                imgPath = imgBasePath + data.backdrop_path;   // Using the backdrop image if the poster is not available
            } else {
                imgPath = "./img/default_movie.jpg";  // Default image if no poster or backdrop is available
            }

            movieTitle.innerText = title;
            movieOverview.innerText = overview;
            movieReleaseYear.innerText = `Released: ${releaseYear}`;
            moviePoster.src = imgPath;
            moviePoster.alt = title;

            if (!data.imdb_id || data.imdb_id == null || data.imdb_id == "") {
                imdbLinkElement.innerHTML = "";
            } else {
                const imdbLink = `https://www.imdb.com/title/${data.imdb_id}/`;
                imdbLinkElement.href = imdbLink;
            }
        });
}

fetchMovieInfo(movieId);


// --------------------------------------------------------------------------------------------------------------------
// Functions

// Fetching and displaying reviews for the movie
function fetchReviews(url) {
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            data.forEach(review => {
                currentReviewId = review._id;
                currentReviewText = review.review;
                currentReviewUser = review.user;
                review.rating ? currentReviewRating = review.rating : currentReviewRating = 0;

                // console.log("Current review rating:", currentReviewRating);
                sumOfRating += currentReviewRating;
                numberOfReviews++;


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
                                <a href="#" class="btn btn-sm btn-info" onclick="editReview(\`${currentReviewId}\`, \`${currentReviewText}\`, \`${currentReviewUser}\`, \`${currentReviewRating}\`)" hidden>
                                    <i class="fa-solid fa-pencil"></i> Edit
                                </a>
                                <a href="#" class="btn btn-sm btn-secondary" onclick="deleteReview('${currentReviewId}')" hidden>
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </a>
                            </p>
                        </div>
                    </div>
                `;

                // Appending the created review card to the reviews section
                reviewsSection.appendChild(divReview);

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

            
            <a href="#" class="btn btn-success" onclick="saveReview('${reviewInputId}', '${userInputId}', '${ratingInputId}', '${reviewId}')">
                <i class="fa-regular fa-floppy-disk"> </i> Update
            </a>

            <a href="#" class="btn btn-secondary" onclick="cancelEdit()">
                <i class="fa-solid fa-x"></i> Cancel
            </a>
        </div>`;


    // Setting up the rating stars in the review form for editing reviews
    setupReviewFormRatingStars(ratingInputId, reviewRating);
}


// --------------------------------------------------------------------------------------------------------------------
// Saving a new review or updating an existing review
function saveReview(reviewInputId, userInputId, ratingInputId, reviewId = null) {
    const updatedReview = document.getElementById(reviewInputId).value;
    const updatedUser = document.getElementById(userInputId).value;
    const updatedRating = document.getElementById(ratingInputId);

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
                    "rating": updatedRatingValue
                }
            )
        })
            .then(response => response.json())
            .then(res => {
                location.reload();  // Reloading the page
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
                "rating": updatedRatingValue
            })
        })
            .then(response => response.json())
            .then(res => {
                location.reload();  // Reloading the page
            });
    }
}


// --------------------------------------------------------------------------------------------------------------------
// Deleting a review
function deleteReview(reviewId) {
    fetch(`${reviewsApiLink}${reviewId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(res => {
            location.reload();  // Reloading the page
        });
}


// --------------------------------------------------------------------------------------------------------------------
// Canceling the edit operation
function cancelEdit() {
    location.reload();  // Reloading the page
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
    let allRatingStars = ratingElement.querySelectorAll(".fa-star");

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
    let editableRatingStars = ratingElement.querySelectorAll(".edit-allowed");

    let currentRating = initialRating;   // Variable to keep track of the current selected rating value
    // Adding event listeners to each star for user interaction
    editableRatingStars.forEach((star, index) => {
        // Updating star and selected rating value based on user interactions with the stars in the review form

        // When a star is clicked
        star.addEventListener("click", function () {
            currentRating = index + 1;
            updateRatingStars(currentRating, editableRatingStars);
            selectedRating = currentRating;
        });

        // When a star is hovered over
        star.addEventListener("mouseover", function () {
            tempRating = index + 1;
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
// Clean up String
function cleanUpString(str) {
    // Replace quotes with escaped quotes to prevent issues when passing strings as arguments in HTML attributes (e.g., onclick handlers).
    str = str.replace(/'/g, "\\'").replace(/"/g, '\\"');

    // Replacing multiple consecutive whitespace characters with a single space and trimming leading/trailing whitespace from the string.
    str = str.replace(/\s+/g, ' ').trim();

    return str; // Returning the cleaned-up string after processing.
}

// --------------------------------------------------------------------------------------------------------------------

