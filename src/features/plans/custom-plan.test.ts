import { describe, expect, it } from "vitest";
import { buildTraditionalPlan, groupChronologicalPlanDays } from "@/features/plans/custom-plan";

describe("buildTraditionalPlan", () => {
  it("distributes chapters across days preserving chapter order", () => {
    const rows = buildTraditionalPlan(
      [
        { bookId: 1, bookName: "Gênesis", chapters: 3 },
        { bookId: 2, bookName: "Êxodo", chapters: 2 },
      ],
      2,
    );

    expect(rows).toEqual([
      {
        dayNumber: 1,
        sortOrder: 1,
        bookId: 1,
        startChapter: 1,
        endChapter: 3,
        referenceLabel: "Gênesis 1-3",
      },
      {
        dayNumber: 2,
        sortOrder: 1,
        bookId: 2,
        startChapter: 1,
        endChapter: 2,
        referenceLabel: "Êxodo 1-2",
      },
    ]);
  });
});

describe("groupChronologicalPlanDays", () => {
  it("regroups source days while keeping segment order", () => {
    const rows = groupChronologicalPlanDays(
      [
        {
          dayNumber: 1,
          segments: [{ bookId: 1, bookName: "Gênesis", startChapter: 1, endChapter: 1, referenceLabel: "Gênesis 1", sortOrder: 1 }],
        },
        {
          dayNumber: 2,
          segments: [{ bookId: 1, bookName: "Gênesis", startChapter: 2, endChapter: 3, referenceLabel: "Gênesis 2-3", sortOrder: 1 }],
        },
        {
          dayNumber: 3,
          segments: [{ bookId: 2, bookName: "Êxodo", startChapter: 1, endChapter: 2, referenceLabel: "Êxodo 1-2", sortOrder: 1 }],
        },
      ],
      2,
    );

    expect(rows).toEqual([
      {
        dayNumber: 1,
        sortOrder: 1,
        bookId: 1,
        startChapter: 1,
        endChapter: 1,
        referenceLabel: "Gênesis 1",
      },
      {
        dayNumber: 1,
        sortOrder: 2,
        bookId: 1,
        startChapter: 2,
        endChapter: 3,
        referenceLabel: "Gênesis 2-3",
      },
      {
        dayNumber: 2,
        sortOrder: 1,
        bookId: 2,
        startChapter: 1,
        endChapter: 2,
        referenceLabel: "Êxodo 1-2",
      },
    ]);
  });
});
