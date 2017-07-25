'use strict';

import * as http from 'http';
import * as https from 'https';
import { Fixer, IFixerResponse } from './Fixer';

class NodeFixer extends Fixer {
  request(path: string, opts: any): Promise<IFixerResponse> {
    return new Promise((resolve, reject) => {
      ('https:' === this.baseUrl.protocol ? https.get : http.get)
        ({ ...this.baseUrl, path }, (res) => {
          const contentType = res.headers['content-type'];
          let error: (Error | null) = null;
          if (res.statusCode !== 200) {
            error = new Error(`Request failed: status code ${res.statusCode}`);
          } else if (!/^application\/json/.test(<string>contentType)) {
            error = new Error(`Invalid content-type:
                               expected application/json but received ${contentType}`);
          }

          if (error) {
            res.resume();
            reject(error);
            return;
          }

          res.setEncoding('utf8');
          let rawData = '';
          let parsedData: IFixerResponse;

          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            try {
              parsedData = JSON.parse(rawData);
              resolve(parsedData);
            } catch (e) {
              reject(new Error('Failed to parse JSON body'));
            }
          });
        });
    });
  }
}

export default NodeFixer;
