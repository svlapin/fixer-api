const padNumber = (num: number) => (num < 10 ? `0${num}` : num.toString());

export function ensureDateString(input: Date | string): string {
  const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof input === 'string' && RE_DATE.test(input)) {
    return input;
  }

  if (input instanceof Date) {
    return formatDate(input);
  }

  throw new TypeError(`Invalid date argument: ${input}`);
}

export default function formatDate(date: Date) {
  return `${date.getUTCFullYear()}-${padNumber(
    date.getMonth() + 1
  )}-${padNumber(date.getDate())}`;
}
