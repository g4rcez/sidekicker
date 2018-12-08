import moment from 'moment';

export const addDays = (date: string, days: number) => moment(date).add(days, 'days');

export const subtractDays = (date: string, days: number) => moment(date).subtract(days, 'days');
