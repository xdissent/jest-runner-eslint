'use strict';

var _require = require('create-jest-runner'),
    createJestRunner = _require.createJestRunner;

var runner = createJestRunner(require.resolve('./runESLint'));

module.exports = runner;