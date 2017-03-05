const path = require('path')
const R = require('ramda')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const isProduction = process.env.NODE_ENV === 'production'
const createEnvAwareArray = R.reject(R.isNil)

const ifProduction = (x) => isProduction ? x : null

module.exports = {
  name: 'server-side code',
  entry: [
    path.join(__dirname, '..', 'src', 'server')
  ],
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'index.js'
  },
  devtool: 'source-map',
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['bootstrap', 'bootstrap/dist/css/bootstrap.css']
    })
  ],
  plugins: createEnvAwareArray([
    new webpack.BannerPlugin({
      banner: 'require(\'source-map-support\').install();',
      raw: true,
      entryOnly: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    ifProduction(new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }))
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
          'transform-dirname-filename'
        ]
      }
    }, {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.css$/,
      loaders: 'null-loader'
    }]
  }
}
