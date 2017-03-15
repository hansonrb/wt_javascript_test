var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: ['babel-polyfill', 'whatwg-fetch', './app/Root'],
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'stage-0'],
            plugins: ['babel-root-import']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: ['file-loader?name=[path][name].[ext]']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],
  resolve: {
    extensions: ['.js', '.json', '.css'],
    modules: [path.join(__dirname, './app'), "node_modules"]
  }
}
