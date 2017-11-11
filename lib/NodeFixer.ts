'use strict';

import { get } from 'request';
import { stringify } from 'querystring';
import { Fixer, IFixerResponse } from './Fixer';

class NodeFixer extends Fixer {
  request(path: string, opts: any): Promise<IFixerResponse> {
    return new Promise((resolve, reject) => {
      get(`${this.baseUrl}${path}?${stringify(opts)}`, (err, resp, body) => {
        if (err) {
          reject(err);
          return;
        }

        if (!body) {
          reject(new Error('Empty response body'));
          return;
        }

        let parsedBody: IFixerResponse;

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

export default NodeFixer;
