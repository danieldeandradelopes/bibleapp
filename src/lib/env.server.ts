import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function loadDotEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, "utf8");
  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = stripQuotes(line.slice(separatorIndex + 1).trim());

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const projectRoot = path.resolve(__dirname, "../..");
loadDotEnvFile(path.join(projectRoot, ".env"));
loadDotEnvFile(path.join(projectRoot, ".env.local"));

function emptyStringToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const OptionalString = z.preprocess(emptyStringToUndefined, z.string().min(1).optional());
const OptionalPort = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().optional(),
);
const OptionalBoolean = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "off"].includes(normalized)) return false;
  return value;
}, z.boolean().optional());

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: OptionalString,
    DB_HOST: OptionalString,
    DB_PORT: OptionalPort,
    DB_DATABASE: OptionalString,
    DB_USER: OptionalString,
    DB_PASSWORD: z.preprocess(emptyStringToUndefined, z.string().optional()),
    DB_SSL: OptionalBoolean.default(false),
    DATABASE_POOL_MIN: z.coerce.number().default(0),
    DATABASE_POOL_MAX: z.coerce.number().default(10),
    AUTH_SECRET: z.preprocess(emptyStringToUndefined, z.string().min(1).default("dev-secret-change-me")),
    AUTH_URL: z.preprocess(emptyStringToUndefined, z.string().url().default("http://localhost:3030")),
    ADMIN_EMAIL: z.preprocess(
      emptyStringToUndefined,
      z.string().email().default("admin@bibleapp.local"),
    ),
    NEXT_PUBLIC_APP_URL: z.preprocess(
      emptyStringToUndefined,
      z.string().url().default("http://localhost:3030"),
    ),
    APP_NAME: z.preprocess(emptyStringToUndefined, z.string().default("BibleApp")),
    DEFAULT_TRANSLATION_CODE: z.preprocess(
      emptyStringToUndefined,
      z.string().default("arc"),
    ),
  })
  .superRefine((data, context) => {
    if (data.DATABASE_URL) {
      return;
    }

    const missingFields = [
      ["DB_HOST", data.DB_HOST],
      ["DB_PORT", data.DB_PORT],
      ["DB_DATABASE", data.DB_DATABASE],
      ["DB_USER", data.DB_USER],
    ]
      .filter(([, value]) => value === undefined)
      .map(([key]) => key);

    if (missingFields.length === 0) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["DATABASE_URL"],
      message: `Defina DATABASE_URL ou todos os campos separados do banco: ${missingFields.join(", ")}.`,
    });
  });

export const env = EnvSchema.parse(process.env);
