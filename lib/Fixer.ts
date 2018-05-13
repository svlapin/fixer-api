'use strict';

import * as moment from 'moment';

export interface IFixerRates {
  readonly [currency: string]: number;
}

export interface IFixerResponse {
  readonly base: string;
  readonly date: string;
  readonly rates: IFixerRates;
  readonly error?: {
    type: string,
    info: string
  };
}

export interface IReqOpts {
  base?: string;
  symbols?: string[];
  access_key?: string;
}

export abstract class Fixer {
  baseUrl: string;

  constructor(opts: any = {}) {
    (<any>Object).assign(this, {
      baseUrl: opts.baseUrl || 'http://data.fixer.io/api'
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

    return this.request(`/${formattedDate}`, this.filterOptions(opts));
  }

  latest(opts: any = {}) {
    return this.request('/latest', this.filterOptions(opts));
  }

  private filterOptions(opts: any): IReqOpts {
    const filteredOpts: IReqOpts = {};
    if (opts.base) {
      filteredOpts.base = opts.base;
    }

    if (opts.symbols) {
      filteredOpts.symbols = opts.symbols;
    }

    if (opts.access_key) {
      filteredOpts.access_key = opts.access_key;
    }

    return filteredOpts;
  }

  protected abstract request(url: string, opts: any): Promise<IFixerResponse>;
}
