'use strict';

var normalizeConfig = require('./normalizeConfig');
var cosmiconfig = require('cosmiconfig');

var explorer = cosmiconfig('jest-runner-eslint', { sync: true });

var getESLintOptions = function getESLintOptions(config) {
  var result = explorer.load(config.rootDir);

  if (result) {
    return normalizeConfig(result.config);
  }

  return normalizeConfig({});
};

module.exports = getESLintOptions;