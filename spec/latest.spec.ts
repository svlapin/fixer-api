import 'jest';

import formatDate from '../src/formatDate';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fixer = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

describe('#latest', () => {
  afterEach((cb) => {
    // sleep to avoid rate limiting
    setTimeout(cb, 1000);
  });

  describe('default fixer', () => {
    it('should get latest data', async () => {
      const result = await fixer.latest({ access_key: accessKey });

      expect(result).toMatchObject({
        base: 'EUR',
        date: formatDate(new Date()),
        rates: expect.objectContaining({
          USD: expect.any(Number),
          EUR: 1,
          GBP: expect.any(Number)
        }),
        success: true,
        timestamp: expect.any(Number)
      });
    });

    it('should respect base & symbols', async () => {
      const result = await fixer.latest({
        access_key: accessKey,
        base: 'EUR',
        symbols: ['USD', 'AUD']
      });

      expect(result).toMatchObject({
        base: 'EUR',
        date: formatDate(new Date()),
        rates: expect.objectContaining({ USD: expect.any(Number), AUD: expect.any(Number) }),
        success: true,
        timestamp: expect.any(Number)
      });
    });
  });

  describe('default instance updated with accessKey', () => {
    it('should get latest data', async () => {
      const result = await fixer.set({ accessKey }).latest();

      expect(result).toMatchObject({
        base: 'EUR',
        date: formatDate(new Date()),
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
