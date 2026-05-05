// A simple smoke test to check if the movie page loads successfully and contains the expected elements.

import { test, expect } from "@playwright/test";    // Importing the test and expect functions from the Playwright testing library. 
// The 'test' function is used to define test cases, while the 'expect' function is used for assertions within those tests.

const testMovieId = "1290821";   // Example movie ID for testing the movie details page
const testMovieTitle = "Shelter";   // Example movie title for assertions in the movie details page test
const testMovieUrl = `/movie.html?id=${testMovieId}`;   // Constructing the URL for the movie details page using the example movie ID

test.describe("Movie Page Load", () => {

    // Defining a test case named "Navigation loads successfully". 
    test("Navigation loads successfully", async ({ page }) => {
        // The test function takes an asynchronous callback that receives a 'page' object, which represents a browser page.

        // Navigating to the a movie page using the 'goto' method of the 'page' object.
        await page.goto(testMovieUrl);

        // Checking if the page title contains the movie title (case-insensitive)
        await expect(page).toHaveTitle(new RegExp(testMovieTitle, "i"));
        
        // Checking that the navigation bar is visible on the page
        await expect(page.locator("nav")).toBeVisible();

        // Checking that the search box is not the page (since it's a movie details page)
        await expect(page.locator("#search-query")).toBeHidden();
    });

    // Defining a test case named "Movie information is displayed".
    test("Movie information is displayed", async ({ page }) => {
        // Navigating to the a movie page
        await page.goto(testMovieUrl);

        // Wait for the movie poster to be visible before checking the movie information
        const moviePoster = page.locator("#moviePoster");   // Movie Poster locator
        await moviePoster.waitFor({ state: "visible", timeout: 10000 });

        // Checking that the movies poster is visible
        const moviePosterSrc = await moviePoster.getAttribute("src");

        await expect(moviePosterSrc).not.toBeNull();     // src should not be null
        await expect(moviePosterSrc).not.toBe("");       // src should not be an empty string

        // Checking the movie title
        const movieTitle = page.locator("#movieTitle");  // Movie Title locator
        await expect(movieTitle).toBeVisible();
        await expect(movieTitle).toHaveText(new RegExp(testMovieTitle, "i"));   // The movie title should contain the expected movie title (case-insensitive)

        // Checking the movie overview
        const movieOverview = page.locator("#movieOverview");   // Movie Overview locator
        const movieOverviewText = await movieOverview.textContent();
        await expect((movieOverviewText?.trim().length)).toBeGreaterThan(0);  // The movie overview should not be empty

        await expect(movieOverview).toBeVisible();
        await expect(movieOverview).not.toHaveText(/Movie overview/i);  // The movie overview should not be the default text "Movie overview"

        // Checking the movie release year
        const movieReleaseYear = page.locator("#movieReleaseYear");  // Movie Release Year locator
        await expect(movieReleaseYear).toBeVisible();
        await expect(movieReleaseYear).not.toHaveText(/Release Year/i);  // The movie release year should not be the default text "Release Year"

        // Checking the average rating
        const averageRating = page.locator("#averageRating");   // Average Rating locator
        const averageRatingText = await averageRating.textContent();
        await expect(averageRating).toBeVisible();  // The average rating should be visible
        await expect(averageRating).not.toHaveText(/^Rating$/i);  // The average rating should not be the default text "Rating" (case-insensitive)
            // The regex /^Rating$/i ensures that the text is exactly "Rating" (case-insensitive) and not something like "Average Rating: 8 / 10".

        // Checking the reviews section based on the average rating text
        const reviewsSection = page.locator("#reviews-section");    // Reviews Section locator

        // Checking the average rating format and the presence of review cards based on the average rating text
        if (averageRatingText && averageRatingText.includes("/")) {     // if averageRating text contains a '/'
            // Where there is a review, the average rating should be in the format "Average Rating: 10 / 10"
            
            const rating = averageRatingText.split(":")[1].split("/")[0].trim();    // Extracting the rating value from the text
            expect(parseFloat(rating)).toBeGreaterThanOrEqual(0);   // Rating should be >= to 0
            expect(parseFloat(rating)).toBeLessThanOrEqual(10);  // Rating should be <= to 10

            // At least one review card should be visible if the average rating is in the expected format
            await expect(reviewsSection.locator(".card").first()).toBeVisible();
        } else {
            // When there is no review, the average rating should be like: "Average Rating: No ratings yet"
            await expect(averageRating).toHaveText(/Average Rating:/i);
            
            // No review cards should be visible if the average rating is not in the expected format
            await expect(reviewsSection.locator(".card").first()).toBeHidden();
        }

    });

});



