type ReadingReference = {
  bookName: string;
  startChapter: number;
  endChapter?: number | null;
};

function joinChapters(startChapter: number, endChapter?: number | null): string {
  if (!endChapter || endChapter === startChapter) {
    return `${startChapter}`;
  }

  const chapters = Array.from({ length: endChapter - startChapter + 1 }, (_, index) => startChapter + index);

  if (chapters.length === 2) {
    return `${chapters[0]} e ${chapters[1]}`;
  }

  const head = chapters.slice(0, -1).join(", ");
  return `${head} e ${chapters.at(-1)}`;
}

function joinNatural(values: string[]): string {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} e ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")} e ${values.at(-1)}`;
}

export function formatReferenceLabel(readings: ReadingReference[]): string {
  const grouped = new Map<string, ReadingReference[]>();

  for (const reading of readings) {
    const current = grouped.get(reading.bookName) ?? [];
    current.push(reading);
    grouped.set(reading.bookName, current);
  }

  const formattedGroups = Array.from(grouped.entries()).map(([bookName, items]) => {
    const chapterLabels = items.map((item) => joinChapters(item.startChapter, item.endChapter));
    return `${bookName} ${joinNatural(chapterLabels)}`;
  });

  return joinNatural(formattedGroups);
}

export function formatDailyMessage(date: Date, readings: ReadingReference[]): string {
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

  return `A paz de Deus, Hoje - ${dateLabel} - ${formatReferenceLabel(readings)}.\n\nDeus abençoe.`;
}
