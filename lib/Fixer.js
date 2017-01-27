'use strict';

const _ = require('lodash');

class Fixer {
  constructor(opts) {
    opts = opts || {};

    Object.assign(this, {
      baseUrl: opts.baseUrl || 'http://api.fixer.io'
    });
  }

  latest(opts) {
    opts = opts || {};
    return this.request('/latest', _.pick(opts, 'base', 'symbols'));
  }

  request() {
    throw new Error('#request is not implemented in the Fixer class');
  }
}

module.exports = Fixer;
