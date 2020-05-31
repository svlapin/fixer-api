import { DEFAULT_URL } from './constants';
import { ensureDateString } from './formatDate';

export interface IFixerError {
  readonly type: string;
  readonly info: string;
}

export interface IFixerRates {
  readonly [currency: string]: number;
}

export interface IFixerResponse {
  readonly base: string;
  readonly date: string;
  readonly rates: IFixerRates;
  readonly timestamp: number;
  readonly error?: IFixerError;
}

export interface IFixerSymbols {
  readonly [symbol: string]: string;
}

export interface IFixerSymbolResponse {
  readonly symbols: IFixerSymbols;
  readonly error?: IFixerError;
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
    readonly amount: number;
  };
  readonly date: string;
  readonly result: number;
}

export interface IFixerTimeseriesResponse {
  readonly success: boolean;
  readonly start_date: string;
  readonly end_date: string;
  readonly base: string;
  readonly rates: Record<string, Record<string, number>>;
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
    return this.request<IFixerResponse>(`/${ensureDateString(date)}`, opts);
  }

  async latest(opts: Partial<IRequestOptions> = {}): Promise<IFixerResponse> {
    return this.request<IFixerResponse>('/latest', opts);
  }

  async symbols(opts: Partial<IRequestOptions> = {}): Promise<IFixerSymbolResponse> {
    return this.request<IFixerSymbolResponse>('/symbols', opts);
  }

  async convert(
    from: string,
    to: string,
    amount: number,
    date?: Date | string
  ): Promise<IFixerConvertResponse> {
    return this.request<IFixerConvertResponse>('/convert', {
      from,
      to,
      amount,
      date
    });
  }

  async timeseries(
    startDate: Date | string,
    endDate: Date | string,
    opts: Partial<IRequestOptions> = {}
  ) {
    const start = ensureDateString(startDate);
    const end = ensureDateString(endDate);
    return this.request<IFixerTimeseriesResponse>('/timeseries', {
      start_date: start,
      end_date: end,
      ...opts
    });
  }

  protected abstract request<Result>(url: string, opts: IRawParams): Promise<Result>;
}
