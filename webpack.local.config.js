var config = require('./webpack.config.js')
var path = require('path')
var webpack = require('webpack')

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development')
    }
  })
)

config.devtool = 'cheap-module-eval-source-map'
config.devServer = {
  contentBase: path.join(__dirname, './dist'),
  historyApiFallback: true,
  port: 8082,
  inline: true
}

module.exports = config
