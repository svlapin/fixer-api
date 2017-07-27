'use strict';

import { IFixerResponse } from '../lib/Fixer';
import NodeFixer from '../lib/NodeFixer';
import * as http from 'http';
import * as https from 'https';
import { EventEmitter } from 'events';

import * as sinon from 'sinon';
import { expect } from 'chai';

const sandbox = sinon.sandbox.create();

describe('NodeFixer', () => {
  afterEach(() => {
    sandbox.restore();
  });

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
            sandbox.stub(provider, 'get');
            result = fixer.request(fakePath, fakeOpts);
            cb = (<sinon.SinonStub>provider.get).args[0][1];
          });

          it(`calls ${providerName}#request`, () => {
            expect(provider.get).to.have.been.called;
          });

          describe('behavior on response', () => {
            let resp: any;
            let emitter: EventEmitter;

            beforeEach(() => {
              emitter = new EventEmitter();

              resp = (<any>Object).assign(emitter, {
                headers: {},
                resume: sinon.stub(),
                setEncoding: sinon.stub()
              });
            });

            it('rejects if status code is not 200', (done) => {
              resp.statusCode = 500;
              result
                .catch((err: Error) => {
                  expect(err.message).to.match(/status code/);
                  done();
                });

              cb(resp);
            });

            it('rejects content type is not json', (done) => {
              resp.statusCode = 200;
              result
                .catch((err: Error) => {
                  expect(err.message).to.match(/content-type/);
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
                    expect(err.message).to.match(/JSON body/);
                    done();
                  });

                emitter.emit('data', 'any');
                emitter.emit('end');
              });

              it('resolves when json supplied', (done) => {
                const data = { anyKey: 'anyVal' };

                result
                  .then((parsed: any) => {
                    expect(parsed).eql(data);
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
        sandbox.stub(fixer, 'request').returns(fakeRequestResult);
      });

      it('calls #request with /latest and `base` & `symbols` parameters', () => {
        const fakeOpts = {
          base: 'USD',
          symbols: 'ANY',
          nonexistent: {}
        };

        fixer.latest(fakeOpts);

        expect(fixer.request).to.have.been.calledWithExactly('/latest', {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('returns result #request returns', () => {
        expect(fixer.latest()).equal(fakeRequestResult);
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
        sandbox.stub(fixer, 'request').returns(fakeRequestResult);
      });

      it('calls #request when date is formatted string', () => {
        const strDate = '2015-05-23';
        fixer.forDate(strDate, fakeOpts);

        expect(fixer.request).to.have.been.calledWithExactly(`/${strDate}`, {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('calls #request when date is Date instance', () => {
        const date = new Date(2015, 4, 25);
        fixer.forDate(date, fakeOpts);

        expect(fixer.request).to.have.been.calledWithExactly('/2015-05-25', {
          base: fakeOpts.base,
          symbols: fakeOpts.symbols
        });
      });

      it('throws when no date provided', () => {
        expect(fixer.forDate).throw(/invalid date/i);
      });

      it('returns promise from #request', () => {
        expect(fixer.forDate(new Date())).equal(fakeRequestResult);
      });
    });
  });
});
