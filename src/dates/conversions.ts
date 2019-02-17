import moment from "moment";

export function epochToDate(epoch: number, format = "YYYY-MM-dd") {
	return moment.unix(epoch).format(format);
}

export function dateFormat(date: string, format = "DD MMM") {
	return moment(date).format(format);
}

export function timeFormat(date: string, format = "HH:MM") {
	return moment(date).format(format);
}
