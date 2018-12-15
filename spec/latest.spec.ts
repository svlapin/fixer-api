import * as moment from 'moment';

const fixer = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

describe('#latest', () => {
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
