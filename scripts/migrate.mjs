// Applies db/migrations/*.sql to DATABASE_URL in order, tracking what ran in
// schema_migrations so re-running (e.g. on every Vercel build) is a no-op.
// Skips silently when DATABASE_URL is unset (local dev, CI without a DB).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@neondatabase/serverless";

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("[migrate] DATABASE_URL not set, skipping migrations.");
    return;
  }

  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();
  if (files.length === 0) {
    console.log("[migrate] No migration files found.");
    return;
  }

  const client = new Client(databaseUrl);
  await client.connect();
  try {
    await client.query(
      `create table if not exists schema_migrations (
         filename text primary key,
         applied_at timestamptz not null default now()
       )`,
    );

    const { rows } = await client.query("select filename from schema_migrations");
    const applied = new Set(rows.map((r) => r.filename));

    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = await readFile(path.join(migrationsDir, file), "utf8");
      console.log(`[migrate] Applying ${file}...`);
      await client.query(sql);
      await client.query("insert into schema_migrations (filename) values ($1)", [file]);
      console.log(`[migrate] Applied ${file}.`);
    }

    console.log("[migrate] Done.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
