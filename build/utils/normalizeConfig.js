'use strict';

var identity = function identity(v) {
  return v;
};
var negate = function negate(v) {
  return !v;
};
var asArray = function asArray(v) {
  return typeof v === 'string' ? [v] : v;
};
var asInt = function asInt(v) {
  return typeof v === 'number' ? v : parseInt(v, 10);
};

var BASE_CONFIG = {
  cache: {
    default: false
  },
  cacheLocation: {
    default: '.eslintcache'
  },
  config: {
    name: 'configFile',
    default: null
  },
  env: {
    name: 'envs',
    default: [],
    transform: asArray
  },
  ext: {
    name: 'extensions',
    default: ['.js'],
    transform: asArray
  },
  fix: {
    default: false
  },
  fixDryRun: {
    default: false
  },
  format: {
    default: null
  },
  global: {
    name: 'globals',
    default: [],
    transform: asArray
  },
  ignorePath: {
    default: null
  },
  ignorePattern: {
    default: [],
    transform: asArray
  },
  maxWarnings: {
    default: -1,
    transform: asInt
  },
  noEslintrc: {
    name: 'useEslintrc',
    default: false,
    transform: negate
  },
  noIgnore: {
    name: 'ignore',
    default: false,
    transform: negate
  },
  noInlineConfig: {
    name: 'allowInlineConfig',
    default: false,
    transform: negate
  },
  parser: {
    default: null
  },
  parserOptions: {
    default: null
  },
  plugin: {
    name: 'plugins',
    default: [],
    transform: asArray
  },
  quiet: {
    default: false
  },
  reportUnusedDisableDirectives: {
    default: false
  },
  rules: {
    default: null
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray
  }
};

/* eslint-disable no-param-reassign */
var normalizeCliOptions = function normalizeCliOptions(rawConfig) {
  return Object.keys(BASE_CONFIG).reduce(function (config, key) {
    var _BASE_CONFIG$key = BASE_CONFIG[key],
        _BASE_CONFIG$key$name = _BASE_CONFIG$key.name,
        name = _BASE_CONFIG$key$name === undefined ? key : _BASE_CONFIG$key$name,
        _BASE_CONFIG$key$tran = _BASE_CONFIG$key.transform,
        transform = _BASE_CONFIG$key$tran === undefined ? identity : _BASE_CONFIG$key$tran,
        defaultValue = _BASE_CONFIG$key.default;


    var value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

    return Object.assign({}, config, {
      [name]: transform(value)
    });
  }, {});
};
/* eslint-enable no-param-reassign */

var normalizeConfig = function normalizeConfig(config) {
  return Object.assign({}, config, {
    cliOptions: normalizeCliOptions(config.cliOptions || {})
  });
};

module.exports = normalizeConfig;