"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const chalk = require('chalk');

const configOverrides = require('../utils/configOverrides');

class ESLintWatchFixPlugin {
  constructor({
    stdout,
    config
  }) {
    this._stdout = stdout;
    this._key = config.key || 'F';
  } // eslint-disable-next-line class-methods-use-this


  run() {
    return _asyncToGenerator(function* () {
      const fix = configOverrides.getFix();
      configOverrides.setFix(!fix);
      return true;
    })();
  }

  getUsageInfo() {
    const getPrompt = () => {
      const fix = configOverrides.getFix();

      if (fix === undefined) {
        return 'override ESLint --fix';
      }

      if (!fix) {
        return `toggle ESLint --fix ${chalk.italic('(disabled)')}`;
      }

      return `toggle ESLint --fix ${chalk.italic('(enabled)')}`;
    };

    return {
      key: this._key,
      prompt: getPrompt()
    };
  }

}

module.exports = ESLintWatchFixPlugin;