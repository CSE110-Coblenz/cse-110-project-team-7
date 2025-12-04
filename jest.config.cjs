/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!(konva)/)"
  ],
};
