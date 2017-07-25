'use strict';

import * as moment from 'moment';

export interface IFixerRates {
  readonly [currency: string]: number;
}

export interface IFixerResponse {
  readonly base: string;
  readonly date: string;
  readonly rates: IFixerRates;
  readonly error?: string;
}

export abstract class Fixer {
  baseUrl: string;

  constructor(opts: any = {}) {
    (<any>Object).assign(this, {
      baseUrl: opts.baseUrl || 'http://api.fixer.io'
    });
  }

  forDate(date: any, opts: any = {}) {
    let formattedDate;

    const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof date === 'string' && RE_DATE.test(date)) {
      formattedDate = date;
    } else if (date instanceof Date) {
      formattedDate = moment(date).format('YYYY-MM-DD');
    } else {
      throw new Error('Invalid date argument');
    }

    const { base, symbols } = opts;
    return this.request(`/${formattedDate}`, { base, symbols });
  }

  latest(opts: any = {}) {
    const { base, symbols } = opts;
    return this.request('/latest', { base, symbols });
  }

  protected abstract request(url: string, opts: any): Promise<IFixerResponse>;
}
