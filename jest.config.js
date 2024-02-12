module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: [
    '<rootDir>/.jest/setupFile.js',
  ],
  moduleNameMapper: {
    '^@/(.jest)/(.*)$': '<rootDir>/$1/$2',
  },
};
