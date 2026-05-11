import knexFactory, { type Knex } from "knex";
import knexConfig from "@/lib/db/knexfile";

const envName = process.env.NODE_ENV ?? "development";
const config = (knexConfig[envName] ?? knexConfig.development) as Knex.Config;

if (!config) {
  throw new Error(`Knex config not found for environment "${envName}"`);
}

declare global {
  var __bibleapp_knex__: Knex | undefined;
}

function getKnexInstance(): Knex {
  if (global.__bibleapp_knex__) {
    return global.__bibleapp_knex__;
  }

  const instance = knexFactory(config);
  if (process.env.NODE_ENV !== "production") {
    global.__bibleapp_knex__ = instance;
  }
  return instance;
}

export const db = new Proxy(function dbProxy() {}, {
  apply(_target, _thisArg, args) {
    const callable = getKnexInstance() as unknown as (...params: unknown[]) => unknown;
    return Reflect.apply(callable, undefined, args as unknown[]);
  },
  get(_target, prop) {
    return getKnexInstance()[prop as keyof Knex];
  },
}) as unknown as Knex;

export async function disconnect(): Promise<void> {
  const instance = global.__bibleapp_knex__;
  if (!instance) return;

  await instance.destroy();
  if (global.__bibleapp_knex__) {
    global.__bibleapp_knex__ = undefined;
  }
}
