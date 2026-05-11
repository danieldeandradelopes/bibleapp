import type { Knex } from "knex";
import { upsertChapterContexts } from "@/lib/db/upsert-chapter-contexts";

export async function seed(knex: Knex): Promise<void> {
  await upsertChapterContexts(knex);
}
