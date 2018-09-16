const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    'bureau': './src/index.ts',
    'bureau.min': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '../_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Bureau',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      include: /\.min\.js$/
    })]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
      query: {
        declaration: false
      }
    }]
  }
}