// --------------------------------------------------------------------------------------------------------------------
// Declarations
const tmdbApiLink = `https://movie-review-api-o8bs.onrender.com/api/v1/tmdb`;  // Base URL for the backend API (deployed)
// const tmdbApiLink = `http://localhost:8000/api/v1/tmdb`;  // Base URL for the backend API (local)

const discoverApi = `${tmdbApiLink}/discover`;  // Constructing the API URL for fetching popular movies from TMDB, including the API key and sorting by popularity.
const imgPath = 'https://image.tmdb.org/t/p/w1280';
const searchApi = `${tmdbApiLink}/search/`;  // Constructing the API URL for searching movies on TMDB, including the API key and a placeholder for the search query.

const movieSection = document.querySelector("#movie-section");
const searchForm = document.querySelector("#search-form");
const searchQuery = document.querySelector("#search-query");


// --------------------------------------------------------------------------------------------------------------------
// Functions
function fetchMovies(url) {
    fetch(url)
        .then(response => response.json())
        .then(function (data) {
            data.results.forEach(element => {
                const divCol = document.createElement("div");
                divCol.classList.add("col");

                divCol.innerHTML = `    
                        <div class="card text-center bg-1" style="width: 18rem;">
                            <img src="${imgPath + element.poster_path}" class="card-img-top" alt="${element.title}">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.release_date.split("-")[0]}</p>
                                <a href="movie.html?id=${element.id}" class="card-link link-offset-2 link-underline link-underline-opacity-50">More Info & Reviews</a>
                            </div>
                        </div>`;

                movieSection.appendChild(divCol);
            });
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
    }
});


// --------------------------------------------------------------------------------------------------------------------
// Initial fetch of popular movies
fetchMovies(discoverApi);


// --------------------------------------------------------------------------------------------------------------------
