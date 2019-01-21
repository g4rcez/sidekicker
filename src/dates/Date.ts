import moment, { MomentSetObject } from "moment";

export function isAfter(value: string | MomentSetObject, target: string | MomentSetObject) {
    return moment(value).isAfter(moment(target));
}

export function isSameOrAfter(value: string | MomentSetObject, target: string | MomentSetObject) {
    return moment(value).isSameOrAfter(moment(target));
}

export function isBefore(value: string | MomentSetObject, target: string | MomentSetObject) {
    return moment(value).isBefore(moment(target));
}

export function isSameOrBefore(value: string | MomentSetObject, target: string | MomentSetObject) {
    return moment(value).isSameOrBefore(moment(target));
}

export function tomorrow(dateCompare: string) {
    return moment(dateCompare).isAfter(moment(), "day");
}

export function yesterday(dateCompare: string) {
    return moment(dateCompare).isBefore(moment(), "day");
}

export function today(dateCompare: string) {
    return moment(dateCompare).isSame(moment(), "day");
}

export function sameDay(date: string) {
    return moment(date).isSame(moment(), "day");
}

export function sameWeek(date: string) {
    return moment(date).isSame(moment(), "week");
}

export function sameMouth(date: string) {
    return moment(date).isSame(moment(), "month");
}

export function sameYear(date: string) {
    return moment(date).isSame(moment(), "year");
}
