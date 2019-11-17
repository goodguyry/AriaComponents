/* eslint-disable import/no-extraneous-dependencies */

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const StatsPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

// Helpers
const path = require('path');
const paths = require('../paths');
const yamlDictFromObject = require('../bin/yamlDictFromObject');

module.exports = (productionMode) => {
  const minExtractOptions = productionMode
    ? {
      filename: 'css/[name].[contenthash].min.css',
      chunkFilename: 'css/[name].[contenthash].chunk.min.css',
    }
    : {
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
    };

  const common = [
    new MiniCssExtractPlugin(minExtractOptions),
    new StylelintPlugin({
      configFile: path.join(paths.config, 'stylelint.config.js'),
    }),
    new StatsPlugin({
      transform(stats) {
        const entries = stats.assetsByChunkName;

        const assetMap = Object.keys(entries).reduce((acc, key) => {
          const assetList = entries[key]
            .filter((asset) => '.map' !== path.parse(asset).ext)
            .reduce((lines, line) => {
              const { ext } = path.parse(line);
              // eslint-disable-next-line max-len
              return Object.assign({}, lines, { [ext.replace('.', '')]: `build/${line}` });
            }, {});

          return { ...acc, [key]: assetList };
        }, {});

        return yamlDictFromObject(assetMap);
      },
      fields: ['assetsByChunkName', 'hash'],
      filename: '../_data/assets.yaml',
    }),
  ];

  if (productionMode) {
    return [
      new CleanWebpackPlugin(
        [`${paths.build}/*`],
        { root: paths.docs }
      ),
      new MinifyPlugin({}, {}),
    ].concat(common);
  }

  return [
    new LiveReloadPlugin({
      appendScriptTag: true,
      delay: 1000,
    }),
  ].concat(common);
};
