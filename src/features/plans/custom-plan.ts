export type CustomPlanBook = {
  bookId: number;
  bookName: string;
  chapters: number;
};

export type GeneratedPlanDay = {
  dayNumber: number;
  sortOrder: number;
  bookId: number;
  startChapter: number;
  endChapter: number;
  referenceLabel: string;
};

export type ChronologicalSourceSegment = {
  bookId: number;
  bookName: string;
  startChapter: number;
  endChapter: number;
  referenceLabel: string;
  sortOrder: number;
};

export type ChronologicalSourceDay = {
  dayNumber: number;
  segments: ChronologicalSourceSegment[];
};

function buildRanges(numbers: number[]): string {
  if (numbers.length === 0) return "";

  const sorted = [...numbers].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0] ?? 0;
  let previous = sorted[0] ?? 0;

  for (const current of sorted.slice(1)) {
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
  return ranges.join(", ");
}

function chaptersPerDay(totalChapters: number, durationDays: number): number[] {
  const base = Math.floor(totalChapters / durationDays);
  const remainder = totalChapters % durationDays;

  return Array.from({ length: durationDays }, (_, index) => base + (index < remainder ? 1 : 0)).map(
    (value) => Math.max(value, 1),
  );
}

export function buildTraditionalPlan(
  books: CustomPlanBook[],
  durationDays: number,
): GeneratedPlanDay[] {
  const chapterEntries = books.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      bookId: book.bookId,
      bookName: book.bookName,
      chapterNumber: index + 1,
    })),
  );

  const distribution = chaptersPerDay(chapterEntries.length, durationDays);
  const rows: GeneratedPlanDay[] = [];
  let cursor = 0;

  distribution.forEach((size, dayIndex) => {
    const dayEntries = chapterEntries.slice(cursor, cursor + size);
    cursor += size;

    const firstEntry = dayEntries[0];
    if (!firstEntry) {
      return;
    }

    let sortOrder = 1;
    let segmentStart = firstEntry;
    let previous = firstEntry;

    for (const entry of dayEntries.slice(1)) {
      const sameBook = entry.bookId === previous.bookId;
      const consecutive = entry.chapterNumber === previous.chapterNumber + 1;

      if (sameBook && consecutive) {
        previous = entry;
        continue;
      }

      rows.push({
        dayNumber: dayIndex + 1,
        sortOrder,
        bookId: segmentStart.bookId,
        startChapter: segmentStart.chapterNumber,
        endChapter: previous.chapterNumber,
        referenceLabel: `${segmentStart.bookName} ${buildRanges(
          Array.from(
            { length: previous.chapterNumber - segmentStart.chapterNumber + 1 },
            (_, index) => segmentStart.chapterNumber + index,
          ),
        )}`,
      });

      sortOrder += 1;
      segmentStart = entry;
      previous = entry;
    }

    rows.push({
      dayNumber: dayIndex + 1,
      sortOrder,
      bookId: segmentStart.bookId,
      startChapter: segmentStart.chapterNumber,
      endChapter: previous.chapterNumber,
      referenceLabel: `${segmentStart.bookName} ${buildRanges(
        Array.from(
          { length: previous.chapterNumber - segmentStart.chapterNumber + 1 },
          (_, index) => segmentStart.chapterNumber + index,
        ),
      )}`,
    });
  });

  return rows;
}

export function groupChronologicalPlanDays(
  sourceDays: ChronologicalSourceDay[],
  targetDays: number,
): GeneratedPlanDay[] {
  if (sourceDays.length === 0) return [];

  const distribution = chaptersPerDay(sourceDays.length, targetDays);
  const rows: GeneratedPlanDay[] = [];
  let cursor = 0;

  distribution.forEach((size, dayIndex) => {
    const groupedSourceDays = sourceDays.slice(cursor, cursor + size);
    cursor += size;

    let sortOrder = 1;
    groupedSourceDays.flatMap((day) => day.segments).forEach((segment) => {
      rows.push({
        dayNumber: dayIndex + 1,
        sortOrder,
        bookId: segment.bookId,
        startChapter: segment.startChapter,
        endChapter: segment.endChapter,
        referenceLabel: segment.referenceLabel,
      });
      sortOrder += 1;
    });
  });

  return rows;
}
