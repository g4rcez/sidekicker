import moment, { MomentSetObject } from "moment";

export const isAfter = (value: string | MomentSetObject, target: string | MomentSetObject) =>
    moment(value).isAfter(moment(target));

export const isBefore = (value: string | MomentSetObject, target: string | MomentSetObject) =>
    moment(value).isBefore(moment(target));

export const tomorrow = (dateCompare: string) => moment(dateCompare).isAfter(moment(), "day");

export const yesterday = (dateCompare: string) => moment(dateCompare).isBefore(moment(), "day");

export const today = (dateCompare: string) => moment(dateCompare).isSame(moment(), "day");

export const sameDay = (date: string) => moment(date).isSame(moment(), "day");

export const sameWeek = (date: string) => moment(date).isSame(moment(), "week");

export const sameMouth = (date: string) => moment(date).isSame(moment(), "month");

export const sameYear = (date: string) => moment(date).isSame(moment(), "year");
