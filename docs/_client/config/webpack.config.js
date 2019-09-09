const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
      ? Object.assign({}, common, {
        filename: 'js/[name].[contenthash].bundle.min.js',
        chunkFilename: 'js/[name].[contenthash].chunk.min.js',
      })
      : Object.assign({}, common, {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].chunk.js',
      }),

    devtool: productionMode
      ? 'cheap-source-map'
      : 'cheap-module-eval-source-map',

    optimization: productionMode
      ? {
        minimizer: [
          new OptimizeCSSAssetsPlugin({}),
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
        root: paths.root,
      },
    },

    plugins: getPlugins(productionMode),
  };
};
