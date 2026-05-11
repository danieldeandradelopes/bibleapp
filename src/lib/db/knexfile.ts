import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Knex } from "knex";
import { env } from "@/lib/env.server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig: Knex.Config = {
  client: "pg",
  connection: env.DATABASE_URL,
  pool: {
    min: env.DATABASE_POOL_MIN,
    max: env.DATABASE_POOL_MAX,
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
    extension: "ts",
    loadExtensions: [".ts"],
    tableName: "knex_migrations",
  },
  seeds: {
    directory: path.join(__dirname, "seeds"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

const config: Record<string, Knex.Config> = {
  development: baseConfig,
  test: {
    ...baseConfig,
    connection: process.env.TEST_DATABASE_URL ?? env.DATABASE_URL,
  },
  production: {
    ...baseConfig,
    pool: {
      min: env.DATABASE_POOL_MIN,
      max: Math.max(env.DATABASE_POOL_MAX, 20),
    },
  },
};

export default config;
