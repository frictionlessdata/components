const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractCssPlugin = require('mini-css-extract-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/index.ts', './src/styles/base.css'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'frictionless-components.js',
    library: 'frictionlessComponents',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          onlyCompileBundledFiles: true,
          compilerOptions: {
            declaration: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: [ExtractCssPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: './',
        },
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV, DEBUG })],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  webpackConfig.devServer = { hot: true }
  webpackConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssPlugin({ filename: 'frictionless-components.css' }),
    ...webpackConfig.plugins,
  ]
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
  webpackConfig.plugins = [
    new ExtractCssPlugin({ filename: 'frictionless-components.css' }),
    ...webpackConfig.plugins,
  ]
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
  webpackConfig.output.filename = 'frictionless-components.min.js'
  webpackConfig.devtool = 'source-map'
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new ExtractCssPlugin({ filename: 'frictionless-components.min.css' }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ]
}

// Module API

module.exports = webpackConfig
