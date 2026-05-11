import fs from "node:fs/promises";
import path from "node:path";

export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export function toSqlLiteral(value: string | number | boolean | null): string {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return `'${value.replace(/'/g, "''")}'`;
}

export function toValuesBlock(rows: Array<Array<string | number | boolean | null>>): string {
  return rows.map((row) => `  (${row.map((value) => toSqlLiteral(value)).join(", ")})`).join(",\n");
}

export async function writeSqlFile(filename: string, contents: string): Promise<string> {
  const targetDirectory = path.resolve(process.cwd(), "sql");
  await fs.mkdir(targetDirectory, { recursive: true });

  const outputPath = path.join(targetDirectory, filename);
  await fs.writeFile(outputPath, contents, "utf8");
  return outputPath;
}
