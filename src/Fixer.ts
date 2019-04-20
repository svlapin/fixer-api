import { DEFAULT_URL } from './constants';
import formatDate from './formatDate';

export interface IFixerRates {
  readonly [currency: string]: number;
}

export interface IFixerResponse {
  readonly base: string;
  readonly date: string;
  readonly rates: IFixerRates;
  readonly timestamp: number;
  readonly error?: {
    type: string,
    info: string
  };
}

export interface IFixerConvertRequestOptions {
  readonly from: string;
  readonly to: string;
  readonly amount: number;
  readonly date?: string;
}

export interface IFixerConvertResponse {
  readonly success: boolean;
  readonly query: {
    readonly from: string;
    readonly to: string;
    readonly amount: number
  };
  readonly date: string;
  readonly result: number;
}

export interface IRawParams {
  [key: string]: any;
}
export interface IRequestOptions {
  base?: string;
  symbols?: string[];
  access_key: string;
}

export interface IBasicOptions {
  baseUrl: string;
  accessKey?: string;
}

export abstract class Fixer {
  protected basicOptions: IBasicOptions;

  constructor(opts: Partial<IBasicOptions> = {}) {
    this.basicOptions = {
      baseUrl: opts.baseUrl || DEFAULT_URL,
      accessKey: opts.accessKey
    };
  }

  set({ baseUrl, accessKey }: Partial<IBasicOptions> = {}): Fixer {
    this.basicOptions.baseUrl = baseUrl || this.basicOptions.baseUrl;
    this.basicOptions.accessKey = accessKey || this.basicOptions.accessKey;
    return this;
  }

  async forDate(date: Date | string, opts: Partial<IRequestOptions> = {}): Promise<IFixerResponse> {
    let formattedDate;

    const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof date === 'string' && RE_DATE.test(date)) {
      formattedDate = date;
    } else if (date instanceof Date) {
      formattedDate = formatDate(date);
    } else {
      throw new Error('Invalid date argument');
    }

    return this.request<IFixerResponse>(`/${formattedDate}`, opts);
  }

  async latest(opts: Partial<IRequestOptions> = {}): Promise<IFixerResponse> {
    return this.request<IFixerResponse>('/latest', opts);
  }

  async convert(from: string, to: string, amount: number, date?: Date | string):
    Promise<IFixerConvertResponse> {
    return this.request<IFixerConvertResponse>('/convert', {
      from,
      to,
      amount,
      date
    });
  }

  protected abstract request<Result>(url: string, opts: IRawParams): Promise<Result>;
}
