import { Fixer, IRawParams } from './Fixer';
import stringifyOptions from './stringifyOptions';

type Fetcher = (url: string) => Promise<{
  readonly json: () => any;
}>;

class NodeFixer extends Fixer {
  public fetch: Fetcher;

  constructor(fetch: Fetcher, ...restParams: any[]) {
    super(...restParams);
    this.fetch = fetch;
  }

  async request<Result>(path: string, opts: IRawParams): Promise<Result> {
    const accessKey = opts.access_key || this.basicOptions.accessKey;

    if (!accessKey) {
      throw new Error('access_key is required to use fixer');
    }

    const filteredOptions = Object.entries(opts).reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...(value ? { [key]: value } : {})
      }),
      {
        access_key: accessKey
      }
    );

    const url = `${this.basicOptions.baseUrl}${path}`;

    const response = await this.fetch(`${url}?${stringifyOptions(filteredOptions)}`);

    let jsonResponse;
    try {
      jsonResponse = await response.json();
    } catch {
      throw new Error(`Request to ${url} resulted in non-JSON response`);
    }

    if (jsonResponse.error) {
      throw new Error(`${jsonResponse.error.type}: ${jsonResponse.error.info}`);
    }

    return jsonResponse;
  }
}

export default NodeFixer;
