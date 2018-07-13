const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'main.js'),
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.html$/,
      use: path.resolve(__dirname, '..', 'index.js')
    }]
  }
};
