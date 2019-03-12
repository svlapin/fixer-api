import * as moment from 'moment';

import 'jest';

const fixer = require('../dist');
const { Fixer } = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

describe('#latest', () => {
  describe('default fixer', () => {
    it('should get latest data', async () => {
      const result = await fixer.latest({
        access_key: accessKey
      });

      expect(result).toMatchObject({
        base: 'EUR',
        date: moment.utc().format('YYYY-MM-DD'),
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
        symbols: ['USD']
      });

      expect(result).toMatchObject({
        base: 'EUR',
        date: moment.utc().format('YYYY-MM-DD'),
        rates: expect.objectContaining({
          USD: expect.any(Number)
        }),
        success: true,
        timestamp: expect.any(Number)
      });
    });
  });

  describe('default instance updated with accessKey', () => {
    it('should get latest data', async () => {
      const result = await fixer
        .set({ accessKey })
        .latest();

      expect(result).toMatchObject({
        base: 'EUR',
        date: moment.utc().format('YYYY-MM-DD'),
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
