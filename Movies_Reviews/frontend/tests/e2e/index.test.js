// A simple smoke test to check if the index homepage loads successfully and contains the expected elements.

import { test, expect } from "@playwright/test";    // Importing the test and expect functions from the Playwright testing library. 
// The 'test' function is used to define test cases, while the 'expect' function is used for assertions within those tests.

test.describe("Index Page Load", () => {

    // Defining a test case named "Navigation loads successfully". 
    test("Navigation loads successfully", async ({ page }) => {
        // The test function takes an asynchronous callback that receives a 'page' object, which represents a browser page.

        // Navigating to the homepage (base URL) using the 'goto' method of the 'page' object.
        await page.goto("/");

        // Checking that the navigation bar is visible on the page
        await expect(page.locator("nav")).toBeVisible();

        // Checking that the search input box is visible on the page
        await expect(page.locator("#search-query")).toBeVisible();
    });

    // Defining a test case named "Movie cards are displayed on the homepage".
    test("Movie cards are displayed on the homepage", async ({ page }) => {
        // Navigating to the homepage
        await page.goto("/");

        // Wait for the loading screen to disappear before checking for movie cards
        await page.locator("#loadingDiv").waitFor( { state: "hidden" , timeout: 60000} );

        // Checking that at least one movie card is visible on the page.
        await expect(page.locator(".card").first()).toBeVisible();
    });

});
