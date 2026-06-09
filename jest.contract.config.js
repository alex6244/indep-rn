/** @type {import('jest').Config} */
const base = require("./jest.config.js");

module.exports = {
  ...base,
  testMatch: ["**/__tests__/**/*.staging.contract.test.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
};
