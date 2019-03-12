import { get } from 'request';
import { stringify } from 'querystring';
import { Fixer, IRawParams } from './Fixer';

class NodeFixer extends Fixer {
  async request<Result>(path: string, opts: IRawParams): Promise<Result> {
    const accessKey = opts.access_key || this.basicOptions.accessKey;

    if (!accessKey) {
      throw new Error('access_key is required to use fixer');
    }

    return new Promise((resolve, reject) => {
      const filteredOptions = Object.entries(opts)
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(value ? { [key]: value } : {})
        }),
        {
          access_key: accessKey
        }
      );

      get(
        `${this.basicOptions.baseUrl}${path}?${stringify(filteredOptions)}`,
        (err, resp, body) => {
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
            reject(new Error(`${parsedBody.error.type}: ${parsedBody.error.info}`));
            return;
          }

          resolve(parsedBody as Result);
        }
      );
    });
  }
}

export default NodeFixer;
