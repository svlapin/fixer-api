import 'jest';

const fixer = require('../dist');

const accessKey = process.env.FIXER_API_KEY;

describe('#symbols', () => {
  afterEach((cb) => {
    // sleep to avoid rate limiting
    setTimeout(cb, 1000);
  });

  describe('default fixer', () => {
    it('should get symbol data', async () => {
      const result = await fixer.symbols({
        access_key: accessKey
      });

      expect(result).toMatchObject({
        symbols: expect.objectContaining({
          AED: 'United Arab Emirates Dirham',
          AFN: 'Afghan Afghani',
          ALL: 'Albanian Lek'
        }),
        success: true
      });
    });
  });
});
