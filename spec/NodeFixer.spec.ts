'use strict';

import { IFixerResponse } from '../lib/Fixer';
import NodeFixer from '../lib/NodeFixer';
import * as request from 'request';

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

      beforeEach(() => {
        sandbox.stub(request, 'get');

        result = fixer.request(fakePath, fakeOpts);
      });

      it('calls request#get', () => {
        expect(request.get).to.have.been.called;
      });

      describe('callback provided', () => {
        let cb: any;

        beforeEach(() => {
          cb = (<sinon.SinonStub>request.get).getCall(0).args[1];
        });

        it('rejects resulting promise if a error was provided', (done) => {
          const err = new Error('Anythyng could go wrong');
          result
            .catch((e) => {
              expect(e).to.eql(err);
              done();
            });

          cb(err);
        });

        it('rejects resulting promise if no body was provided', (done) => {
          result
            .catch((err) => {
              expect(err.message).to.match(/empty response/i);
              done();
            });

          cb(null, null, null);
        });

        it('rejects resulting promise if body is unparsable', (done) => {
          result
            .catch((err) => {
              expect(err.message).to.match(/failed to parse json/i);
              done();
            });

          cb(null, null, 'non json');
        });

        it('rejects resulting promise if body contains `error` property', (done) => {
          result
            .catch((err) => {
              expect(err.message).to.match(/error that happened/i);
              done();
            });

          cb(null, null, '{"error": "Error that happened"}');
        });

        it('resolves to a value of parsed body', (done) => {
          const fakeBody = { base: 'any', date: 'any', rates: { ANY: 134 } };

          result
            .then((res) => {
              expect(res).to.eql(fakeBody);
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
