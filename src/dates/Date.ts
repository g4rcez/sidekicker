import moment from "moment";

export const afterToday = (dateCompare: string) => moment(dateCompare).isAfter(moment(), "day");

export const beforeToday = (dateCompare: string) => moment(dateCompare).isBefore(moment(), "day");

export const today = (dateCompare: string) => moment(dateCompare).isSame(moment(), "day");

export const sameMouth = (date: string) => moment(date).isSame(moment(), "month");

export const sameYear = (date: string) => moment(date).isSame(moment(), "year");
