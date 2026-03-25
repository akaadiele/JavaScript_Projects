// --------------------------------------------------------------------------------------------------------------------
// Declarations
const reviewsApiLink = `https://movie-review-api-o8bs.onrender.com/api/v1/reviews/`;

const url = new URL(window.location.href);  // Creating a new URL object using the current window's URL, allowing us to easily access query parameters.
const movieId = url.searchParams.get("id");  // Extracting the "id" query parameter from the URL, which represents the movie ID for which we want to fetch reviews.

const reviewsSection = document.querySelector("#reviews-section");
const movieTitle = document.querySelector("#movieTitle");
const movieOverview = document.querySelector("#movieOverview");
const movieReleaseYear = document.querySelector("#movieReleaseYear");
const moviePoster = document.querySelector("#moviePoster");
const imdbLinkElement = document.querySelector("#imdbLink");


// ----------------------------------------------------------------------------------------------------
// Movie Info
const apiKey = "3337908d4e0727354bbcd62232421223";

// Retrieving and displaying movie information
function fetchMovieInfo(currentMovieId) {
    const url = `https://api.themoviedb.org/3/movie/${currentMovieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            const title = data.title;
            const overview = data.overview;
            const releaseYear = data.release_date.split("-")[0]
            const imgPath = data.poster_path ? "https://image.tmdb.org/t/p/w500" + data.poster_path : "https://image.tmdb.org/t/p/w500" + data.backdrop_path;

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
                const divReview = document.createElement("div");
                divReview.classList.add("col", "mb-3");

                divReview.innerHTML = `
                    <div class="card text-bg-light mb-3" id="${review._id}" style="width: 18rem; max-width: 20rem;">
                        <div class="card-header"><em>Review</em></div>
                        <div class="card-body">
                            <h5 class="card-title">
                                ${review.user}
                            </h5>
                            <p class="card-text font-monospace">
                                ${review.review}
                            </p>

                            <p>
                                <a href="#" class="btn btn-sm btn-info" onclick="editReview('${review._id}', '${review.review}', '${review.user}')" hidden>
                                    <i class="fa-solid fa-pencil"></i> Edit
                                </a>
                                <a href="#" class="btn btn-sm btn-secondary" onclick="deleteReview('${review._id}')" hidden>
                                    <i class="fa-solid fa-trash-can"></i> Delete
                                </a>
                            </p>
                        </div>
                    </div>
                `;

                reviewsSection.appendChild(divReview);
            });
        });
}

fetchReviews(`${reviewsApiLink}movie/${movieId}`);


// Editing a review
function editReview(reviewId, reviewText, reviewUser) {
    const element = document.getElementById(reviewId);
    const reviewInputId = "review" + reviewId;
    const userInputId = "user" + reviewId;

    element.innerHTML = `
        <div class="card-header"><em>Edit Review:</em></div>
        <div class="card-body">
            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="Leave a comment here" id="${reviewInputId}" style="height: 100px;">${reviewText}</textarea>
                <label for="newReviewInput"><em>Review:</em> </label>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="${userInputId}" value="${reviewUser}">
                <label for="newUserInput"><em>Name:</em></label>
            </div>

            
            <a href="#" class="btn btn-success" onclick="saveReview('${reviewInputId}', '${userInputId}', '${reviewId}')">
                <i class="fa-regular fa-floppy-disk"> </i> Update
            </a>

            <a href="#" class="btn btn-secondary" onclick="cancelEdit()">
                <i class="fa-solid fa-x"></i> Cancel
            </a>
        </div>`;
}


// Saving a new review or updating an existing review
function saveReview(reviewInputId, userInputId, reviewId = null) {
    const updatedReview = document.getElementById(reviewInputId).value;
    const updatedUser = document.getElementById(userInputId).value;

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
                    "user": updatedUser
                }
            )
        })
            .then(response => response.json())
            .then(res => {
                location.reload();  // Reloading the page to reflect the updated review after a successful update operation.
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
                "user": updatedUser
            })
        })
            .then(response => response.json())
            .then(res => {
                location.reload();
            });
    }
}


// Deleting a review
function deleteReview(reviewId) {
    fetch(`${reviewsApiLink}${reviewId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(res => {
            location.reload();
        });
}


// Canceling the edit operation
function cancelEdit() {
    location.reload();  // Reloading the page to cancel the edit operation and revert back to the original review display.
}


// --------------------------------------------------------------------------------------------------------------------
