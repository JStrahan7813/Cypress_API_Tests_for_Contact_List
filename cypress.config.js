const fs = require('fs');

module.exports = {
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // Task to save test credentials to a file
      on('task', {
        saveCredentials(credentials) {
          fs.writeFileSync('cypress/test-credentials.txt', credentials);
          return null;
        }
      });
    },
  },
};
