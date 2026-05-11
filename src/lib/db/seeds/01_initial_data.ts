import type { Knex } from "knex";
import { bibleBooks } from "@/lib/seed-data/books";
import { hashPassword } from "@/lib/auth/password";
import { env } from "@/lib/env.server";

type ChapterSegment = {
  slug: string;
  startChapter: number;
  endChapter: number;
};

const chronologicalPlan = [
  "Genesis 1-3",
  "Genesis 4-7",
  "Genesis 8-11",
  "Job 1-5",
  "Job 6-9",
  "Job 10-13",
  "Job 14-16",
  "Job 17-20",
  "Job 21-23",
  "Job 24-28",
  "Job 29-31",
  "Job 32-34",
  "Job 35-37",
  "Job 38-39",
  "Job 40-42",
  "Genesis 12-15",
  "Genesis 16-18",
  "Genesis 19-21",
  "Genesis 22-24",
  "Genesis 25-26",
  "Genesis 27-29",
  "Genesis 30-31",
  "Genesis 32-34",
  "Genesis 35-37",
  "Genesis 38-40",
  "Genesis 41-42",
  "Genesis 43-45",
  "Genesis 46-47",
  "Genesis 48-50",
  "Exodus 1-3",
  "Exodus 4-6",
  "Exodus 7-9",
  "Exodus 10-12",
  "Exodus 13-15",
  "Exodus 16-18",
  "Exodus 19-21",
  "Exodus 22-24",
  "Exodus 25-27",
  "Exodus 28-29",
  "Exodus 30-32",
  "Exodus 33-35",
  "Exodus 36-38",
  "Exodus 39-40",
  "Leviticus 1-4",
  "Leviticus 5-7",
  "Leviticus 8-10",
  "Leviticus 11-13",
  "Leviticus 14-15",
  "Leviticus 16-18",
  "Leviticus 19-21",
  "Leviticus 22-23",
  "Leviticus 24-25",
  "Leviticus 26-27",
  "Numbers 1-2",
  "Numbers 3-4",
  "Numbers 5-6",
  "Numbers 7",
  "Numbers 8-10",
  "Numbers 11-13",
  "Numbers 14-15; Psalm 90",
  "Numbers 16-17",
  "Numbers 18-20",
  "Numbers 21-22",
  "Numbers 23-25",
  "Numbers 26-27",
  "Numbers 28-30",
  "Numbers 31-32",
  "Numbers 33-34",
  "Numbers 35-36",
  "Deuteronomy 1-2",
  "Deuteronomy 3-4",
  "Deuteronomy 5-7",
  "Deuteronomy 8-10",
  "Deuteronomy 11-13",
  "Deuteronomy 14-16",
  "Deuteronomy 17-20",
  "Deuteronomy 21-23",
  "Deuteronomy 24-27",
  "Deuteronomy 28-29",
  "Deuteronomy 30-31",
  "Deuteronomy 32-34; Psalm 91",
  "Joshua 1-4",
  "Joshua 5-8",
  "Joshua 9-11",
  "Joshua 12-15",
  "Joshua 16-18",
  "Joshua 19-21",
  "Joshua 22-24",
  "Judges 1-2",
  "Judges 3-5",
  "Judges 6-7",
  "Judges 8-9",
  "Judges 10-12",
  "Judges 13-15",
  "Judges 16-18",
  "Judges 19-21",
  "Ruth 1-4",
  "1 Samuel 1-3",
  "1 Samuel 4-8",
  "1 Samuel 9-12",
  "1 Samuel 13-14",
  "1 Samuel 15-17",
  "1 Samuel 18-20; Psalm 11, 59",
  "1 Samuel 21-24",
  "Psalm 7, 27, 31, 34, 52",
  "Psalm 56, 120, 140-142",
  "1 Samuel 25-27",
  "Psalm 17, 35, 54, 63",
  "1 Samuel 28-31; Psalm 18",
  "Psalm 121, 123-125, 128-130",
  "2 Samuel 1-4",
  "Psalm 6, 8-10, 14, 16, 19, 21",
  "1 Chronicles 1-2",
  "Psalm 43-45, 49, 84-85, 87",
  "1 Chronicles 3-5",
  "Psalm 73, 77-78",
  "1 Chronicles 6",
  "Psalm 81, 88, 92-93",
  "1 Chronicles 7-10",
  "Psalm 102-104",
  "2 Samuel 5:1-10; 1 Chronicles 11-12",
  "Psalm 133",
  "Psalm 106-107",
  "2 Samuel 5:11-25; 2 Samuel 6:1-23; 1 Chronicles 13-16",
  "Psalm 1-2, 15, 22-24, 47, 68",
  "Psalm 89, 96, 100, 101, 105, 132",
  "2 Samuel 7; 1 Chronicles 17",
  "Psalm 25, 29, 33, 36, 39",
  "2 Samuel 8-9; 1 Chronicles 18",
  "Psalm 50, 53, 60, 75",
  "2 Sam10; 1 Chronicles 19; Psalm 20",
  "Psalm 65-67, 69-70",
  "2 Samuel 11-12; 1 Chronicles 20",
  "Psalm 32, 51, 86, 122",
  "2 Samuel 13-15",
  "Psalm 3-4, 12-13, 28, 55",
  "2 Samuel 16-18",
  "Psalm 26, 40, 58, 61-62, 64",
  "2 Samuel 19-21",
  "Psalm 5, 38, 41-42",
  "2 Samuel 22-23; Psalm 57",
  "Psalm 95, 97-99",
  "2 Samuel 24; 1 Chronicles 21-22; Psalm 30",
  "Psalm 108-110",
  "1 Chronicles 23-25",
  "Psalm 131, 138-139, 143-145",
  "1 Chronicles 26-29; Psalm 127",
  "Psalm 111-118",
  "1 Kings 1-2; Psalm 37, 71, 94",
  "Psalm 119:1-88",
  "1 Kings 3-4; 2 Chronicles 1; Psalm 72",
  "Psalm 119:89-176",
  "Song of Solomon 1-8",
  "Proverbs 1-3",
  "Proverbs 4-6",
  "Proverbs 7-9",
  "Proverbs 10-12",
  "Proverbs 13-15",
  "Proverbs 16-18",
  "Proverbs 19-21",
  "Proverbs 22-24",
  "1 Kings 5-6; 2 Chronicles 2-3",
  "1 Kings 7; 2 Chronicles 4",
  "1 Kings 8; 2 Chronicles 5",
  "2 Chronicles 6-7; Psalm 136",
  "Psalm 134, 146-150",
  "1 Kings 9; 2 Chronicles 8",
  "Proverbs 25-26",
  "Proverbs 27-29",
  "Ecclesiastes 1-6",
  "Ecclesiastes 7-12",
  "1 Kings 10-11; 2 Chronicles 9",
  "Proverbs 30-31",
  "1 Kings 12-14",
  "2 Chronicles 10-12",
  "1 Kings 15:1-24; 2 Chronicles 13-16",
  "1 Kings 15:25-34; 1 Kings 16:1-34; 2 Chronicles 17",
  "1 Kings 17-19",
  "1 Kings 20-21",
  "1 Kings 22; 2 Chronicles 18",
  "2 Chronicles 19-23",
  "Obadiah; Psalm 82-83",
  "2 Kings 1-4",
  "2 Kings 5-8",
  "2 Kings 9-11",
  "2 Kings 12-13; 2 Chronicles 24",
  "2 Kings 14; 2 Chronicles 25",
  "Jonah 1-4",
  "2 Kings 15; 2 Chronicles 26",
  "Isaiah 1-4",
  "Isaiah 5-8",
  "Amos 1-5",
  "Amos 6-9",
  "2 Chronicles 27; Isaiah 9-12",
  "Micah 1-7",
  "2 Chronicles 28; 2 Kings 16-17",
  "Isaiah 13-17",
  "Isaiah 18-22",
  "Isaiah 23-27",
  "2 Kings 18:1-8; 2 Chronicles 29-31; Psalm 48",
  "Hosea 1-7",
  "Hosea 8-14",
  "Isaiah 28-30",
  "Isaiah 31-34",
  "Isaiah 35-36",
  "Isaiah 37-39; Psalm 76",
  "Isaiah 40-43",
  "Isaiah 44-48",
  "2 Kings 18:9-37; 2 Kings 19:1-37; Psalm 46, 80, 135",
  "Isaiah 49-53",
  "Isaiah 54-58",
  "Isaiah 59-63",
  "Isaiah 64-66",
  "2 Kings 20-21",
  "2 Chronicles 32-33",
  "Nahum 1-3",
  "2 Kings 22-23; 2 Chronicles 34-35",
  "Zephaniah 1-3",
  "Jeremiah 1-3",
  "Jeremiah 4-6",
  "Jeremiah 7-9",
  "Jeremiah 10-13",
  "Jeremiah 14-17",
  "Jeremiah 18-22",
  "Jeremiah 23-25",
  "Jeremiah 26-29",
  "Jeremiah 30-31",
  "Jeremiah 32-34",
  "Jeremiah 35-37",
  "Jeremiah 38-40; Psalm 74, 79",
  "2 Kings 24-25; 2 Chronicles 36",
  "Habakkuk 1-3",
  "Jeremiah 41-45",
  "Jeremiah 46-48",
  "Jeremiah 49-50",
  "Jeremiah 51-52",
  "Lamentations 1; Lamentations 2; Lamentations 3:1-36",
  "Lamentations 3:37-66; Lamentations 4; Lamentations 5:1-22",
  "Ezekiel 1-4",
  "Ezekiel 5-8",
  "Ezekiel 9-12",
  "Ezekiel 13-15",
  "Ezekiel 16-17",
  "Ezekiel 18-19",
  "Ezekiel 20-21",
  "Ezekiel 22-23",
  "Ezekiel 24-27",
  "Ezekiel 28-31",
  "Ezekiel 32-34",
  "Ezekiel 35-37",
  "Ezekiel 38-39",
  "Ezekiel 40-41",
  "Ezekiel 42-43",
  "Ezekiel 44-45",
  "Ezekiel 46-48",
  "Joel 1-3",
  "Daniel 1-3",
  "Daniel 4-6",
  "Daniel 7-9",
  "Daniel 10-12",
  "Ezra 1-3",
  "Ezra 4-6; Psalm 137",
  "Haggai 1-2",
  "Zechariah 1-7",
  "Zechariah 8-14",
  "Esther 1-5",
  "Esther 6-10",
  "Ezra 7-10",
  "Nehemiah 1-5",
  "Nehemiah 6-7",
  "Nehemiah 8-10",
  "Nehemiah 11-13; Psalm 126",
  "Malachi 1-4",
  "Luke 1; John 1:1-14",
  "Matthew 1; Luke 2:1-38",
  "Matthew 2; Luke 2:39-52",
  "Matthew 3; Mark 1; Luke 3",
  "Matthew 4; Luke 4-5; John 1:15-51",
  "John 2-4",
  "Mark 2",
  "John 5",
  "Matthew 12:1-21; Mark 3; Luke 6",
  "Matthew 5-7",
  "Matthew 8:1-13; Luke 7",
  "Matthew 11",
  "Matthew 12:22-50; Luke 11",
  "Matthew 13; Luke 8",
  "Matthew 8:14-34; Mark 4-5",
  "Matthew 9-10",
  "Matthew 14; Mark 6; Luke 9:1-17",
  "John 6",
  "Matthew 15; Mark 7",
  "Matthew 16; Mark 8; Luke 9:18-27",
  "Matthew 17; Mark 9; Luke 9:28-62",
  "Matthew 18",
  "John 7-8",
  "John 9:1-41; John 10:1-21",
  "Luke 10-11; John 10:22-42",
  "Luke 12-13",
  "Luke 14-15",
  "Luke 16; Luke 17:1-10",
  "John 11",
  "Luke 17:11-37; Luke 18:1-14",
  "Matthew 19; Mark 10",
  "Matthew 20-21",
  "Luke 18:15-43; Luke 19:1-48",
  "Mark 11; John 12",
  "Matthew 22; Mark 12",
  "Matthew 23; Luke 20-21",
  "Mark 13",
  "Matthew 24",
  "Matthew 25",
  "Matthew 26; Mark 14",
  "Luke 22; John 13",
  "John 14-17",
  "Matthew 27; Mark 15",
  "Luke 23; John 18-19",
  "Matthew 28; Mark 16",
  "Luke 24; John 20-21",
  "Acts 1-3",
  "Acts 4-6",
  "Acts 7-8",
  "Acts 9-10",
  "Acts 11-12",
  "Acts 13-14",
  "James 1-5",
  "Acts 15-16",
  "Galatians 1-3",
  "Galatians 4-6",
  "Acts 17; Acts 18:1-18",
  "1 Thessalonians 1-5; 2 Thessalonians 1-3",
  "Acts 18:19-28; Acts 19:1-41",
  "1 Corinthians 1-4",
  "1 Corinthians 5-8",
  "1 Corinthians 9-11",
  "1 Corinthians 12-14",
  "1 Corinthians 15-16",
  "2 Corinthians 1-4",
  "2 Corinthians 5-9",
  "2 Corinthians 10-13",
  "Acts 20:1-3; Romans 1-3",
  "Romans 4-7",
  "Romans 8-10",
  "Romans 11-13",
  "Romans 14-16",
  "Acts 20:4-38; Acts 21; Acts 22; Acts 23:1-35",
  "Acts 24-26",
  "Acts 27-28",
  "Colossians 1-4; Philemon",
  "Ephesians 1-6",
  "Philippians 1-4",
  "1 Timothy 1-6",
  "Titus 1-3",
  "1 Peter 1-5",
  "Hebrews 1-6",
  "Hebrews 7-10",
  "Hebrews 11-13",
  "2 Timothy 1-4",
  "2 Peter 1-3; Jude",
  "1 John 1-5",
  "2 John; 3 John",
  "Revelation 1-5",
  "Revelation 6-11",
  "Revelation 12-18",
  "Revelation 19-22",
];

const englishToSlug: Record<string, string> = {
  Genesis: "genesis",
  Exodus: "exodo",
  Leviticus: "levitico",
  Numbers: "numeros",
  Deuteronomy: "deuteronomio",
  Joshua: "josue",
  Judges: "juizes",
  Ruth: "rute",
  "1 Samuel": "1-samuel",
  "2 Samuel": "2-samuel",
  "1 Kings": "1-reis",
  "2 Kings": "2-reis",
  "1 Chronicles": "1-cronicas",
  "2 Chronicles": "2-cronicas",
  Ezra: "esdras",
  Nehemiah: "neemias",
  Esther: "ester",
  Job: "jo",
  Psalm: "salmos",
  Psalms: "salmos",
  Proverbs: "proverbios",
  Ecclesiastes: "eclesiastes",
  "Song of Solomon": "canticos",
  Isaiah: "isaias",
  Jeremiah: "jeremias",
  Lamentations: "lamentacoes",
  Ezekiel: "ezequiel",
  Daniel: "daniel",
  Hosea: "oseias",
  Joel: "joel",
  Amos: "amos",
  Obadiah: "obadias",
  Jonah: "jonas",
  Micah: "miqueias",
  Nahum: "naum",
  Habakkuk: "habacuque",
  Zephaniah: "sofonias",
  Haggai: "ageu",
  Zechariah: "zacarias",
  Malachi: "malaquias",
  Matthew: "mateus",
  Mark: "marcos",
  Luke: "lucas",
  John: "joao",
  Acts: "atos",
  Romans: "romanos",
  "1 Corinthians": "1-corintios",
  "2 Corinthians": "2-corintios",
  Galatians: "galatas",
  Ephesians: "efesios",
  Philippians: "filipenses",
  Colossians: "colossenses",
  "1 Thessalonians": "1-tessalonicenses",
  "2 Thessalonians": "2-tessalonicenses",
  "1 Timothy": "1-timoteo",
  "2 Timothy": "2-timoteo",
  Titus: "tito",
  Philemon: "filemom",
  Hebrews: "hebreus",
  James: "tiago",
  "1 Peter": "1-pedro",
  "2 Peter": "2-pedro",
  "1 John": "1-joao",
  "2 John": "2-joao",
  "3 John": "3-joao",
  Jude: "judas",
  Revelation: "apocalipse",
};

function normalizeSegment(segment: string): string {
  return segment.replace(/^2 Sam(\d+)/, "2 Samuel $1").trim();
}

function parseToken(token: string): { start: number; end: number } {
  const cleanToken = token.trim().replace(/\.$/, "");

  const chapterOnly = cleanToken.match(/^(\d+)$/);
  if (chapterOnly) {
    const chapter = Number(chapterOnly[1]);
    return { start: chapter, end: chapter };
  }

  const chapterRange = cleanToken.match(/^(\d+)-(\d+)$/);
  if (chapterRange) {
    return { start: Number(chapterRange[1]), end: Number(chapterRange[2]) };
  }

  const chapterWithVerseRange = cleanToken.match(/^(\d+):\d+-\d+$/);
  if (chapterWithVerseRange) {
    const chapter = Number(chapterWithVerseRange[1]);
    return { start: chapter, end: chapter };
  }

  const multiChapterWithVerseRange = cleanToken.match(/^(\d+):\d+-(\d+):\d+$/);
  if (multiChapterWithVerseRange) {
    return { start: Number(multiChapterWithVerseRange[1]), end: Number(multiChapterWithVerseRange[2]) };
  }

  return { start: 1, end: 1 };
}

function parseChronologicalReading(reading: string): ChapterSegment[] {
  const bookNames = Object.keys(englishToSlug).sort((a, b) => b.length - a.length);
  const segments: ChapterSegment[] = [];

  for (const rawPart of reading.split(";")) {
    let part = normalizeSegment(rawPart);
    let currentBook: string | null = null;

    for (const bookName of bookNames) {
      if (part.startsWith(bookName)) {
        currentBook = bookName;
        part = part.slice(bookName.length).trim();
        break;
      }
    }

    const tokens = part.length > 0 ? part.split(",").map((item) => item.trim()) : [""];

    for (const token of tokens) {
      const effectiveBook = currentBook ?? "Obadiah";
      const slug = englishToSlug[effectiveBook];
      if (!slug) continue;

      const chapterRange = token ? parseToken(token) : { start: 1, end: 1 };
      segments.push({
        slug,
        startChapter: chapterRange.start,
        endChapter: chapterRange.end,
      });
    }
  }

  return segments;
}

function mergeSegments(segments: ChapterSegment[]): ChapterSegment[] {
  const merged: ChapterSegment[] = [];

  for (const segment of segments) {
    const last = merged.at(-1);
    if (last && last.slug === segment.slug && last.endChapter + 1 >= segment.startChapter) {
      last.endChapter = Math.max(last.endChapter, segment.endChapter);
      continue;
    }
    merged.push({ ...segment });
  }

  return merged;
}

function buildTraditional365Plan(): ChapterSegment[][] {
  const chapterSequence = bibleBooks.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      slug: book.slug,
      chapter: index + 1,
    })),
  );

  const days: ChapterSegment[][] = [];
  let cursor = 0;

  for (let day = 1; day <= 365; day += 1) {
    const remainingChapters = chapterSequence.length - cursor;
    const remainingDays = 366 - day;
    const groupSize = Math.ceil(remainingChapters / remainingDays);
    const slice = chapterSequence.slice(cursor, cursor + groupSize);
    cursor += groupSize;

    const merged: ChapterSegment[] = [];
    for (const item of slice) {
      const last = merged.at(-1);
      if (last && last.slug === item.slug && last.endChapter + 1 === item.chapter) {
        last.endChapter = item.chapter;
      } else {
        merged.push({ slug: item.slug, startChapter: item.chapter, endChapter: item.chapter });
      }
    }
    days.push(merged);
  }

  return days;
}

function buildNewTestamentDailyPlan(): ChapterSegment[][] {
  const books = bibleBooks.filter((book) => book.testament === "new");
  return books.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => [
      { slug: book.slug, startChapter: index + 1, endChapter: index + 1 },
    ]),
  );
}

function referenceLabel(bookName: string, startChapter: number, endChapter: number): string {
  if (startChapter === endChapter) {
    return `${bookName} ${startChapter}`;
  }
  return `${bookName} ${startChapter} a ${endChapter}`;
}

export async function seed(knex: Knex): Promise<void> {
  await knex("group_share_logs").del();
  await knex("daily_messages").del();
  await knex("groups").del();
  await knex("chapter_notes").del();
  await knex("reading_progress").del();
  await knex("user_plans").del();
  await knex("plan_days").del();
  await knex("plan_templates").del();
  await knex("verse_texts").del();
  await knex("verses").del();
  await knex("chapters").del();
  await knex("books").del();
  await knex("translations").del();
  await knex("users").del();

  const [translationIdRow] = await knex("translations")
    .insert([{ code: "demo", name: "Tradução de demonstração", is_active: true }])
    .returning<{ id: number }[]>("id");
  if (!translationIdRow) {
    throw new Error("Failed to seed default translation");
  }
  const translationId = translationIdRow.id;

  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const [adminUser] = await knex("users")
    .insert([
      { name: "Daniel Admin", email: env.ADMIN_EMAIL, password_hash: adminPassword, role: "admin" },
      { name: "Usuário Demo", email: "user@bibleapp.local", password_hash: userPassword, role: "user" },
    ])
    .returning<{ id: string; email: string }[]>(["id", "email"]);

  const insertedBooks = await knex("books")
    .insert(
      bibleBooks.map((book, index) => ({
        slug: book.slug,
        name: book.name,
        abbreviation: book.abbreviation,
        testament: book.testament,
        canonical_order: index + 1,
      })),
    )
    .returning<{ id: number; slug: string; name: string }[]>(["id", "slug", "name"]);

  const bookBySlug = new Map(insertedBooks.map((book) => [book.slug, book]));
  const chapterRows = bibleBooks.flatMap((book) => {
    const bookId = bookBySlug.get(book.slug)?.id;
    if (!bookId) return [];

    return Array.from({ length: book.chapters }, (_, index) => ({
      book_id: bookId,
      chapter_number: index + 1,
    }));
  });

  const insertedChapters = await knex("chapters")
    .insert(chapterRows)
    .returning<{ id: number; book_id: number; chapter_number: number }[]>([
      "id",
      "book_id",
      "chapter_number",
    ]);

  const chapterIdByBookAndNumber = new Map(
    insertedChapters.map((chapter) => [`${chapter.book_id}:${chapter.chapter_number}`, chapter.id]),
  );

  const verseRows = insertedChapters.flatMap((chapter) =>
    [1, 2, 3].map((verseNumber) => ({
      chapter_id: chapter.id,
      verse_number: verseNumber,
    })),
  );

  const insertedVerses = await knex("verses")
    .insert(verseRows)
    .returning<{ id: number; chapter_id: number; verse_number: number }[]>([
      "id",
      "chapter_id",
      "verse_number",
    ]);

  await knex("verse_texts").insert(
    insertedVerses.map((verse) => {
      const chapter = insertedChapters.find((item) => item.id === verse.chapter_id);
      const book = chapter ? insertedBooks.find((item) => item.id === chapter.book_id) : null;
      return {
        translation_id: translationId,
        verse_id: verse.id,
        text: `Conteúdo de demonstração para ${book?.name ?? "Livro"} ${chapter?.chapter_number ?? 1}, versículo ${verse.verse_number}. Substitua por uma tradução licenciada para uso real.`,
      };
    }),
  );

  const templates = await knex("plan_templates")
    .insert([
      {
        slug: "new-testament-daily",
        name: "Novo Testamento 1 capítulo por dia",
        description: "Leitura linear do Novo Testamento com 1 capítulo por dia.",
        duration_days: 260,
        plan_type: "new_testament",
      },
      {
        slug: "traditional-365",
        name: "Leitura bíblica tradicional em 365 dias",
        description: "Plano anual em ordem tradicional, distribuindo os capítulos ao longo do ano.",
        duration_days: 365,
        plan_type: "traditional",
      },
      {
        slug: "chronological-365",
        name: "Leitura cronológica da Bíblia em 365 dias",
        description: "Estrutura cronológica baseada na ordem dos eventos bíblicos.",
        duration_days: 365,
        plan_type: "chronological",
      },
    ])
    .returning<{ id: number; slug: string }[]>(["id", "slug"]);

  const templatesBySlug = new Map(templates.map((template) => [template.slug, template.id]));

  const ntDaily = buildNewTestamentDailyPlan();
  const traditional = buildTraditional365Plan();
  const chronological = chronologicalPlan.map((entry) => mergeSegments(parseChronologicalReading(entry)));

  const planDayRows = [
    ...ntDaily.flatMap((segments, index) =>
      segments.map((segment, segmentIndex) => {
        const book = bookBySlug.get(segment.slug);
        return {
          plan_template_id: templatesBySlug.get("new-testament-daily"),
          day_number: index + 1,
          sort_order: segmentIndex + 1,
          book_id: book?.id,
          start_chapter: segment.startChapter,
          end_chapter: segment.endChapter,
          start_verse: null,
          end_verse: null,
          reference_label: referenceLabel(book?.name ?? segment.slug, segment.startChapter, segment.endChapter),
        };
      }),
    ),
    ...traditional.flatMap((segments, index) =>
      segments.map((segment, segmentIndex) => {
        const book = bookBySlug.get(segment.slug);
        return {
          plan_template_id: templatesBySlug.get("traditional-365"),
          day_number: index + 1,
          sort_order: segmentIndex + 1,
          book_id: book?.id,
          start_chapter: segment.startChapter,
          end_chapter: segment.endChapter,
          start_verse: null,
          end_verse: null,
          reference_label: referenceLabel(book?.name ?? segment.slug, segment.startChapter, segment.endChapter),
        };
      }),
    ),
    ...chronological.flatMap((segments, index) =>
      segments.map((segment, segmentIndex) => {
        const book = bookBySlug.get(segment.slug);
        return {
          plan_template_id: templatesBySlug.get("chronological-365"),
          day_number: index + 1,
          sort_order: segmentIndex + 1,
          book_id: book?.id,
          start_chapter: segment.startChapter,
          end_chapter: segment.endChapter,
          start_verse: null,
          end_verse: null,
          reference_label: referenceLabel(book?.name ?? segment.slug, segment.startChapter, segment.endChapter),
        };
      }),
    ),
  ].filter((row): row is NonNullable<typeof row> => Boolean(row.book_id && row.plan_template_id));

  await knex("plan_days").insert(planDayRows);

  const markBookId = bookBySlug.get("marcos")?.id;
  const mark3ChapterId = markBookId ? chapterIdByBookAndNumber.get(`${markBookId}:3`) : null;
  if (adminUser?.id && markBookId && mark3ChapterId) {
    await knex("user_plans").insert({
      user_id: adminUser.id,
      plan_template_id: templatesBySlug.get("chronological-365"),
      start_date: new Date().toISOString().slice(0, 10),
      current_day: 1,
      status: "active",
    });

    await knex("reading_progress").insert({
      user_id: adminUser.id,
      book_id: markBookId,
      chapter_id: mark3ChapterId,
      source: "plan",
    });

    await knex("groups").insert([
      { user_id: adminUser.id, name: "Família", sort_order: 1, is_favorite: true },
      { user_id: adminUser.id, name: "Leitura Bíblica", sort_order: 2, is_favorite: true },
    ]);
  }
}
