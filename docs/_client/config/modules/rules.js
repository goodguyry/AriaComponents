/* eslint-disable import/no-extraneous-dependencies */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const paths = require('../paths');

const include = [
  paths.components,
  paths.js,
  paths.entries,
];

const exclude = [
  /node_modules/,
  /\.min\.js$/,
];

module.exports = [
  {
    test: /\.js$/,
    exclude,
    include,
    use: {
      loader: 'babel-loader',
      options: {
        rootMode: 'upward',
      },
    },
  },
  {
    test: [
      /\.png$/,
      /\.jpg$/,
      /\.svg$/,
      /\.woff2?$/,
      /\.ttf$/,
    ],
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[ext]',
      },
    },
  },
  {
    test: /\.s?css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'resolve-url-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          postcssOptions: {
            config: path.join(paths.config, 'postcss.config.js'),
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            includePaths: [
              paths.jekyllSass,
            ],
          },
        },
      },
    ],
  },
];
