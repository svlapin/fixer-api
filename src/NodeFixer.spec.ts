import NodeFixer from './NodeFixer';
import { DEFAULT_URL } from './constants';

import 'jest';

// Mock the global fetch function
const mockedFetch = jest.fn();
global.fetch = mockedFetch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setMockedResponse = (jsonResponse: any) => {
  mockedFetch.mockImplementation(() => ({
    json: async () => jsonResponse
  }));
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('NodeFixer', () => {
  let fixer: NodeFixer;

  beforeEach(() => {
    fixer = new NodeFixer(fetch);
  });

  afterEach(() => {
    mockedFetch.mockClear();
  });

  it('throws if no access key provided', async () => {
    await expect(fixer.latest({ base: 'USD', symbols: ['AUD'] })).rejects.toThrow(
      'access_key is required to use fixer'
    );
  });

  it('throws if body is not parsable', async () => {
    mockedFetch.mockImplementation(() => ({
      json() {
        throw new Error('unexpected token');
      }
    }));

    await expect(
      fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] })
    ).rejects.toThrow('Request to http://data.fixer.io/api/latest resulted in non-JSON response');
  });

  it('throws if body contains error', async () => {
    const mockResponse = {
      error: {
        type: 'ESOME',
        info: 'this happens'
      }
    };

    setMockedResponse(mockResponse);

    await expect(
      fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] })
    ).rejects.toThrow('ESOME: this happens');
  });

  it('fetches latest data', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-14',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    const result = await fixer.latest({ access_key: '123456' });

    expect(result).toEqual(mockResponse);
  });

  it('serializes symbols parameter', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-14',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    await fixer.latest({ access_key: '123456', symbols: ['AUD', 'USD'] });

    expect(mockedFetch).toBeCalledWith(
      'http://data.fixer.io/api/latest?access_key=123456&symbols=AUD%2CUSD'
    );
  });

  it('allows providing symbols parameter as a string', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-14',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await fixer.latest({ access_key: '123456', symbols: 'AUD,USD' as any });

    expect(mockedFetch).toBeCalledWith(
      'http://data.fixer.io/api/latest?access_key=123456&symbols=AUD%2CUSD'
    );
  });

  it('fetches forDate', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-13',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    const result = await fixer.forDate('2018-12-13', {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    });

    expect(mockedFetch).toBeCalledWith(
      'http://data.fixer.io/api/2018-12-13?access_key=123456&base=USD&symbols=AUD'
    );

    expect(result).toEqual(mockResponse);
  });

  it('fetches forDate for a Date instance', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-13',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    const result = await fixer.forDate(new Date(2018, 10, 10), {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    });

    expect(mockedFetch).toBeCalledWith(
      'http://data.fixer.io/api/2018-11-10?access_key=123456&base=USD&symbols=AUD'
    );

    expect(result).toEqual(mockResponse);
  });

  it('fetches forDate for a Date instance with padding', async () => {
    const mockResponse = {
      success: true,
      timestamp: 1519296206,
      base: 'USD',
      date: '2018-12-13',
      rates: {
        AUD: 1.566015
      }
    };

    setMockedResponse(mockResponse);

    const result = await fixer.forDate(new Date(2018, 1, 3), {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    });

    expect(mockedFetch).toBeCalledWith(
      'http://data.fixer.io/api/2018-02-03?access_key=123456&base=USD&symbols=AUD'
    );

    expect(result).toEqual(mockResponse);
  });

  it('forDate throws if Date is unknown', async () => {
    setMockedResponse(null);

    await expect(
      fixer.forDate('any', {
        access_key: '123456',
        base: 'USD',
        symbols: ['AUD']
      })
    ).rejects.toThrow('Invalid date argument');
  });

  it('throws when `symbols()` is called on default instance with no access_token', async () => {
    await expect(fixer.symbols()).rejects.toThrow('access_key is required to use fixer');
  });

  it('fetches symbols', async () => {
    const mockResponse = {
      success: true,
      symbols: {
        AED: 'United Arab Emirates Dirham'
      }
    };

    setMockedResponse(mockResponse);

    const result = await fixer.symbols({
      access_key: '123456'
    });

    expect(mockedFetch).toBeCalledWith('http://data.fixer.io/api/symbols?access_key=123456');

    expect(result).toEqual(mockResponse);
  });

  it('gets initialized with custom options', async () => {
    const newFixer = new NodeFixer(fetch, { baseUrl: 'any' });
    setMockedResponse(null);

    await expect(newFixer.forDate('2018-12-14')).rejects.toThrow(
      'access_key is required to use fixer'
    );
    await expect(newFixer.latest()).rejects.toThrow('access_key is required to use fixer');
  });

  describe('when initialized with params object', () => {
    let fixerWithParams: NodeFixer;

    beforeEach(() => {
      fixerWithParams = new NodeFixer(fetch, { accessKey: '1234' });
    });

    it('fetches latest data', async () => {
      const mockResponse = {
        success: true,
        timestamp: 1519296206,
        base: 'USD',
        date: '2018-12-14',
        rates: {
          AUD: 1.566015
        }
      };

      setMockedResponse(mockResponse);

      const result = await fixerWithParams.latest({ base: 'USD', symbols: ['AUD'] });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('#set', () => {
    it('allows to set accessKey with chaining', async () => {
      fixer.set().set({ baseUrl: 'any' }).set({ accessKey: '1234' }).set({ accessKey: '12345' });
    });

    it('fetches latest data after accessKey was set with chaining', async () => {
      fixer.set({ accessKey: '1234' }).set({ accessKey: '12345' }).set();

      const mockResponse = {
        success: true,
        timestamp: 1519296206,
        base: 'USD',
        date: '2018-12-14',
        rates: {
          AUD: 1.566015
        }
      };

      setMockedResponse(mockResponse);

      const result = await fixer.latest();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('#convert', () => {
    let fixerWithParams: NodeFixer;

    beforeEach(() => {
      fixerWithParams = new NodeFixer(fetch, { accessKey: '1234' });
    });

    it('sends /convert request', async () => {
      const mockResponse = {
        success: true,
        date: '2018-12-14',
        result: 12.5
      };

      setMockedResponse(mockResponse);

      const result = await fixerWithParams.convert('EUR', 'USD', 10);

      expect(mockedFetch).toBeCalledWith(
        `${DEFAULT_URL}/convert?access_key=1234&from=EUR&to=USD&amount=10`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('#timeseries', () => {
    let fixerWithParams: NodeFixer;

    beforeEach(() => {
      fixerWithParams = new NodeFixer(fetch, { accessKey: '1234' });
    });

    it('sends /timeseries request', async () => {
      const startDate = '2018-12-14';
      const endDate = '2018-12-15';

      const mockResponse = {
        success: true,
        start_date: startDate,
        end_date: endDate,
        rates: {
          '2018-12-14': {
            EUR: 1.0
          },
          '2018-12-15': {
            EUR: 2.0
          }
        }
      };

      setMockedResponse(mockResponse);

      const result = await fixerWithParams.timeseries(startDate, endDate);

      expect(mockedFetch).toBeCalledWith(
        `${DEFAULT_URL}/timeseries?access_key=1234&start_date=2018-12-14&end_date=2018-12-15`
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
