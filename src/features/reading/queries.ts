import "server-only";

import { unstable_cache } from "next/cache";
import { resolvePreferredTranslation } from "@/features/reading/translations";
import { db } from "@/lib/db/knex";

const STATIC_REVALIDATE_SECONDS = 60 * 60;

const getCanonicalBooks = unstable_cache(
  async () => {
    const rows = await db("books")
      .select("id", "slug", "name", "abbreviation", "testament", "canonical_order")
      .orderBy("canonical_order", "asc");

    return rows.map((book) => ({
      id: Number(book.id),
      slug: String(book.slug),
      name: String(book.name),
      abbreviation: String(book.abbreviation),
      testament: String(book.testament),
      canonicalOrder: Number(book.canonical_order),
    }));
  },
  ["reading-canonical-books"],
  { revalidate: STATIC_REVALIDATE_SECONDS },
);

const getChapterCountMap = unstable_cache(
  async () => {
    const chapterCounts = await db("chapters")
      .select("book_id")
      .count<{ book_id: number; total: string }[]>("id as total")
      .groupBy("book_id");

    return chapterCounts.map((row) => ({
      bookId: Number(row.book_id),
      total: Number(row.total),
    }));
  },
  ["reading-chapter-counts"],
  { revalidate: STATIC_REVALIDATE_SECONDS },
);

const getTotalChapterCount = unstable_cache(
  async () => {
    const row = await db("chapters").count<{ total: string }[]>("id as total").first();
    return Number(row?.total ?? 0);
  },
  ["reading-total-chapter-count"],
  { revalidate: STATIC_REVALIDATE_SECONDS },
);

const getBookWithChaptersStatic = unstable_cache(
  async (bookSlug: string) => {
    const book = await db("books")
      .select("id", "slug", "name", "abbreviation", "testament", "canonical_order")
      .where({ slug: bookSlug })
      .first<{
        id: number;
        slug: string;
        name: string;
        abbreviation: string;
        testament: string;
        canonical_order: number;
      }>();

    if (!book) return null;

    const chapters = await db("chapters")
      .select("id", "chapter_number")
      .where({ book_id: book.id })
      .orderBy("chapter_number", "asc");

    return {
      id: Number(book.id),
      slug: String(book.slug),
      name: String(book.name),
      abbreviation: String(book.abbreviation),
      testament: String(book.testament),
      canonicalOrder: Number(book.canonical_order),
      chapters: chapters.map((chapter) => ({
        id: Number(chapter.id),
        chapterNumber: Number(chapter.chapter_number),
      })),
    };
  },
  ["reading-book-static"],
  { revalidate: STATIC_REVALIDATE_SECONDS },
);

const getStaticChapterPageData = unstable_cache(
  async (bookSlug: string, chapterNumber: number, translationId: number | null) => {
    const chapterRow = await db("chapters as c")
      .join("books as b", "b.id", "c.book_id")
      .select(
        "b.id as book_id",
        "b.slug as book_slug",
        "b.name as book_name",
        "b.canonical_order",
        "c.id as chapter_id",
        "c.chapter_number",
      )
      .where("b.slug", bookSlug)
      .andWhere("c.chapter_number", chapterNumber)
      .first<{
        book_id: number;
        book_slug: string;
        book_name: string;
        canonical_order: number;
        chapter_id: number;
        chapter_number: number;
      }>();

    if (!chapterRow) return null;

    const book = {
      id: Number(chapterRow.book_id),
      slug: String(chapterRow.book_slug),
      name: String(chapterRow.book_name),
      canonicalOrder: Number(chapterRow.canonical_order),
    };

    const chapter = {
      id: Number(chapterRow.chapter_id),
      chapterNumber: Number(chapterRow.chapter_number),
    };

    const [verses, chapterContext, previousChapter, nextChapter] = await Promise.all([
      db("verses as v")
        .leftJoin("verse_texts as vt", function joinText() {
          this.on("vt.verse_id", "=", "v.id");
          if (translationId) {
            this.andOn("vt.translation_id", "=", db.raw("?", [translationId]));
          }
        })
        .select("v.id", "v.verse_number", "vt.text")
        .where("v.chapter_id", chapter.id)
        .orderBy("v.verse_number", "asc"),
      db("chapter_contexts")
        .select(
          "summary",
          "author",
          "historical_period",
          "audience",
          "purpose",
          "curiosities",
          "source_label",
        )
        .where({ chapter_id: chapter.id })
        .first<{
          summary: string;
          author: string | null;
          historical_period: string | null;
          audience: string | null;
          purpose: string | null;
          curiosities: string | null;
          source_label: string | null;
        }>(),
      db("chapters")
        .select("chapter_number")
        .where({ book_id: book.id })
        .andWhere("chapter_number", "<", chapter.chapterNumber)
        .orderBy("chapter_number", "desc")
        .first<{ chapter_number: number }>(),
      db("chapters")
        .select("chapter_number")
        .where({ book_id: book.id })
        .andWhere("chapter_number", ">", chapter.chapterNumber)
        .orderBy("chapter_number", "asc")
        .first<{ chapter_number: number }>(),
    ]);

    return {
      book,
      chapter: {
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        previousChapterNumber: previousChapter?.chapter_number ?? null,
        nextChapterNumber: nextChapter?.chapter_number ?? null,
      },
      verses: verses.map((verse) => ({
        id: Number(verse.id),
        verseNumber: Number(verse.verse_number),
        text:
          typeof verse.text === "string" && verse.text.length > 0
            ? verse.text
            : `Conteúdo indisponível para ${book.name} ${chapter.chapterNumber}:${verse.verse_number}.`,
      })),
      chapterContext: chapterContext
        ? {
            summary: chapterContext.summary,
            author: chapterContext.author,
            historicalPeriod: chapterContext.historical_period,
            audience: chapterContext.audience,
            purpose: chapterContext.purpose,
            curiosities: chapterContext.curiosities,
            sourceLabel: chapterContext.source_label,
          }
        : null,
    };
  },
  ["reading-chapter-static"],
  { revalidate: STATIC_REVALIDATE_SECONDS },
);

export async function getBooks(userId?: string | null) {
  const [progressRows, chapterCountRows, books] = await Promise.all([
    userId
      ? db("reading_progress as rp")
          .join("chapters as c", "c.id", "rp.chapter_id")
          .select("c.book_id")
          .count<{ book_id: number; total: string }[]>("rp.id as total")
          .where("rp.user_id", userId)
          .groupBy("c.book_id")
      : Promise.resolve([]),
    getChapterCountMap(),
    getCanonicalBooks(),
  ]);

  const progressMap = new Map(progressRows.map((row) => [Number(row.book_id), Number(row.total)]));
  const chapterCountMap = new Map(chapterCountRows.map((row) => [row.bookId, row.total]));

  return books.map((book) => ({
    id: book.id,
    slug: book.slug,
    name: book.name,
    abbreviation: book.abbreviation,
    testament: book.testament,
    totalChapters: chapterCountMap.get(book.id) ?? 0,
    completedChapters: progressMap.get(book.id) ?? 0,
  }));
}

export async function getOverallProgress(userId?: string | null) {
  if (!userId) {
    return {
      completedChapters: 0,
      totalChapters: await getTotalChapterCount(),
    };
  }

  const [completedRow, totalChapters] = await Promise.all([
    db("reading_progress").where({ user_id: userId }).count<{ total: string }[]>("id as total").first(),
    getTotalChapterCount(),
  ]);

  return {
    completedChapters: Number(completedRow?.total ?? 0),
    totalChapters,
  };
}

export async function getBookWithChapters(bookSlug: string, userId?: string | null) {
  const book = await getBookWithChaptersStatic(bookSlug);

  if (!book) return null;

  const progressRows = userId
    ? await db("reading_progress")
        .select("chapter_id")
        .where("user_id", userId)
        .whereIn(
          "chapter_id",
          db("chapters").select("id").where("book_id", book.id),
        )
    : [];
  const progressIds = new Set(progressRows.map((row) => Number(row.chapter_id)));

  return {
    ...book,
    chapters: book.chapters.map((chapter) => ({
      ...chapter,
      completed: progressIds.has(chapter.id),
    })),
  };
}

export async function getChapterPageData(
  bookSlug: string,
  chapterNumber: number,
  userId?: string | null,
) {
  const { current: currentTranslation, translations } = await resolvePreferredTranslation(userId);
  const staticData = await getStaticChapterPageData(bookSlug, chapterNumber, currentTranslation?.id ?? null);

  if (!staticData) return null;

  const verseIds = staticData.verses.map((verse) => verse.id);
  const [note, completed, verseAnnotations] = await Promise.all([
    userId
      ? db("chapter_notes")
          .select("content")
          .where({ user_id: userId, chapter_id: staticData.chapter.id })
          .first<{ content: string }>()
      : Promise.resolve(null),
    userId
      ? db("reading_progress").where({ user_id: userId, chapter_id: staticData.chapter.id }).first("id")
      : Promise.resolve(null),
    userId && verseIds.length > 0
      ? db("verse_annotations")
          .select("verse_id", "is_highlighted", "is_favorite")
          .where({ user_id: userId })
          .whereIn("verse_id", verseIds)
      : Promise.resolve([]),
  ]);

  const highlightedVerseIds = verseAnnotations
    .filter((annotation) => Boolean(annotation.is_highlighted))
    .map((annotation) => Number(annotation.verse_id));
  const favoriteVerseIds = verseAnnotations
    .filter((annotation) => Boolean(annotation.is_favorite))
    .map((annotation) => Number(annotation.verse_id));

  return {
    ...staticData,
    chapter: {
      ...staticData.chapter,
      completed: Boolean(completed),
    },
    note: note?.content ?? "",
    currentTranslation,
    translations,
    highlightedVerseIds,
    favoriteVerseIds,
  };
}
