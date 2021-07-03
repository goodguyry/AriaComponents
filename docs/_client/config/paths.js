const path = require('path');

module.exports = {
  docs: path.join(__dirname, '../../'),
  build: path.join(__dirname, '../../build'),
  site: path.join(__dirname, '../../_site'),
  components: path.join(__dirname, '../src/components'),
  scss: path.join(__dirname, '../src/scss'),
  js: path.join(__dirname, '../src/js'),
  entries: path.join(__dirname, '../entries'),
  jekyllSass: path.join(__dirname, '../../_scss'),
  siteData: path.join(__dirname, '../../_data'),
  config: __dirname,
  plugin: path.join(__dirname, '../../../'),
};
