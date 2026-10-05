import { describe, expect, it } from "vite-plus/test";
import { Dates, isIsoDate, isIsoTz, isoTz } from "../src";

describe("date utilities", () => {
    it("formats a local date with its timezone and recognizes the result", () => {
        const date = new Date(2024, 1, 3, 4, 5, 6);
        const formatted = isoTz(date);

        expect(formatted).toBe(`2024-02-03T04:05:06${Dates.getTzOffset(date)}`);
        expect(isIsoTz(formatted)).toBe(true);
        expect(isIsoTz("not-a-date")).toBe(false);
    });

    it("formats timezone offsets on either side of UTC", () => {
        expect(Dates.getTzOffset({ getTimezoneOffset: () => 120 } as Date)).toBe("-02:00");
        expect(Dates.getTzOffset({ getTimezoneOffset: () => -330 } as Date)).toBe("+05:30");
    });

    it("accepts only canonical ISO date strings", () => {
        expect(isIsoDate("2024-02-03T04:05:06.000Z")).toBe(true);
        expect(isIsoDate("2024-02-03")).toBe(false);
        expect(isIsoDate("not-a-date")).toBe(false);
    });
});
