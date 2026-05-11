import fs from "node:fs/promises";
import path from "node:path";
import { db, disconnect } from "@/lib/db/knex";
import { bibleBooks } from "@/lib/seed-data/books";

const DEFAULT_ARC_URL =
  "https://raw.githubusercontent.com/maatheusgois/bible/main/versions/pt-br/arc.json";

type ArcBook = {
  id: string;
  name: string;
  chapters: string[][];
};

type DbBookRow = {
  id: number;
  slug: string;
  name: string;
  canonical_order: number;
};

type DbChapterRow = {
  id: number;
  book_id: number;
  chapter_number: number;
};

function extractJsonPayload(raw: string): string {
  const objectStart = raw.indexOf("{");
  const arrayStart = raw.indexOf("[");
  const start =
    arrayStart === -1
      ? objectStart
      : objectStart === -1
        ? arrayStart
        : Math.min(objectStart, arrayStart);

  if (start === -1) {
    throw new Error("Conteúdo recebido não contém JSON válido.");
  }

  return raw.slice(start);
}

async function loadArcSource(): Promise<ArcBook[]> {
  const sourceFile = process.env.ARC_SOURCE_FILE?.trim();

  if (sourceFile) {
    const filePath = path.isAbsolute(sourceFile)
      ? sourceFile
      : path.resolve(process.cwd(), sourceFile);
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(extractJsonPayload(raw)) as ArcBook[];
  }

  const response = await fetch(DEFAULT_ARC_URL);
  if (!response.ok) {
    throw new Error(`Falha ao baixar ARC: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ArcBook[];
}

async function ensureBooksAndChapters(): Promise<{
  booksByOrder: DbBookRow[];
  chapterIdByBookAndNumber: Map<string, number>;
}> {
  await db("books")
    .insert(
      bibleBooks.map((book, index) => ({
        slug: book.slug,
        name: book.name,
        abbreviation: book.abbreviation,
        testament: book.testament,
        canonical_order: index + 1,
      })),
    )
    .onConflict("slug")
    .merge(["name", "abbreviation", "testament", "canonical_order"]);

  const books = await db("books")
    .select("id", "slug", "name", "canonical_order")
    .orderBy("canonical_order", "asc") as DbBookRow[];

  for (const book of bibleBooks) {
    const dbBook = books.find((item) => item.slug === book.slug);
    if (!dbBook) {
      throw new Error(`Livro não encontrado no banco após upsert: ${book.slug}`);
    }

    const chapters = Array.from({ length: book.chapters }, (_, index) => ({
      book_id: dbBook.id,
      chapter_number: index + 1,
    }));

    await db("chapters").insert(chapters).onConflict(["book_id", "chapter_number"]).ignore();
  }

  const dbChapters = await db("chapters")
    .select("id", "book_id", "chapter_number") as DbChapterRow[];

  const chapterIdByBookAndNumber = new Map(
    dbChapters.map((chapter) => [`${chapter.book_id}:${chapter.chapter_number}`, chapter.id]),
  );

  return {
    booksByOrder: books,
    chapterIdByBookAndNumber,
  };
}

async function ensureArcTranslation(): Promise<number> {
  const [translation] = (await db("translations")
    .insert({
      code: "arc",
      name: "Almeida Revista e Corrigida",
      is_active: true,
    })
    .onConflict("code")
    .merge(["name", "is_active"])
    .returning(["id"])) as { id: number }[];

  if (!translation) {
    throw new Error("Falha ao criar/obter a tradução ARC.");
  }

  return translation.id;
}

async function importBook(
  translationId: number,
  dbBook: DbBookRow,
  sourceBook: ArcBook,
  chapterIdByBookAndNumber: Map<string, number>,
): Promise<void> {
  for (const [chapterIndex, verses] of sourceBook.chapters.entries()) {
    const chapterNumber = chapterIndex + 1;
    const chapterId = chapterIdByBookAndNumber.get(`${dbBook.id}:${chapterNumber}`);

    if (!chapterId) {
      throw new Error(`Capítulo ausente para ${dbBook.slug} ${chapterNumber}`);
    }

    const verseRows = verses.map((_, verseIndex) => ({
      chapter_id: chapterId,
      verse_number: verseIndex + 1,
    }));

    await db("verses")
      .insert(verseRows)
      .onConflict(["chapter_id", "verse_number"])
      .ignore();

    const dbVerses = (await db("verses")
      .select("id", "verse_number")
      .where({ chapter_id: chapterId })
      .orderBy("verse_number", "asc")) as { id: number; verse_number: number }[];

    const verseTextRows = dbVerses
      .map((verse) => {
        const verseText = verses[verse.verse_number - 1];
        if (typeof verseText !== "string") {
          return null;
        }

        return {
          translation_id: translationId,
          verse_id: verse.id,
          text: verseText,
        };
      })
      .filter((item): item is { translation_id: number; verse_id: number; text: string } => Boolean(item));

    await db("verse_texts")
      .insert(verseTextRows)
      .onConflict(["translation_id", "verse_id"])
      .merge(["text"]);
  }
}

async function main() {
  const sourceBooks = await loadArcSource();
  if (!Array.isArray(sourceBooks) || sourceBooks.length !== bibleBooks.length) {
    throw new Error(
      `Estrutura inesperada da ARC. Esperado ${bibleBooks.length} livros, recebido ${sourceBooks.length}.`,
    );
  }

  const { booksByOrder, chapterIdByBookAndNumber } = await ensureBooksAndChapters();
  const translationId = await ensureArcTranslation();

  for (const [index, sourceBook] of sourceBooks.entries()) {
    const dbBook = booksByOrder[index];
    const expectedBook = bibleBooks[index];

    if (!dbBook || !expectedBook) {
      throw new Error(`Livro fora da faixa esperada na posição ${index + 1}.`);
    }

    if (!Array.isArray(sourceBook.chapters) || sourceBook.chapters.length !== expectedBook.chapters) {
      throw new Error(
        `Quantidade de capítulos incompatível em ${expectedBook.name}: esperado ${expectedBook.chapters}, recebido ${sourceBook.chapters.length}.`,
      );
    }

    // A fonte ARC é consumida em ordem canônica do array principal.
    await importBook(translationId, dbBook, sourceBook, chapterIdByBookAndNumber);
    console.log(`Importado: ${expectedBook.name}`);
  }

  console.log("Importação ARC concluída com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnect();
  });
