import moment from 'moment';

export const epochToDate = (epoch: number, format = 'YYYY-MM-dd') => {
  return moment.unix(epoch).format(format);
};

export const dateFormat = (date: string, format = 'DD MMM') => moment(date).format(format);

export const timeFormat = (date: string, format = 'HH:MM') => moment(date).format(format);
