// --------------------------------------------------------------------------------------------------------------------
// Declarations
const tmdbApiLink = `https://movie-review-api-o8bs.onrender.com/api/v1/tmdb`;  // Base URL for the backend API

const discoverApi = `${tmdbApiLink}/discover`;  // API URL for fetching popular movies from TMDB
const imgBasePath = 'https://image.tmdb.org/t/p/w1280'; // API URL for fetching movie images from TMDB
const searchApi = `${tmdbApiLink}/search/`;  // API URL for searching movies on TMDB

const movieSection = document.querySelector("#movie-section");
const searchForm = document.querySelector("#search-form");
const searchQuery = document.querySelector("#search-query");

const bodyElement = document.querySelector("body");
const loadingDiv = document.querySelector("#loadingDiv");


// --------------------------------------------------------------------------------------------------------------------
// Loading screen functions

function showLoadingScreen() {
    // Show the loading screen
    loadingDiv.hidden = false;
}

function hideLoadingScreen() {
    // Hide the loading screen
    loadingDiv.hidden = true;
    loadingDiv.innerHTML = "";
    bodyElement.style.backgroundColor = "#7C7C7C";
}

showLoadingScreen();
// --------------------------------------------------------------------------------------------------------------------
// Functions
function fetchMovies(url) {
    // Show the loading screen before starting the fetch operation to indicate that data is being loaded.
    showLoadingScreen();

    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            data.results.forEach(element => {
                // Hide the loading screen after the movies have been fetched to display the movie cards.
                hideLoadingScreen();

                // Div element for each movie card
                const divCol = document.createElement("div");
                divCol.classList.add("col", "d-flex", "justify-content-center");

                // Handling movie images
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

                // Appending the movie card div to the movie section
                movieSection.appendChild(divCol);
            });

            // Adding animation to the movie section after the movies have been loaded
            movieSection.classList.add("animate__animated", "animate__fadeIn");
        });
}


// Initial fetch of popular movies
fetchMovies(discoverApi);

// --------------------------------------------------------------------------------------------------------------------
// Event listener for the search form
searchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();   // Preventing the default form submission behavior

    movieSection.innerHTML = "";    // Clearing the movie section to display the search results
    
    const searchText = searchQuery.value;
    if (searchText) {
        // Search using user's input
        fetchMovies(searchApi + searchText);
    } else {
        // No user input, fetch popular movies
        fetchMovies(discoverApi);
    }
});


// --------------------------------------------------------------------------------------------------------------------
