import 'jest';

import formatDate from '../src/formatDate';

const fixer = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

const someDate = new Date();
const formattedDate = formatDate(someDate);

describe('#forDate', () => {
  afterEach((cb) => {
    // sleep to avoid rate limiting
    setTimeout(cb, 1000);
  });

  it('should get data based date as a string', async () => {
    const result = await fixer.forDate(formattedDate, {
      access_key: accessKey
    });

    expect(result).toMatchObject({
      base: 'EUR',
      date: formattedDate,
      rates: expect.objectContaining({
        USD: expect.any(Number),
        EUR: 1,
        GBP: expect.any(Number)
      }),
      success: true,
      timestamp: expect.any(Number)
    });
  });

  it('should get data based on Date instance', async () => {
    const result = await fixer.forDate(someDate, {
      access_key: accessKey
    });

    expect(result).toMatchObject({
      base: 'EUR',
      date: formattedDate,
      rates: expect.objectContaining({
        USD: expect.any(Number),
        EUR: 1,
        GBP: expect.any(Number)
      }),
      success: true,
      timestamp: expect.any(Number)
    });
  });

  describe('default instance updated with accessKey', () => {
    it('should get latest data', async () => {
      fixer.set({ accessKey });
      const result = await fixer.latest();

      expect(result).toMatchObject({
        base: 'EUR',
        date: formattedDate,
        rates: expect.objectContaining({
          USD: expect.any(Number),
          EUR: 1,
          GBP: expect.any(Number)
        }),
        success: true,
        timestamp: expect.any(Number)
      });
    });
  });
});
