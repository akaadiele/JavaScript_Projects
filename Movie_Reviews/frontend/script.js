// --------------------------------------------------------------------------------------------------------------------
// Declarations
const tmdbApiLink = `https://movie-review-api-o8bs.onrender.com/api/v1/tmdb`;  // Base URL for the backend API (deployed)
// const tmdbApiLink = `http://localhost:8000/api/v1/tmdb`;  // Base URL for the backend API (local)

const discoverApi = `${tmdbApiLink}/discover`;  // Constructing the API URL for fetching popular movies from TMDB, including the API key and sorting by popularity.
const imgBasePath = 'https://image.tmdb.org/t/p/w1280';
const searchApi = `${tmdbApiLink}/search/`;  // Constructing the API URL for searching movies on TMDB, including the API key and a placeholder for the search query.

const movieSection = document.querySelector("#movie-section");
const searchForm = document.querySelector("#search-form");
const searchQuery = document.querySelector("#search-query");

const bodyElement = document.querySelector("body");
const loadingDiv = document.querySelector("#loadingDiv");


// --------------------------------------------------------------------------------------------------------------------
// Loading screen
function showLoadingScreen() {
    loadingDiv.hidden = false;
}

function hideLoadingScreen() {
    loadingDiv.hidden = true;
    loadingDiv.innerHTML = "";
    bodyElement.style.backgroundColor = "#7C7C7C";
}

showLoadingScreen();
// --------------------------------------------------------------------------------------------------------------------
// Functions
function fetchMovies(url) {
    showLoadingScreen();

    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            data.results.forEach(element => {
                hideLoadingScreen();

                const divCol = document.createElement("div");
                divCol.classList.add("col", "d-flex", "justify-content-center");

                let imgPath = "";
                if (element.poster_path) {
                    imgPath = imgBasePath + element.poster_path; // Using the poster image if available
                } else if (element.backdrop_path) {
                    imgPath = imgBasePath + element.backdrop_path;   // Using the backdrop image if the poster is not available
                } else {
                    imgPath = "./img/default_movie.jpg";  // Default image if no poster or backdrop is available
                }

                divCol.innerHTML = `    
                        <div class="card text-center bg-1" style="width: 20rem;">
                            <img src="${imgPath}" class="card-img-top" alt="${element.title}">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.release_date.split("-")[0]}</p>
                                <a href="movie.html?id=${element.id}" class="card-link link-offset-2 link-underline link-underline-opacity-50">More Info & Reviews</a>
                            </div>
                        </div>`;

                movieSection.appendChild(divCol);
            });

            movieSection.classList.add("animate__animated", "animate__fadeIn");
        });
}


// --------------------------------------------------------------------------------------------------------------------
// Event listener for the search form
searchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    movieSection.innerHTML = "";

    const searchText = searchQuery.value;

    if (searchText) {
        fetchMovies(searchApi + searchText);
    } else {
        fetchMovies(discoverApi);
    }
});


// --------------------------------------------------------------------------------------------------------------------
// Initial fetch of popular movies
fetchMovies(discoverApi);

// // simulate a delay before calling 'fetchMovies(discoverApi)' to show the loading screen
// setTimeout(() => {
//     fetchMovies(discoverApi);
// }, 2 * 1000);


// --------------------------------------------------------------------------------------------------------------------
// Rating

const myRatingCustomFeedback = document.getElementById('myRatingCustomFeedback')
const myRatingCustomFeedbackStart = document.getElementById('myRatingCustomFeedbackStart')
const myRatingCustomFeedbackEnd = document.getElementById('myRatingCustomFeedbackEnd')

let currentValue = 3
const labels = {
    1: 'Very bad',
    2: 'Bad',
    3: 'Meh',
    4: 'Good',
    5: 'Very good'
}
const optionsCustomFeedback = {
    value: currentValue
}

new coreui.Rating(myRatingCustomFeedback, optionsCustomFeedback)

myRatingCustomFeedback.addEventListener('change.coreui.rating', event => {
    currentValue = event.value
    myRatingCustomFeedbackStart.innerHTML = `${event.value} / 5`
    myRatingCustomFeedbackEnd.innerHTML = labels[event.value]
})

myRatingCustomFeedback.addEventListener('hover.coreui.rating', event => {
    myRatingCustomFeedbackEnd.innerHTML = event.value ? labels[event.value] : labels[currentValue]
})