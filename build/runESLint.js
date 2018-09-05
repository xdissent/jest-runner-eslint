'use strict';

var _require = require('create-jest-runner'),
    pass = _require.pass,
    fail = _require.fail,
    skip = _require.skip;

var getLocalESLint = require('./utils/getLocalESLint');
var getESLintOptions = require('./utils/getESLintOptions');

var runESLint = function runESLint(_ref) {
  var testPath = _ref.testPath,
      config = _ref.config;

  var start = Date.now();

  if (config.setupTestFrameworkScriptFile) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(config.setupTestFrameworkScriptFile);
  }

  var _getLocalESLint = getLocalESLint(config),
      CLIEngine = _getLocalESLint.CLIEngine;

  var options = getESLintOptions(config);
  var quiet = options.cliOptions && options.cliOptions.quiet;
  var cli = new CLIEngine(Object.assign({}, options.cliOptions, {
    fix: options.cliOptions && (options.cliOptions.fix || options.cliOptions.fixDryRun) && (quiet ? function (_ref2) {
      var severity = _ref2.severity;
      return severity === 2;
    } : true)
  }));
  if (cli.isPathIgnored(testPath)) {
    var _end = Date.now();
    return skip({ start, end: _end, test: { path: testPath, title: 'ESLint' } });
  }

  var report = cli.executeOnFiles([testPath]);

  if (options.cliOptions && options.cliOptions.fix && !options.cliOptions.fixDryRun) {
    CLIEngine.outputFixes(report);
  }

  var end = Date.now();

  var tooManyWarnings = options.cliOptions && options.cliOptions.maxWarnings != null && options.cliOptions.maxWarnings >= 0 && report.warningCount > options.cliOptions.maxWarnings;

  var format = function format() {
    var formatter = cli.getFormatter(options.cliOptions.format);
    return formatter(quiet ? CLIEngine.getErrorResults(report.results) : report.results);
  };

  if (report.errorCount > 0 || tooManyWarnings) {
    var errorMessage = format();

    if (!report.errorCount && tooManyWarnings) errorMessage += `\nESLint found too many warnings (maximum: ${options.cliOptions.maxWarnings}).`;

    return fail({
      start,
      end,
      test: { path: testPath, title: 'ESLint', errorMessage }
    });
  }

  var result = pass({
    start,
    end,
    test: { path: testPath, title: 'ESLint' }
  });

  if (!quiet && report.warningCount > 0) {
    result.console = [{ message: format(), origin: '', type: 'warn' }];
  }

  return result;
};

module.exports = runESLint;