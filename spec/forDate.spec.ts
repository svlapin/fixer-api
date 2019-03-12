import * as moment from 'moment';

import 'jest';

const fixer = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

const someMoment = moment.utc('2018/03/01', 'YYYY/MM/DD');
const formattedMoment = someMoment.format('YYYY-MM-DD');

describe('#forDate', () => {
  it('should get data based date as a string', async () => {
    const result = await fixer.forDate(formattedMoment, {
      access_key: accessKey
    });

    expect(result).toMatchObject({
      base: 'EUR',
      date: formattedMoment,
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
    const result = await fixer.forDate(someMoment.toDate(), {
      access_key: accessKey
    });

    expect(result).toMatchObject({
      base: 'EUR',
      date: formattedMoment,
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
