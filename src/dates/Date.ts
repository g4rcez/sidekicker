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

export type MoString = string | Moment;

const checkMoment = (value: MoString, mask = "Z") => {
	if (moment.isMoment(value)) {
		return value;
	}
	return moment(value, mask);
};

export function between(mask: string, init: MoString, end: MoString, value: MoString) {
	return checkMoment(value, mask).isBetween(checkMoment(init, mask), checkMoment(end, mask));
}

const dateHourMask = "DD/MM/YYYY HH:mm";
const dateMask = "DD/MM/YYYY";
const hourMask = "HH:mm";
const defaultMask = "ZZ";

export function toDate(date?: string, format = defaultMask, showToday = false) {
	if (date) {
		return moment(date, format).format(dateMask);
	}
	if (showToday) {
		return moment().format(dateMask);
	}
	return "";
}

export function dateHour(date?: string, format = defaultMask, showToday = false) {
	if (date) {
		return moment(date, format).format(dateHourMask);
	}
	if (showToday) {
		return moment().format(dateMask);
	}
	return moment().format(dateHourMask);
}

export function toHour(date: string, format = defaultMask, showToday = false) {
	if (date) {
		return moment(date, format).format(hourMask);
	}
	if (showToday) {
		return moment().format(dateMask);
	}
	return moment().format(hourMask);
}

export const safeDateConvert = (date: string, mask = defaultMask, errorMsg = "Não definido") => {
	const safe = moment(date);
	return safe.isValid() ? safe.format(mask) : errorMsg;
};
