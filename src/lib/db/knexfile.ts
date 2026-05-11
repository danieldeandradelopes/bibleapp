import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Knex } from "knex";
import { env } from "@/lib/env.server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveDatabaseConnection(): Knex.StaticConnectionConfig | string {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  if (!env.DB_HOST || !env.DB_PORT || !env.DB_DATABASE || !env.DB_USER) {
    throw new Error("Database configuration is incomplete. Define DATABASE_URL or DB_HOST/DB_PORT/DB_DATABASE/DB_USER.");
  }

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_DATABASE,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
  };
}

const databaseConnection = resolveDatabaseConnection();

const baseConfig: Knex.Config = {
  client: "pg",
  connection: databaseConnection,
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
    connection: process.env.TEST_DATABASE_URL?.trim() || databaseConnection,
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
