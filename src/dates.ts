import { pad } from "./strings/fmt";

const getTzOffset = (date: Date) => {
    const tzOffset = -date.getTimezoneOffset();
    return (tzOffset >= 0 ? "+" : "-") + pad(tzOffset / 60) + ":" + pad(tzOffset % 60);
};

export const isoTz = (date: Date) =>
    date.getFullYear() +
    "-" + pad(date.getMonth() + 1) +
    "-" + pad(date.getDate()) +
    "T" + pad(date.getHours()) +
    ":" + pad(date.getMinutes()) +
    ":" + pad(date.getSeconds()) +
    getTzOffset(date);

export const isIsoDate = (str: string) => {
    const d = new Date(str);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === str;
};

export const isIsoTz = (str: string) => {
    const d = new Date(str);
    return !Number.isNaN(d.valueOf()) && isoTz(d) === str;
};

export const Dates = { isoTz, getTzOffset, isIsoDate, isIsoTz };