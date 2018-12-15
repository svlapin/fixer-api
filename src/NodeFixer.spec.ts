import NodeFixer from './NodeFixer';
import * as request from 'request';

import 'jest';

jest.mock('request');

describe('NodeFixer', () => {
  let fixer: NodeFixer;

  beforeEach(() => {
    fixer = new NodeFixer();
  });

  it('throws if no access key provided', async () => {
    await expect(fixer.latest({ base: 'USD', symbols: ['AUD'] }))
      .rejects.toThrow('access_key is required to use fixer');
  });

  it('throws there was an error in response', async () => {
    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(new Error('any'), null, ''));

    await expect(fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] }))
      .rejects.toThrow('any');
  });

  it('throws if body is empty', async () => {
    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, ''));

    await expect(fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] }))
      .rejects.toThrow('Empty response body');
  });

  it('throws if body is not parsable', async () => {
    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, '{{{'));

    await expect(fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] }))
      .rejects.toThrow('Failed to parse JSON body');
  });

  it('throws if body contains error', async () => {
    const mockResponse = {
      error: {
        type: 'ESOME',
        info: 'this happens'
      }
    };

    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, JSON.stringify(mockResponse)));

    await expect(fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] }))
      .rejects.toThrow('ESOME: this happens');
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

    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, JSON.stringify(mockResponse)));

    const result = await fixer.latest({ access_key: '123456', base: 'USD', symbols: ['AUD'] });

    expect(result).toEqual(mockResponse);
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

    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, JSON.stringify(mockResponse)));

    const result = await fixer.forDate('2018-12-13', {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    });

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

    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, JSON.stringify(mockResponse)));

    const result = await fixer.forDate(new Date(), {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    });

    expect(result).toEqual(mockResponse);
  });

  it('forDate throws if Date is unknown', async () => {
    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, null));

    await expect(fixer.forDate('any', {
      access_key: '123456',
      base: 'USD',
      symbols: ['AUD']
    })).rejects.toThrow('Invalid date argument');
  });

  it('gets initialized with custom options', async () => {
    const newFixer = new NodeFixer({ baseUrl: 'any' });
    (request.get as jest.Mock)
      .mockImplementation((_, cb) => cb(null, null, null));

    await expect(newFixer.forDate('2018-12-14'))
      .rejects.toThrow('access_key is required to use fixer');
    await expect(newFixer.latest())
      .rejects.toThrow('access_key is required to use fixer');
  });
});
