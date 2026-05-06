import { defineConfig } from "@playwright/test";    
// Importing the defineConfig function from the Playwright testing library. This function is used to create a configuration object for Playwright tests.

// Configurations
export default defineConfig({
    testDir: "./tests/e2e",     // Specifying the directory where the test files are located.
    timeout: 30000,     // Setting a timeout of 30 seconds for each test. If a test takes longer than this time, it will be marked as failed.
    retries: 2,     // Allowing each test to be retried once if it fails. This can help to reduce false negatives due to transient issues.
    use: {      // Defining the default settings for all tests.
        baseURL: "https://movies-and-reviews.onrender.com/",    // Setting the base URL for all tests. Allows use of relative URLs in test cases.
        headless: true,     // Headless mode - the browser will not be visible during test execution.
        screenshot: "only-on-failure",      // Configuring screenshots to be taken only when a test fails. Helps with debugging.
    },
    reporter: "list",   // Provides a simple list of test results in the console output.
    outputDir: "./tests/test-results/",     // Specifying the directory where test results (like screenshots, videos, etc.) will be stored.
});
