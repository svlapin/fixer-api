'use strict';

import { isString, isDate, pick } from 'lodash';
import * as moment from 'moment';

abstract class Fixer {
  baseUrl: string;

  constructor(opts: any = {}) {
    (<any>Object).assign(this, {
      baseUrl: opts.baseUrl || 'http://api.fixer.io'
    });
  }

  forDate(date: any, opts: any = {}) {
    let formattedDate;

    const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
    if (isString(date) && RE_DATE.test(date)) {
      formattedDate = date;
    } else if (isDate(date)) {
      formattedDate = moment(date).format('YYYY-MM-DD');
    } else {
      throw new Error('Invalid date argument');
    }

    return this.request(`/${formattedDate}`, pick(opts, 'base', 'symbols'));
  }

  latest(opts: any = {}) {
    return this.request('/latest', pick(opts, 'base', 'symbols'));
  }

  protected abstract request(url: string, opts: any): Promise<any>;
}

export default Fixer;
