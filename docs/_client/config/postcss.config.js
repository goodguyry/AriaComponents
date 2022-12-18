/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const readYaml = require('read-yaml');
const autoprefixer = require('autoprefixer');
const modules = require('postcss-modules');
const postcssTidyColumns = require('postcss-tidy-columns');
const paths = require('./paths');
const yamlDictFromObject = require('./bin/yamlDictFromObject');

// Config
module.exports = () => ({
  plugins: [
    postcssTidyColumns({
      columns: 'var(--site-columns)',
      gap: 'var(--site-gap)',
      edge: 'var(--site-edge)',
      max: 'var(--site-siteMax)',
    }),
    autoprefixer(),
    modules({
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      globalModulePaths: [
        /_client\/src\/scss/,
      ],
      getJSON: (cssFileName, json) => {
        const { name } = path.parse(cssFileName);
        let modulesMap;

        if (0 < Object.keys(json).length) {
          try {
            modulesMap = readYaml.sync(
              path.join(paths.siteData, 'classnames.yaml')
            );
          } catch (error) {
            modulesMap = {};
          }

          modulesMap[name] = json;
          fs.writeFileSync(
            path.join(paths.siteData, 'classnames.yaml'),
            yamlDictFromObject(modulesMap)
          );
        }
      },
    }),
  ],
});
