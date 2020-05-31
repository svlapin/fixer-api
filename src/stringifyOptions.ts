import { IRawParams } from './Fixer';

export default function stringifyOptions(opts: IRawParams) {
  return Object.entries(opts)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(`${value instanceof Array ? value.join(',') : value}`)}`
    )
    .join('&');
}
