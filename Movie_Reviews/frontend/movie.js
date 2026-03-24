

const apiLink = `http://127.0.0.1:8000/api/v1/reviews/`;

const url = new URL(window.location.href);  // Creating a new URL object using the current window's URL, allowing us to easily access query parameters.
// ?id=1265609&title=War%20Machine
const movieId = url.searchParams.get("id");  // Extracting the "id" query parameter from the URL, which represents the movie ID for which we want to fetch reviews.

const movieSection = document.querySelector("#movie-section");
const titleElement = document.querySelector("#title");


// Update the title element with the movie title from the URL query parameter



// ----------------------------------------------------------------------------------------------------
// Movie Info
const apiKey = "3337908d4e0727354bbcd62232421223";
function fetchMovieInfo(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
                console.log("Fetched movie info:", data);
                
                const imdbLink = `https://www.imdb.com/title/${data.imdb_id}/`;
                const title = data.title;
                const releaseYear = data.release_date.split("-")[0]
                const overview = data.overview;

                titleElement.innerText = title;
                
            });
}

fetchMovieInfo(movieId);


// ----------------------------------------------------------------------------------------------------
// Reviews

// New review
const divNewReview = document.createElement("div");
divNewReview.innerHTML = `<div class="row">
                    <div class="column">
                        <div class="card">
                            <h3>New Review:</h3>
                            <hr>
                            
                            <p><strong>Review:</strong> </p>
                            <textarea rows="3" cols="45" id="newReviewInput" class="edit-input"></textarea>
                            
                            <br><br>
                            <p><strong>User:</strong></p>
                            <input type="text" id="newUserInput" class="edit-input">

                            <br>
                            <p>
                            <a href="#" class="edit-link" onclick="saveReview('newReviewInput', 'newUserInput')"><i class="fa-regular fa-floppy-disk"></i></a>
                            </p>
                        </div>
                    </div>
                </div>`;
movieSection.appendChild(divNewReview);

// // Initial fetch of popular movies
fetchReviews(`${apiLink}movie/${movieId}`);

function fetchReviews(url) {
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            // console.log("Fetched reviews:", data);

            data.forEach(review => {
                const divReview = document.createElement("div");

                divReview.innerHTML = `<div class="row">
                    <div class="column">
                        <div class="card" id="${review._id}">
                            <p><strong>Review:</strong> ${review.review}</p>
                            <p><strong>User:</strong> ${review.user}</p>
                            
                            <br>
                            <p>
                            <a href="#" class="edit-link" onclick="editReview('${review._id}', '${review.review}', '${review.user}')"><i class="fa-solid fa-pencil"></i></a> | 
                            <a href="#" class="delete-link" onclick="deleteReview('${review._id}')"><i class="fa-solid fa-trash"></i></a>
                            </p>
                        </div>
                    </div>
                </div>`;

                movieSection.appendChild(divReview);
            });
        });
}


function editReview(reviewId, reviewText, reviewUser) {
    console.log(reviewText);

    const element = document.getElementById(reviewId);
    console.log(element);

    const reviewInputId = "review" + reviewId;
    const userInputId = "user" + reviewId;

    // <input type="text" id="${reviewInputId}" value="${reviewText}" class="edit-input">

    element.innerHTML = `
    <p><strong>Review:</strong></p>
    
    <textarea rows="3" cols="45" id="${reviewInputId}" class="edit-input">${reviewText}</textarea>
    
    <p><strong>User:</strong> </p>
    <input type="text" id="${userInputId}" value="${reviewUser}" class="edit-input">
    
    <br>
    <p>
        <a href="#" class="save-link" onclick="saveReview('${reviewInputId}', '${userInputId}', '${reviewId}')"><i class="fa-regular fa-floppy-disk"></i></a> | 
        <a href="#" class="cancel-link" onclick="cancelEdit()"><i class="fa-solid fa-x"></i></a>
    </p>
    `;
}

function saveReview(reviewInputId, userInputId, reviewId = null) {
    const updatedReview = document.getElementById(reviewInputId).value;
    const updatedUser = document.getElementById(userInputId).value;

    if (reviewId) {
        // Updating an existing review
        fetch(`${apiLink}${reviewId}`, {
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
                console.log("response:", res);
                location.reload();  // Reloading the page to reflect the updated review after a successful update operation.
            });
    } else {
        // Creating a new review
        fetch(`${apiLink}new`, {
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
                console.log("response:", res);
                location.reload();
            });
    }
}

function cancelEdit() {
    location.reload();  // Reloading the page to cancel the edit operation and revert back to the original review display.
}

function deleteReview(reviewId) {
    fetch(`${apiLink}${reviewId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(res => {
            console.log("response:", res);
            location.reload();
        });
}



// const movieApiLink = `https://api.themoviedb.org/3/movie/1290821?api_key=${apiKey}`;
// const imdbLink = `https://www.imdb.com/title/${element.imdb_id}/`;
// element.overview


