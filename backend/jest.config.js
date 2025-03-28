module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/setup/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
