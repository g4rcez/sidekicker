import moment from 'moment';

export const dateFormat = (date: string, format = 'DD MMM') => moment(date).format(format);

export const timeFormat = (date: string, format = 'HH:MM') => moment(date).format(format);

export const afterToday = (dateCompare: string) => moment(dateCompare).isAfter(moment(), 'day');

export const today = (dateCompare: string) => moment(dateCompare).isSame(moment(), 'day');

export const sameMouth = (date: string) => moment(date).isSame(moment(), 'month');

export const sameYear = (date: string) => moment(date).isSame(moment(), 'year');

export const addDays = (date: string, days: number) => moment(date).add(days, 'days');

export const subtractDays = (date: string, days: number) => moment(date).subtract(days, 'days');

export const masks = {
  default: 'ddd MMM dd YYYY HH:mm:ss',
  short: 'M/D/YYYY',
  medium: 'MMM D, YY',
  isoDate: 'YYYY-MM-DD',
  isoDatetime: "YYYY-MM-DD'T'HH:mm:ss",
  isoUtcDatetime: "UTC:YYYY-MM-DD'T'HH:mm:ss'Z",
  unixTimeStamps: 'X',
  unixTimeStampsMs: 'x',
  htmlDate: this.isoDate,
  htmlDateTimeLocal: 'YYYY-MM-DDTHH:mm',
  htmlTime: 'HH:mm',
  hour: 'HH:mm:ss',
};
