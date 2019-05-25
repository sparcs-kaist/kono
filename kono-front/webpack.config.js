const path = require('path')
const webpack = require('webpack');
module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/index'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env', {
              targets: { node: 'current' },
              modules: 'false'
            }
          ],
          '@babel/preset-react',
        ],
      },
      exclude: ['/node_modules']
    }],
  },
  plugins: [],
  optimization: {},
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
};
