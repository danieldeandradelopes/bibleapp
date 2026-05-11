import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw("SET lock_timeout = '3s'");
  await knex.raw("SET statement_timeout = '60s'");
  await knex.raw("SET idle_in_transaction_session_timeout = '10s'");

  await knex.schema.createTable("chapter_contexts", (table) => {
    table.increments("id").primary();
    table.integer("chapter_id").notNullable().references("id").inTable("chapters").onDelete("CASCADE");
    table.text("summary").notNullable();
    table.string("author", 160);
    table.string("historical_period", 160);
    table.string("audience", 200);
    table.string("purpose", 200);
    table.text("curiosities");
    table.string("source_label", 160);
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["chapter_id"]);
  });

  await knex.schema.createTable("user_preferences", (table) => {
    table
      .uuid("user_id")
      .primary()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("preferred_translation_code", 24);
    table.boolean("reminder_enabled").notNullable().defaultTo(false);
    table.string("reminder_time", 5).notNullable().defaultTo("07:00");
    table.string("reminder_timezone", 80).notNullable().defaultTo("America/Sao_Paulo");
    table.boolean("onboarding_completed").notNullable().defaultTo(false);
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("plan_templates", (table) => {
    table
      .uuid("created_by_user")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.boolean("is_public").notNullable().defaultTo(true);
    table.boolean("is_custom").notNullable().defaultTo(false);
  });

  await knex.schema.createTable("verse_annotations", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("verse_id").notNullable().references("id").inTable("verses").onDelete("CASCADE");
    table.boolean("is_highlighted").notNullable().defaultTo(true);
    table.boolean("is_favorite").notNullable().defaultTo(false);
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "verse_id"]);
    table.index(["user_id", "is_favorite"]);
    table.index(["user_id", "is_highlighted"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("SET lock_timeout = '3s'");
  await knex.raw("SET statement_timeout = '60s'");
  await knex.raw("SET idle_in_transaction_session_timeout = '10s'");

  await knex.schema.dropTableIfExists("verse_annotations");
  await knex.schema.alterTable("plan_templates", (table) => {
    table.dropColumn("is_custom");
    table.dropColumn("is_public");
    table.dropColumn("created_by_user");
  });
  await knex.schema.dropTableIfExists("user_preferences");
  await knex.schema.dropTableIfExists("chapter_contexts");
}
