const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const R = require('ramda')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction
const createEnvAwareArray = R.reject(R.isNil)

const ifProduction = (x) => isProduction ? x : null
const ifDevelopment = (x) => isDevelopment ? x : null

module.exports = {
  name: 'client-side code',
  entry: createEnvAwareArray([
    ifDevelopment('webpack-hot-middleware/client'),
    path.join(__dirname, '..', 'src', 'client')
  ]),
  output: {
    path: path.join(__dirname, '..', 'public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  plugins: createEnvAwareArray([
    new webpack.optimize.OccurrenceOrderPlugin(),
    ifDevelopment(new webpack.HotModuleReplacementPlugin()),
    ifProduction(new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'})),
    ifProduction(new webpack.optimize.UglifyJsPlugin()),
    ifProduction(new ExtractTextPlugin('styles.css'))
  ]),
  resolve: {
    modules: [
      __dirname,
      'node_modules'
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: [
          'es2015-webpack',
          'stage-2',
          'react'
        ],
        plugins: [
          'transform-inline-environment-variables'
        ]
      }
    }, {
      test: /\.css$/,
      loaders: isProduction ? ExtractTextPlugin.extract('style', ['css']) : ['style', 'css']
    }, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&minetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&minetype=image/svg+xml'
    }]
  }
}
