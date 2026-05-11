import { chapterContextSeeds } from "@/lib/seed-data/chapter-contexts";
import { chunkArray, toValuesBlock, writeSqlFile } from "@/scripts/sql-utils";

async function main() {
  const statements: string[] = [];

  statements.push("-- Gerado automaticamente para execucao no DBeaver.");
  statements.push("BEGIN;");
  statements.push("");

  for (const chunk of chunkArray(chapterContextSeeds, 120)) {
    const values = chunk.map((item) => [
      item.bookSlug,
      item.chapterNumber,
      item.summary,
      item.author,
      item.historicalPeriod,
      item.audience,
      item.purpose,
      item.curiosities,
      item.sourceLabel ?? null,
    ]);

    statements.push(
      `INSERT INTO chapter_contexts (chapter_id, summary, author, historical_period, audience, purpose, curiosities, source_label, updated_at)\nSELECT c.id, src.summary, src.author, src.historical_period, src.audience, src.purpose, src.curiosities, src.source_label, NOW()\nFROM (\nVALUES\n${toValuesBlock(values)}\n) AS src(book_slug, chapter_number, summary, author, historical_period, audience, purpose, curiosities, source_label)\nJOIN books b ON b.slug = src.book_slug\nJOIN chapters c ON c.book_id = b.id AND c.chapter_number = src.chapter_number\nON CONFLICT (chapter_id) DO UPDATE SET\n  summary = EXCLUDED.summary,\n  author = EXCLUDED.author,\n  historical_period = EXCLUDED.historical_period,\n  audience = EXCLUDED.audience,\n  purpose = EXCLUDED.purpose,\n  curiosities = EXCLUDED.curiosities,\n  source_label = EXCLUDED.source_label,\n  updated_at = EXCLUDED.updated_at;`,
    );
    statements.push("");
  }

  statements.push("COMMIT;");

  const outputPath = await writeSqlFile(
    "import-chapter-contexts.sql",
    `${statements.join("\n")}\n`,
  );
  console.log(`SQL de contextos gerado em: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
