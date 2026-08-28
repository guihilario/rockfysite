// Runner de migrations mínimo: sem framework, sem ORM (SPEC §8).
// Aplica em ordem os .sql de ./migrations ainda não registrados em
// `_migrations`, cada um dentro de uma transação.

import { pool } from "./index.ts";

const MIGRATIONS_DIR = new URL("./migrations/", import.meta.url);

async function run() {
  const client = await pool.connect();

  try {
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const applied = new Set(
      (await client.queryArray<[string]>(`SELECT name FROM _migrations`))
        .rows.map(([name]) => name),
    );

    const files = [];
    for await (const entry of Deno.readDir(MIGRATIONS_DIR)) {
      if (entry.isFile && entry.name.endsWith(".sql")) files.push(entry.name);
    }
    files.sort();

    for (const name of files) {
      if (applied.has(name)) continue;

      const sql = await Deno.readTextFile(new URL(name, MIGRATIONS_DIR));
      const tx = client.createTransaction(
        `migration_${name.replace(/\W/g, "_")}`,
      );

      await tx.begin();
      try {
        await tx.queryArray(sql);
        await tx.queryArray(`INSERT INTO _migrations (name) VALUES ($1)`, [
          name,
        ]);
        await tx.commit();
        console.log(`✓ aplicada: ${name}`);
      } catch (error) {
        await tx.rollback();
        throw new Error(`falha ao aplicar ${name}: ${error}`);
      }
    }
  } finally {
    client.release();
  }
}

await run();
await pool.end();
