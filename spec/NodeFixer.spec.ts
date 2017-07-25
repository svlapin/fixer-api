'use strict';

import { IFixerResponse } from '../lib/Fixer';
import NodeFixer from '../lib/NodeFixer';
import * as http from 'http';
import * as https from 'https';
import { EventEmitter } from 'events';

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
      let cb: any;

      function testWithProvider(provider: any, providerName: string) {
        describe(`when baseUrl is ${providerName}`, () => {
          beforeEach(() => {
            fixer = new NodeFixer({ baseUrl: `${providerName}://api.fixer.io` });
            spyOn(provider, 'get');
            result = fixer.request(fakePath, fakeOpts);
            cb = (<jasmine.Spy>provider.get).calls.argsFor(0)[1];
          });

          it(`calls ${providerName}#request`, () => {
            expect(provider.get).toHaveBeenCalled();
          });

          describe('behavior on response', () => {
            let resp: any;
            let emitter: EventEmitter;

            beforeEach(() => {
              emitter = new EventEmitter();

              resp = (<any>Object).assign(emitter, {
                headers: {},
                resume: jasmine.createSpy('response#resume'),
                setEncoding: jasmine.createSpy('response#setEncoding')
              });
            });

            it('rejects if status code is not 200', (done) => {
              resp.statusCode = 500;
              result
                .catch((err: Error) => {
                  expect(err.message).toMatch(/status code/);
                  done();
                });

              cb(resp);
            });

            it('rejects content type is not json', (done) => {
              resp.statusCode = 200;
              result
                .catch((err: Error) => {
                  expect(err.message).toMatch(/content-type/);
                  done();
                });

              cb(resp);
            });

            describe('when statusCode and contentType are correct', () => {
              beforeEach(() => {
                resp.statusCode = 200;
                resp.headers['content-type'] = 'application/json';
                cb(resp);
              });

              it('rejects when non-json supplied', (done) => {
                result
                  .catch((err: Error) => {
                    expect(err.message).toMatch(/JSON body/);
                    done();
                  });

                emitter.emit('data', 'any');
                emitter.emit('end');
              });

              it('resolves when json supplied', (done) => {
                const data = { anyKey: 'anyVal' };

                result
                  .then((parsed: any) => {
                    expect(parsed).toEqual(data);
                    done();
                  });

                emitter.emit('data', JSON.stringify(data));
                emitter.emit('end');
              });
            });
          });
        });
      }

      testWithProvider(http, 'http');
      testWithProvider(https, 'https');
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
