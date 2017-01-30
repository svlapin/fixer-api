'use strict';

describe('NodeFixer', () => {
  let NodeFixer;

  beforeEach(() => {
    NodeFixer = require('../lib/NodeFixer');
  });

  describe('instance methods', () => {
    let fixer;

    beforeEach(() => {
      fixer = new NodeFixer();
    });

    describe('#request', () => {
      let request;

      const fakePath = '/any';
      const fakeOpts = { anyKey: 'anyVal' };

      let result;

      beforeEach(() => {
        request = require('request');
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
        let cb;

        beforeEach(() => {
          cb = request.get.calls.argsFor(0)[1];
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
          const fakeBody = { anyKey: 'anyVal' };

          result
            .then((res) => {
              expect(res).toEqual(fakeBody);
              done();
            });

          cb(null, null, JSON.stringify(fakeBody));
        });
      });
    });
  });
});
