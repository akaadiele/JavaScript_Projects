import js from "@eslint/js";    // Import the recommended ESLint configuration for JavaScript

export default [
    js.configs.recommended,     // Start with the recommended ESLint rules for JavaScript
    {
        languageOptions: {      // Specify the JavaScript language options
            ecmaVersion: 2022,      // Use ECMAScript 2022 features
            sourceType: "module",       // Enable support for ES modules
            globals: {
                // Browser globals — so ESLint knows these are valid
                // These are common browser APIs that we want to allow without ESLint flagging them as undefined
                window: "readonly",
                document: "readonly",
                URL: "readonly",
                console: "readonly",
                fetch: "readonly",
                alert: "readonly",
                URLSearchParams: "readonly",
            },
        },
        rules: {    // Define custom rules for our project
            // Errors — these will fail the pipeline
            "no-unused-vars": "error",      // Disallow variables that are declared but not used anywhere in the code
            "no-undef": "error",            // Disallow the use of undeclared variables unless mentioned in /*global */ comments
            "no-unreachable": "error",      // Disallow unreachable code after return, throw, continue, and break statements
            "no-debugger": "error",         // Disallow the use of debugger statements in production code

            // Warnings — these surface issues without failing the pipeline
            "no-console": "warn",       // Warn about the use of console statements, which are often left in by mistake
            "eqeqeq": "warn",           // Warn about the use of == and != in favor of === and !== for better type safety
            "prefer-const": "warn",     // Warn about variables that are never reassigned after being declared, suggesting the use of const instead of let
            "no-var": "warn",           // Warn about the use of var, encouraging the use of let and const instead for better scoping and readability
        }
    },
    {
        // Tell ESLint to ignore these locations
        ignores: [  // Ignore all files in the below directories, which are dependencies and should not be linted
            "node_modules/**",
            "backend/node_modules/**",
            "frontend/node_modules/**",
        ]
    }
];