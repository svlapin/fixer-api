'use strict';

const _ = require('lodash');
const moment = require('moment');

class Fixer {
  constructor(opts) {
    opts = opts || {};

    Object.assign(this, {
      baseUrl: opts.baseUrl || 'http://api.fixer.io'
    });
  }

  forDate(date, opts) {
    opts = opts || {};

    let formattedDate;

    const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
    if (_.isString(date) && RE_DATE.test(date)) {
      formattedDate = date;
    } else if (_.isDate(date)) {
      formattedDate = moment(date).format('YYYY-MM-DD');
    } else {
      throw new Error('Invalid date argument');
    }

    return this.request(`/${formattedDate}`, _.pick(opts, 'base', 'symbols'));
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
