const path = require('path');

module.exports = {
  entry: path.join(__dirname, './index.js'),
  mode: 'development',
  devtool: false,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
  },
};
