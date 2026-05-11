import { describe, expect, it } from "vitest";
import { bibleBooks } from "@/lib/seed-data/books";
import { chapterContextSeeds } from "@/lib/seed-data/chapter-contexts";

describe("chapterContextSeeds", () => {
  it("generates one context per chapter in the Bible", () => {
    const totalChapters = bibleBooks.reduce((sum, book) => sum + book.chapters, 0);
    expect(chapterContextSeeds).toHaveLength(totalChapters);
  });

  it("does not generate duplicate book/chapter pairs", () => {
    const keys = chapterContextSeeds.map((seed) => `${seed.bookSlug}:${seed.chapterNumber}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("fills required editorial fields for every generated chapter", () => {
    for (const seed of chapterContextSeeds) {
      expect(seed.summary.length).toBeGreaterThan(24);
      expect(seed.author.length).toBeGreaterThan(3);
      expect(seed.historicalPeriod.length).toBeGreaterThan(8);
      expect(seed.audience.length).toBeGreaterThan(8);
      expect(seed.purpose.length).toBeGreaterThan(8);
      expect(seed.curiosities.length).toBeGreaterThan(8);
    }
  });
});
