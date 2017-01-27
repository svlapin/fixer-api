'use strict';

const request = require('request');
const querystring = require('querystring');

const Fixer = require('./Fixer');

class NodeFixer extends Fixer {
  request(path, opts) {
    return new Promise((resolve, reject) => {
      request.get(`${this.baseUrl}${path}?${querystring.stringify(opts)}`, (err, resp, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (!body) {
          reject(new Error('Empty response body'));
          return;
        }

        let parsedBody;

        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          reject(new Error('Failed to parse JSON body'));
          return;
        }

        if (parsedBody.error) {
          reject(new Error(parsedBody.error));
          return;
        }

        resolve(parsedBody);
      });
    });
  }
}

module.exports = NodeFixer;
