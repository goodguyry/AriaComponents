module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: [
    '<rootDir>/.jest/setupFile.js',
  ],
  moduleNameMapper: {
    '^@/(\.jest)/(.*)$': '<rootDir>/$1/$2',
  },
  clearMocks: true,
};
