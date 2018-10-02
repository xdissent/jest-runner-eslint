"use strict";

const identity = v => v;

const negate = v => !v;

const asArray = v => typeof v === 'string' ? [v] : v;

const asInt = v => {
  if (typeof v === 'number') {
    return v;
  }

  const int = parseInt(v, 10);

  if (Number.isNaN(int)) {
    throw new Error(`'${v}' cannot be converted to a number`);
  }

  return int;
};

const BASE_CONFIG = {
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

const normalizeCliOptions = rawConfig => Object.keys(BASE_CONFIG).reduce((config, key) => {
  const _BASE_CONFIG$key = BASE_CONFIG[key],
        _BASE_CONFIG$key$name = _BASE_CONFIG$key.name,
        name = _BASE_CONFIG$key$name === void 0 ? key : _BASE_CONFIG$key$name,
        _BASE_CONFIG$key$tran = _BASE_CONFIG$key.transform,
        transform = _BASE_CONFIG$key$tran === void 0 ? identity : _BASE_CONFIG$key$tran,
        defaultValue = _BASE_CONFIG$key.default;
  const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;
  return Object.assign({}, config, {
    [name]: transform(value)
  });
}, {});
/* eslint-enable no-param-reassign */


const normalizeConfig = config => {
  return Object.assign({}, config, {
    cliOptions: normalizeCliOptions(config.cliOptions || {})
  });
};

module.exports = normalizeConfig;