module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    './src/orders/orderService.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};




