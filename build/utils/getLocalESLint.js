'use strict';

var path = require('path');
var findUp = require('find-up');

var getLocalESLint = function getLocalESLint(config) {
  var nodeModulesPath = findUp.sync('node_modules', { cwd: config.rootDir });
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(path.resolve(nodeModulesPath, 'eslint'));
};

module.exports = getLocalESLint;