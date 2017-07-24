'use strict';

import { IFixerResponse } from '../lib/Fixer';
import NodeFixer from '../lib/NodeFixer';
import * as request from 'request';

describe('NodeFixer', () => {
  describe('instance methods', () => {
    let fixer: NodeFixer;

    beforeEach(() => {
      fixer = new NodeFixer();
    });

    describe('#request', () => {
      const fakePath = '/any';
      const fakeOpts = { anyKey: 'anyVal' };

      let result: Promise<IFixerResponse>;

      beforeEach(() => {
        spyOn(request, 'get');

        result = fixer.request(fakePath, fakeOpts);
      });

      it('calls request#get', () => {
        expect(request.get)
          .toHaveBeenCalledWith(
            `${fixer.baseUrl}${fakePath}?anyKey=anyVal`,
            jasmine.any(Function)
          );
      });

      describe('callback provided', () => {
        let cb: any;

        beforeEach(() => {
          cb = (<jasmine.Spy>request.get).calls.argsFor(0)[1];
        });

        it('rejects resulting promise if a error was provided', (done) => {
          const err = new Error('Anythyng could go wrong');
          result
            .catch((e) => {
              expect(e).toBe(err);
              done();
            });

          cb(err);
        });

        it('rejects resulting promise if no body was provided', (done) => {
          result
            .catch((err) => {
              expect(err.message).toMatch(/empty response/i);
              done();
            });

          cb(null, null, null);
        });

        it('rejects resulting promise if body is unparsable', (done) => {
          result
            .catch((err) => {
              expect(err.message).toMatch(/failed to parse json/i);
              done();
            });

          cb(null, null, 'non json');
        });

        it('rejects resulting promise if body contains `error` property', (done) => {
          result
            .catch((err) => {
              expect(err.message).toMatch(/error that happened/i);
              done();
            });

          cb(null, null, '{"error": "Error that happened"}');
        });

        it('resolves to a value of parsed body', (done) => {
          const fakeBody = { base: 'any', date: 'any', rates: { ANY: 134 } };

          result
            .then((res) => {
              expect(res).toEqual(fakeBody);
              done();
            });

          cb(null, null, JSON.stringify(fakeBody));
        });
      });
    });

    describe('#latest', () => {
      const fakeRequestResult = new Promise<IFixerResponse>(() => (
        { base: 'any', date: 'any', rates: { ANY: 134 } }
      ));

      beforeEach(() => {
        fixer.request = jasmine.createSpy('#request').and.returnValue(fakeRequestResult);
      });

      it('calls #request with /latest and `base` & `symbols` parameters', () => {
        const fakeOpts = {
          base: 'USD',
          symbols: 'ANY',
          nonexistent: {}
        };

        fixer.latest(fakeOpts);

        expect(fixer.request).toHaveBeenCalledWith('/latest', {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('returns result #request returns', () => {
        expect(fixer.latest()).toBe(fakeRequestResult);
      });
    });

    describe('#forDate', () => {
      const fakeRequestResult = new Promise<IFixerResponse>(() => (
        { base: 'any', date: 'any', rates: { ANY: 134 } }
      ));

      const fakeOpts = {
        base: 'USD',
        symbols: 'ANY',
        nonexistent: {}
      };

      beforeEach(() => {
        fixer.request = jasmine.createSpy('#request').and.returnValue(fakeRequestResult);
      });

      it('calls #request when date is formatted string', () => {
        const strDate = '2015-05-23';
        fixer.forDate(strDate, fakeOpts);

        expect(fixer.request).toHaveBeenCalledWith(`/${strDate}`, {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('calls #request when date is Date instance', () => {
        const date = new Date(2015, 4, 25);
        fixer.forDate(date, fakeOpts);

        expect(fixer.request).toHaveBeenCalledWith('/2015-05-25', {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('throws when no date provided', () => {
        expect(fixer.forDate).toThrowError(/invalid date/i);
      });

      it('returns promise from #request', () => {
        expect(fixer.forDate(new Date())).toBe(fakeRequestResult);
      });
    });
  });
});
