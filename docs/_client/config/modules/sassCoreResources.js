const path = require('path');
const paths = require('../paths');

const sassCoreResources = [
  './_utilities.scss',
  './_breakpoints.scss',
  './_layout.scss',
  './_theme.scss',
  './_a11y.scss',
].map((file) => path.resolve(`${paths.scss}/core`, file));

module.exports = sassCoreResources;
