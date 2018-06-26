const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'main.js'),
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: path.resolve(__dirname, '..', 'index.js')
    }]
  }
};
