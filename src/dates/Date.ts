import moment, { MomentSetObject, Moment } from "moment";

export const isAfter = (value: MomentSetObject, target: MomentSetObject) => moment(value).isAfter(moment(target));

export const isSameOrAfter = (value: MomentSetObject, target: MomentSetObject) =>
	moment(value).isSameOrAfter(moment(target));

export const isBefore = (value: MomentSetObject, target: MomentSetObject) => moment(value).isBefore(moment(target));

export function isSameOrBefore(value: MomentSetObject, target: MomentSetObject) {
	return moment(value).isSameOrBefore(moment(target));
}

export function tomorrow(dateCompare: string) {
	return moment(dateCompare).isAfter(moment(), "day");
}

export function yesterday(dateCompare: string) {
	return moment(dateCompare).isBefore(moment(), "day");
}

export const today = (dateCompare: string) => moment(dateCompare).isSame(moment(), "day");

export const sameDay = (date: string) => moment(date).isSame(moment(), "day");

export function sameWeek(date: string) {
	return moment(date).isSame(moment(), "week");
}

export function sameMouth(date: string) {
	return moment(date).isSame(moment(), "month");
}

export function sameYear(date: string) {
	return moment(date).isSame(moment(), "year");
}

export type Mostring = string | Moment;

const checkMoment = (value: Mostring, mask = "Z") => {
	if (moment.isMoment(value)) {
		return value;
	}
	return moment(value, mask);
};

export function between(mask: string, init: Mostring, end: Mostring, value: Mostring) {
	return checkMoment(value, mask).isBetween(checkMoment(init, mask), checkMoment(end, mask));
}
