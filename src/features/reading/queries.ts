import "server-only";

import { cache } from "react";
import { getStoredUserPreferences } from "@/features/account/preferences";
import { resolvePreferredTranslation } from "@/features/reading/translations";
import { db } from "@/lib/db/knex";

const getCanonicalBooks = cache(async () => {
  return db("books")
    .select("id", "slug", "name", "abbreviation", "testament", "canonical_order")
    .orderBy("canonical_order", "asc");
});

const getChapterCountMap = cache(async () => {
  const chapterCounts = await db("chapters")
    .select("book_id")
    .count<{ book_id: number; total: string }[]>("id as total")
    .groupBy("book_id");

  return new Map(chapterCounts.map((row) => [Number(row.book_id), Number(row.total)]));
});

const getTotalChapterCount = cache(async () => {
  const row = await db("chapters").count<{ total: string }[]>("id as total").first();
  return Number(row?.total ?? 0);
});

export async function getBooks(userId?: string | null) {
  const [progressRows, chapterCountMap, books] = await Promise.all([
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

  return books.map((book) => ({
    id: Number(book.id),
    slug: String(book.slug),
    name: String(book.name),
    abbreviation: String(book.abbreviation),
    testament: String(book.testament),
    totalChapters: chapterCountMap.get(Number(book.id)) ?? 0,
    completedChapters: progressMap.get(Number(book.id)) ?? 0,
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

  const chapters = await db("chapters")
    .select("id", "chapter_number")
    .where({ book_id: book.id })
    .orderBy("chapter_number", "asc");

  return {
    ...book,
    chapters: chapters.map((chapter) => ({
      id: Number(chapter.id),
      chapterNumber: Number(chapter.chapter_number),
      completed: progressIds.has(Number(chapter.id)),
    })),
  };
}

export async function getChapterPageData(
  bookSlug: string,
  chapterNumber: number,
  userId?: string | null,
) {
  const [{ current: currentTranslation, translations }, preferences] = await Promise.all([
    resolvePreferredTranslation(userId),
    getStoredUserPreferences(userId),
  ]);

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
    canonical_order: Number(chapterRow.canonical_order),
  };

  const chapter = {
    id: Number(chapterRow.chapter_id),
    chapter_number: Number(chapterRow.chapter_number),
  };

  const [verses, note, completed, chapterContext, previousChapter, nextChapter] = await Promise.all([
    db("verses as v")
      .leftJoin("verse_texts as vt", function joinText() {
        this.on("vt.verse_id", "=", "v.id");
        if (currentTranslation?.id) {
          this.andOn("vt.translation_id", "=", db.raw("?", [currentTranslation.id]));
        }
      })
      .select("v.id", "v.verse_number", "vt.text")
      .where("v.chapter_id", chapter.id)
      .orderBy("v.verse_number", "asc"),
    userId
      ? db("chapter_notes")
          .select("content")
          .where({ user_id: userId, chapter_id: chapter.id })
          .first<{ content: string }>()
      : Promise.resolve(null),
    userId
      ? db("reading_progress").where({ user_id: userId, chapter_id: chapter.id }).first("id")
      : Promise.resolve(null),
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
      .andWhere("chapter_number", "<", chapter.chapter_number)
      .orderBy("chapter_number", "desc")
      .first<{ chapter_number: number }>(),
    db("chapters")
      .select("chapter_number")
      .where({ book_id: book.id })
      .andWhere("chapter_number", ">", chapter.chapter_number)
      .orderBy("chapter_number", "asc")
      .first<{ chapter_number: number }>(),
  ]);

  const verseIds = verses.map((verse) => Number(verse.id));
  const verseAnnotations =
    userId && verseIds.length > 0
      ? await db("verse_annotations")
          .select("verse_id", "is_highlighted", "is_favorite")
          .where({ user_id: userId })
          .whereIn("verse_id", verseIds)
      : [];

  const highlightedVerseIds = verseAnnotations
    .filter((annotation) => Boolean(annotation.is_highlighted))
    .map((annotation) => Number(annotation.verse_id));
  const favoriteVerseIds = verseAnnotations
    .filter((annotation) => Boolean(annotation.is_favorite))
    .map((annotation) => Number(annotation.verse_id));

  return {
    book,
    chapter: {
      id: chapter.id,
      chapterNumber: chapter.chapter_number,
      completed: Boolean(completed),
      previousChapterNumber: previousChapter?.chapter_number ?? null,
      nextChapterNumber: nextChapter?.chapter_number ?? null,
    },
    verses: verses.map((verse) => ({
      id: Number(verse.id),
      verseNumber: Number(verse.verse_number),
      text:
        typeof verse.text === "string" && verse.text.length > 0
          ? verse.text
          : `Conteúdo indisponível para ${book.name} ${chapter.chapter_number}:${verse.verse_number}.`,
    })),
    note: note?.content ?? "",
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
    currentTranslation,
    translations,
    highlightedVerseIds,
    favoriteVerseIds,
    preferences,
  };
}
