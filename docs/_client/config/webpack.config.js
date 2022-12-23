const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Modules
const rules = require('./modules/rules');
const getPlugins = require('./modules/getPlugins');
const paths = require('./paths');

const common = {
  path: paths.build,
  publicPath: '/build/',
};

module.exports = (env, argv) => {
  const { mode } = argv;
  const productionMode = ('production' === mode);

  return {
    mode,

    entry: {
      global: '_client/entries',
    },

    output: productionMode
      ? {
        ...common,
        filename: 'js/[name].[contenthash].bundle.min.js',
        chunkFilename: 'js/[name].[contenthash].chunk.min.js',
      }
      : {
        ...common,
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].chunk.js',
      },

    devtool: productionMode
      ? 'cheap-source-map'
      : 'cheap-module-eval-source-map',

    optimization: productionMode
      ? {
        minimize: true,
        minimizer: [
          new OptimizeCSSAssetsPlugin(),
          new TerserPlugin(),
        ],
      }
      : {},

    module: {
      rules,
    },

    stats: {
      colors: true,
    },

    resolve: {
      modules: [
        paths.docs,
        'node_modules',
      ],
      extensions: ['.js', '.json', '.scss'],
      alias: {
        entries: paths.entries,
        components: paths.components,
        scss: paths.scss,
        js: paths.js,
        plugin: paths.plugin,
      },
    },

    plugins: getPlugins(productionMode),
  };
};
