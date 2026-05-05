// A simple smoke test to check if the homepage loads successfully and contains the expected elements. 

import { test, expect } from "@playwright/test";    // Importing the test and expect functions from the Playwright testing library. 
// The 'test' function is used to define test cases, while the 'expect' function is used for assertions within those tests.

test.describe("Page Load", () => {

    // Defining a test case named "Homepage loads successfully". 
    test("Homepage loads successfully", async ({ page }) => {
        // The test function takes an asynchronous callback that receives a 'page' object, which represents a browser page.

        // Navigating to the homepage (base URL) using the 'goto' method of the 'page' object.
        await page.goto("/");

        // Checking if the page title contains the word "Movies" (case-insensitive)
        await expect(page).toHaveTitle(/Movies/i);
        
        // Checking if the page title contains the word "Reviews" (case-insensitive)
        await expect(page).toHaveTitle(/Reviews/i);
    });

});
