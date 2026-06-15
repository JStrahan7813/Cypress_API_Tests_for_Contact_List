const fs = require('fs');
// 1. Import the Allure plugin reporter
const { allureCypress } = require("@allure-javascript/cypress/reporter");

module.exports = {
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // 2. Initialize the Allure plugin and specify the output directory
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });

      // 3. Your existing credential saving task remains untouched
      on('task', {
        saveCredentials(credentials) {
          fs.writeFileSync('cypress/test-credentials.txt', credentials);
          return null;
        }
      });

      // 4. Crucial: You must return the config object so Allure settings are registered by Cypress
      return config;
    },
  },
};
