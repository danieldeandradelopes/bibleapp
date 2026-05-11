import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 120).notNullable();
    table.string("email", 160).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("role", 20).notNullable().defaultTo("user");
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("translations", (table) => {
    table.increments("id").primary();
    table.string("code", 24).notNullable().unique();
    table.string("name", 120).notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);
  });

  await knex.schema.createTable("books", (table) => {
    table.increments("id").primary();
    table.string("slug", 80).notNullable().unique();
    table.string("name", 80).notNullable();
    table.string("abbreviation", 12).notNullable();
    table.string("testament", 8).notNullable();
    table.integer("canonical_order").notNullable().unique();
  });

  await knex.schema.createTable("chapters", (table) => {
    table.increments("id").primary();
    table.integer("book_id").notNullable().references("id").inTable("books").onDelete("CASCADE");
    table.integer("chapter_number").notNullable();
    table.unique(["book_id", "chapter_number"]);
  });

  await knex.schema.createTable("verses", (table) => {
    table.increments("id").primary();
    table.integer("chapter_id").notNullable().references("id").inTable("chapters").onDelete("CASCADE");
    table.integer("verse_number").notNullable();
    table.unique(["chapter_id", "verse_number"]);
  });

  await knex.schema.createTable("verse_texts", (table) => {
    table.increments("id").primary();
    table.integer("translation_id").notNullable().references("id").inTable("translations").onDelete("CASCADE");
    table.integer("verse_id").notNullable().references("id").inTable("verses").onDelete("CASCADE");
    table.text("text").notNullable();
    table.unique(["translation_id", "verse_id"]);
  });

  await knex.schema.createTable("plan_templates", (table) => {
    table.increments("id").primary();
    table.string("slug", 80).notNullable().unique();
    table.string("name", 140).notNullable();
    table.text("description").notNullable();
    table.integer("duration_days").notNullable();
    table.string("plan_type", 40).notNullable();
  });

  await knex.schema.createTable("plan_days", (table) => {
    table.increments("id").primary();
    table.integer("plan_template_id").notNullable().references("id").inTable("plan_templates").onDelete("CASCADE");
    table.integer("day_number").notNullable();
    table.integer("sort_order").notNullable().defaultTo(1);
    table.integer("book_id").notNullable().references("id").inTable("books").onDelete("CASCADE");
    table.integer("start_chapter").notNullable();
    table.integer("end_chapter");
    table.integer("start_verse");
    table.integer("end_verse");
    table.string("reference_label", 160).notNullable();
    table.index(["plan_template_id", "day_number"]);
  });

  await knex.schema.createTable("user_plans", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("plan_template_id").notNullable().references("id").inTable("plan_templates").onDelete("CASCADE");
    table.date("start_date").notNullable();
    table.integer("current_day").notNullable().defaultTo(1);
    table.string("status", 20).notNullable().defaultTo("active");
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("reading_progress", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("book_id").notNullable().references("id").inTable("books").onDelete("CASCADE");
    table.integer("chapter_id").notNullable().references("id").inTable("chapters").onDelete("CASCADE");
    table.string("source", 20).notNullable().defaultTo("manual");
    table.timestamp("completed_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "chapter_id"]);
  });

  await knex.schema.createTable("chapter_notes", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("book_id").notNullable().references("id").inTable("books").onDelete("CASCADE");
    table.integer("chapter_id").notNullable().references("id").inTable("chapters").onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "chapter_id"]);
  });

  await knex.schema.createTable("groups", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("name", 120).notNullable();
    table.integer("sort_order").notNullable().defaultTo(0);
    table.boolean("is_favorite").notNullable().defaultTo(true);
    table.unique(["user_id", "name"]);
  });

  await knex.schema.createTable("daily_messages", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.date("date").notNullable();
    table.integer("plan_template_id").notNullable().references("id").inTable("plan_templates").onDelete("CASCADE");
    table.string("reference_label", 200).notNullable();
    table.text("message_text").notNullable();
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "date", "plan_template_id"]);
  });

  await knex.schema.createTable("group_share_logs", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("group_id").notNullable().references("id").inTable("groups").onDelete("CASCADE");
    table.integer("daily_message_id").notNullable().references("id").inTable("daily_messages").onDelete("CASCADE");
    table.timestamp("shared_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["group_id", "daily_message_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("group_share_logs");
  await knex.schema.dropTableIfExists("daily_messages");
  await knex.schema.dropTableIfExists("groups");
  await knex.schema.dropTableIfExists("chapter_notes");
  await knex.schema.dropTableIfExists("reading_progress");
  await knex.schema.dropTableIfExists("user_plans");
  await knex.schema.dropTableIfExists("plan_days");
  await knex.schema.dropTableIfExists("plan_templates");
  await knex.schema.dropTableIfExists("verse_texts");
  await knex.schema.dropTableIfExists("verses");
  await knex.schema.dropTableIfExists("chapters");
  await knex.schema.dropTableIfExists("books");
  await knex.schema.dropTableIfExists("translations");
  await knex.schema.dropTableIfExists("users");
}
