const { defineConfig } = require("cypress");

const defaultTimeout = parseInt(process.env.CYPRESS_TIMEOUT || "20000", 10); // Default timeout value

module.exports = defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000/",
    defaultCommandTimeout: defaultTimeout, // Timeout for commands like cy.get()
    pageLoadTimeout: defaultTimeout, // Timeout for the page to load
    requestTimeout: defaultTimeout, // Timeout for requests like cy.intercept()
    testIsolation: false, // Disable test isolation
    video: true
  }
});
