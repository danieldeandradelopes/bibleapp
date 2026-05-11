import { describe, expect, it } from "vitest";
import { formatDailyMessage, formatReferenceLabel } from "@/features/share/format-message";

describe("formatReferenceLabel", () => {
  it("formats multiple chapters from the same book naturally", () => {
    expect(
      formatReferenceLabel([
        { bookName: "Marcos", startChapter: 3, endChapter: 3 },
        { bookName: "Marcos", startChapter: 4, endChapter: 4 },
        { bookName: "Marcos", startChapter: 5, endChapter: 5 },
      ]),
    ).toBe("Marcos 3, 4 e 5");
  });

  it("formats different books with conjunction", () => {
    expect(
      formatReferenceLabel([
        { bookName: "Mateus", startChapter: 12, endChapter: 12 },
        { bookName: "Lucas", startChapter: 6, endChapter: 6 },
      ]),
    ).toBe("Mateus 12 e Lucas 6");
  });
});

describe("formatDailyMessage", () => {
  it("uses the date and reference label in the share template", () => {
    const message = formatDailyMessage(new Date("2026-05-11T10:00:00.000Z"), [
      { bookName: "Marcos", startChapter: 3, endChapter: 5 },
    ]);

    expect(message).toContain("Hoje - 11/05 - Marcos 3, 4 e 5.");
    expect(message).toContain("Deus abençoe.");
  });
});
