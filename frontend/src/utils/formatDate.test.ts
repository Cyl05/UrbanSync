import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("FormatDate Tests", () => {
    it("formats standard date string correctly", () => {
        const timeString = "October 15, 2025 14:43:30";
        const formatted = formatDate(timeString);
        expect(formatted).toMatch(/October 15, 2025 at 02:43 PM/);
    });

    it("formats ISO date string correctly", () => {
        const isoDate = "2025-10-14T12:30:00Z";
        const formatted = formatDate(isoDate);
        expect(formatted).toMatch(/October 14, 2025 at \d{2}:\d{2} (AM|PM)/);
    });

    it("handles AM times correctly", () => {
        const formatted = formatDate("2025-10-15T04:15:00Z");
        expect(formatted).toMatch(/9:45 AM/);
    });

    it("handles PM times correctly", () => {
        const formatted = formatDate("2025-10-15T15:30:00Z");
        expect(formatted).toMatch(/09:00 PM/);
    });

    it("handles different months correctly", () => {
        const january = formatDate("2025-01-15T10:00:00Z");
        const december = formatDate("2025-12-25T10:00:00Z");
        expect(january).toContain("January");
        expect(december).toContain("December");
    });

    it("handles invalid date string", () => {
        const formatted = formatDate("invalid-date-string");
        expect(formatted).toContain("Invalid Date");
    });

    it("handles dates from database format (common in Hasura/Postgres)", () => {
        const dbDate = "2025-10-15T14:43:30.123456+00:00";
        const formatted = formatDate(dbDate);
        expect(formatted).toMatch(/October 15, 2025 at \d{2}:\d{2} (AM|PM)/);
    });
});