const { defineConfig } = require("cypress");
const fs = require('fs');
// Update this line to use the correct package name
const { allureCypress } = require("allure-cypress/reporter"); 

module.exports = defineConfig({
  allowCypressEnv: true,

  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });

      on('task', {
        saveCredentials(credentials) {
          fs.writeFileSync('cypress/test-credentials.txt', credentials);
          return null;
        }
      });

      return config;
    },
  },
});
