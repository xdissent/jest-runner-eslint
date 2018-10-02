"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const _require = require('create-jest-runner'),
      pass = _require.pass,
      fail = _require.fail,
      skip = _require.skip;

const getLocalESLint = require('../utils/getLocalESLint');

const getESLintOptions = require('../utils/getESLintOptions');

const getComputedFixValue = ({
  fix,
  quiet,
  fixDryRun
}) => {
  if (fix || fixDryRun) {
    return quiet ? ({
      severity
    }) => severity === 2 : true;
  }

  return undefined;
};

const runESLint = ({
  testPath,
  config,
  extraOptions
}) => {
  const start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  const _getLocalESLint = getLocalESLint(config),
        CLIEngine = _getLocalESLint.CLIEngine;

  const _getESLintOptions = getESLintOptions(config),
        baseCliOptions = _getESLintOptions.cliOptions;

  const cliOptions = _objectSpread({}, baseCliOptions, {
    fix: getComputedFixValue(baseCliOptions)
  }, extraOptions);

  const cli = new CLIEngine(cliOptions);

  if (cli.isPathIgnored(testPath)) {
    const end = Date.now();
    return skip({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint'
      }
    });
  }

  const report = cli.executeOnFiles([testPath]);

  if (cliOptions.fix && !cliOptions.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  const end = Date.now();
  const message = cli.getFormatter(cliOptions.format)(cliOptions.quiet ? CLIEngine.getErrorResults(report.results) : report.results);

  if (report.errorCount > 0) {
    return fail({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: message
      }
    });
  }

  const tooManyWarnings = cliOptions.maxWarnings >= 0 && report.warningCount > cliOptions.maxWarnings;

  if (tooManyWarnings) {
    return fail({
      start,
      end,
      test: {
        path: testPath,
        title: 'ESLint',
        errorMessage: `${message}\nESLint found too many warnings (maximum: ${cliOptions.maxWarnings}).`
      }
    });
  }

  const result = pass({
    start,
    end,
    test: {
      path: testPath,
      title: 'ESLint'
    }
  });

  if (!cliOptions.quiet && report.warningCount > 0) {
    result.console = [{
      message,
      origin: '',
      type: 'warn'
    }];
  }

  return result;
};

module.exports = runESLint;