import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '2duufs',
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
