const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@apis': path.resolve(__dirname, 'src/api'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
};
