import { db, disconnect } from "@/lib/db/knex";
import { upsertChapterContexts } from "@/lib/db/upsert-chapter-contexts";

async function main() {
  const total = await upsertChapterContexts(db);
  console.log(`Contextos editoriais upsertados: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnect();
  });
