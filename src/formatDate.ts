const padNumber = (num: number) => num < 10 ? `0${num}` : num.toString();

export default function formatDate(date: Date) {
  return `${date.getUTCFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}
