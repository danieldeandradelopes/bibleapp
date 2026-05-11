import fs from "node:fs/promises";
import path from "node:path";
import { bibleBooks } from "@/lib/seed-data/books";
import { chunkArray, toValuesBlock, writeSqlFile } from "@/scripts/sql-utils";

const DEFAULT_ARC_URL =
  "https://raw.githubusercontent.com/maatheusgois/bible/main/versions/pt-br/arc.json";

type ArcBook = {
  id: string;
  name: string;
  chapters: string[][];
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
    throw new Error("Conteudo recebido nao contem JSON valido.");
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

async function main() {
  const sourceBooks = await loadArcSource();
  if (!Array.isArray(sourceBooks) || sourceBooks.length !== bibleBooks.length) {
    throw new Error(
      `Estrutura inesperada da ARC. Esperado ${bibleBooks.length} livros, recebido ${sourceBooks.length}.`,
    );
  }

  const statements: string[] = [];

  statements.push("-- Gerado automaticamente para execucao no DBeaver.");
  statements.push("BEGIN;");
  statements.push("");
  statements.push(
    `INSERT INTO translations (code, name, is_active) VALUES ('arc', 'Almeida Revista e Corrigida', TRUE) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, is_active = EXCLUDED.is_active;`,
  );
  statements.push("");

  const bookRows = bibleBooks.map((book, index) => [
    book.slug,
    book.name,
    book.abbreviation,
    book.testament,
    index + 1,
  ]);
  statements.push(
    `INSERT INTO books (slug, name, abbreviation, testament, canonical_order)\nVALUES\n${toValuesBlock(bookRows)}\nON CONFLICT (slug) DO UPDATE SET\n  name = EXCLUDED.name,\n  abbreviation = EXCLUDED.abbreviation,\n  testament = EXCLUDED.testament,\n  canonical_order = EXCLUDED.canonical_order;`,
  );
  statements.push("");

  const chapterRows = bibleBooks.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => [book.slug, index + 1]),
  );
  for (const chunk of chunkArray(chapterRows, 400)) {
    statements.push(
      `INSERT INTO chapters (book_id, chapter_number)\nSELECT b.id, src.chapter_number\nFROM (\nVALUES\n${toValuesBlock(chunk)}\n) AS src(book_slug, chapter_number)\nJOIN books b ON b.slug = src.book_slug\nON CONFLICT (book_id, chapter_number) DO NOTHING;`,
    );
    statements.push("");
  }

  const verseRows: Array<[string, number, number]> = [];
  const verseTextRows: Array<[string, number, number, string]> = [];

  sourceBooks.forEach((sourceBook, bookIndex) => {
    const book = bibleBooks[bookIndex];
    if (!book) {
      throw new Error(`Livro fora da faixa esperada na posicao ${bookIndex + 1}.`);
    }

    if (!Array.isArray(sourceBook.chapters) || sourceBook.chapters.length !== book.chapters) {
      throw new Error(
        `Quantidade de capitulos incompatível em ${book.name}: esperado ${book.chapters}, recebido ${sourceBook.chapters.length}.`,
      );
    }

    sourceBook.chapters.forEach((verses, chapterIndex) => {
      const chapterNumber = chapterIndex + 1;

      verses.forEach((verseText, verseIndex) => {
        const verseNumber = verseIndex + 1;
        verseRows.push([book.slug, chapterNumber, verseNumber]);
        verseTextRows.push([book.slug, chapterNumber, verseNumber, verseText]);
      });
    });
  });

  for (const chunk of chunkArray(verseRows, 800)) {
    statements.push(
      `INSERT INTO verses (chapter_id, verse_number)\nSELECT c.id, src.verse_number\nFROM (\nVALUES\n${toValuesBlock(chunk)}\n) AS src(book_slug, chapter_number, verse_number)\nJOIN books b ON b.slug = src.book_slug\nJOIN chapters c ON c.book_id = b.id AND c.chapter_number = src.chapter_number\nON CONFLICT (chapter_id, verse_number) DO NOTHING;`,
    );
    statements.push("");
  }

  for (const chunk of chunkArray(verseTextRows, 400)) {
    statements.push(
      `INSERT INTO verse_texts (translation_id, verse_id, text)\nSELECT t.id, v.id, src.text\nFROM (\nVALUES\n${toValuesBlock(chunk)}\n) AS src(book_slug, chapter_number, verse_number, text)\nJOIN translations t ON t.code = 'arc'\nJOIN books b ON b.slug = src.book_slug\nJOIN chapters c ON c.book_id = b.id AND c.chapter_number = src.chapter_number\nJOIN verses v ON v.chapter_id = c.id AND v.verse_number = src.verse_number\nON CONFLICT (translation_id, verse_id) DO UPDATE SET text = EXCLUDED.text;`,
    );
    statements.push("");
  }

  statements.push("COMMIT;");

  const outputPath = await writeSqlFile("import-arc.sql", `${statements.join("\n")}\n`);
  console.log(`SQL ARC gerado em: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
