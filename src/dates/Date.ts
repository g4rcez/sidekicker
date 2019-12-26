import dayjs, { Dayjs } from "dayjs";
import isSameOrAfterPlugin from "dayjs/plugin/isSameOrAfter";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";
import isBetweenPlugin from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrAfterPlugin);
dayjs.extend(isSameOrBeforePlugin);
dayjs.extend(isBetweenPlugin);
export const isAfter = (value: Dayjs, target: Dayjs) => dayjs(value).isAfter(dayjs(target));

export const isSameOrAfter = (value: Dayjs, target: Dayjs) => dayjs(value).isSameOrAfter(dayjs(target));

export const isBefore = (value: Dayjs, target: Dayjs) => dayjs(value).isBefore(dayjs(target));

export function isSameOrBefore(value: Dayjs, target: Dayjs) {
	return dayjs(value).isSameOrBefore(dayjs(target));
}

export function tomorrow(dateCompare: string) {
	return dayjs(dateCompare).isAfter(dayjs(), "day");
}

export function yesterday(dateCompare: string) {
	return dayjs(dateCompare).isBefore(dayjs(), "day");
}

export const today = (dateCompare: string) => dayjs(dateCompare).isSame(dayjs(), "day");

export const sameDay = (date: string) => dayjs(date).isSame(dayjs(), "day");

export function sameWeek(date: string) {
	return dayjs(date).isSame(dayjs(), "week");
}

export function sameMouth(date: string) {
	return dayjs(date).isSame(dayjs(), "month");
}

export function sameYear(date: string) {
	return dayjs(date).isSame(dayjs(), "year");
}

export type MoString = string | Dayjs;

const checkDate = (value: MoString, mask = "Z") => {
	if (dayjs.isDayjs(value)) {
		return value;
	}
	return dayjs(value, mask);
};

export function between(mask: string, init: MoString, end: MoString, value: MoString) {
	return checkDate(value, mask).isBetween(checkDate(init, mask), checkDate(end, mask));
}

const dateHourMask = "DD/MM/YYYY HH:mm";
const dateMask = "DD/MM/YYYY";
const hourMask = "HH:mm";
const defaultMask = "ZZ";

export function toDate(date?: string, format = defaultMask, showToday = false) {
	if (date) {
		return dayjs(date, format).format(dateMask);
	}
	if (showToday) {
		return dayjs().format(dateMask);
	}
	return "";
}

export function dateHour(date?: string, format = defaultMask, showToday = false) {
	if (date) {
		return dayjs(date, format).format(dateHourMask);
	}
	if (showToday) {
		return dayjs().format(dateMask);
	}
	return dayjs().format(dateHourMask);
}

export function toHour(date: string, format = defaultMask, showToday = false) {
	if (date) {
		return dayjs(date, format).format(hourMask);
	}
	if (showToday) {
		return dayjs().format(dateMask);
	}
	return dayjs().format(hourMask);
}

export const safeDateConvert = (date: string, mask = defaultMask, errorMsg = "Não definido") => {
	const safe = dayjs(date);
	return safe.isValid() ? safe.format(mask) : errorMsg;
};
