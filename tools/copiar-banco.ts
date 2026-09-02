/**
 * Copia o conteúdo de um banco para outro.
 *
 *   deno run -A --env-file=.env tools/copiar-banco.ts neon prisma
 *   deno run -A --env-file=.env tools/copiar-banco.ts neon prisma --executar
 *
 * Sem `--executar` é ensaio: lê a origem, confere o destino e diz o que
 * faria, sem escrever nada.
 *
 * Duas decisões que valem explicação:
 *
 * • As linhas de seed do destino são apagadas antes da cópia. As migrações
 *   `0002` e `0003` criam as categorias "blog"/"ajuda" e a tag "ajuda" com
 *   UUID gerado na hora — ou seja, IDs diferentes em cada banco. Manter os
 *   do destino faria todo post apontar para uma categoria que não existe
 *   lá. Copiar as da origem, com o ID original, mantém tudo coerente.
 *
 * • `sessions` não é copiada. São sessões de login, descartáveis por
 *   natureza; levá-las de um banco para outro é risco sem ganho — basta
 *   entrar de novo depois da virada.
 *
 * As categorias têm chave estrangeira para elas mesmas (`parent_id`), então
 * as raízes entram antes das filhas.
 */
import { Pool } from "postgres";

const PROVEDORES: Record<string, string> = {
  neon: "DATABASE_URL",
  prisma: "DATABASE_PRISMA_URL",
};

/** Ordem de dependência: quem é referenciado entra primeiro. */
const TABELAS = ["users", "categories", "tags", "posts", "post_tags"];

function conectar(nome: string) {
  const variavel = PROVEDORES[nome];
  if (!variavel) throw new Error(`provedor desconhecido: ${nome}`);
  const url = Deno.env.get(variavel);
  if (!url) throw new Error(`${variavel} não está definida`);
  return new Pool(url, 1, true);
}

async function colunas(c: {
  queryObject: (
    q: { text: string; args?: unknown[] },
  ) => Promise<{ rows: Record<string, unknown>[] }>;
}, tabela: string): Promise<string[]> {
  const r = await c.queryObject({
    text: `SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name=$1
       ORDER BY ordinal_position`,
    args: [tabela],
  });
  return r.rows.map((x) => String(x.column_name));
}

const [origemNome, destinoNome] = Deno.args;
const executar = Deno.args.includes("--executar");
if (!origemNome || !destinoNome) {
  console.error("uso: copiar-banco.ts <origem> <destino> [--executar]");
  Deno.exit(1);
}

const origem = conectar(origemNome);
const destino = conectar(destinoNome);
const co = await origem.connect();
const cd = await destino.connect();

console.log(
  `\n  ${origemNome} → ${destinoNome}${executar ? "" : "   (ENSAIO)"}\n`,
);

try {
  if (executar) await cd.queryArray("BEGIN");

  // Limpa o destino na ordem inversa da dependência.
  for (const t of [...TABELAS].reverse()) {
    const antes = await cd.queryObject<{ c: bigint }>(
      `SELECT count(*)::bigint AS c FROM "${t}"`,
    );
    if (antes.rows[0].c > 0n) {
      console.log(`  limpar  ${t.padEnd(12)} ${antes.rows[0].c} linha(s)`);
      if (executar) await cd.queryArray(`DELETE FROM "${t}"`);
    }
  }

  for (const t of TABELAS) {
    const cols = await colunas(co, t);
    const colsDestino = await colunas(cd, t);
    const faltando = cols.filter((c) => !colsDestino.includes(c));
    if (faltando.length) {
      throw new Error(
        `${t}: coluna(s) ausente(s) no destino: ${faltando.join(", ")}`,
      );
    }

    // Categoria referencia categoria: raiz antes de filha.
    const ordem = t === "categories" ? " ORDER BY parent_id NULLS FIRST" : "";
    const lista = cols.map((c) => `"${c}"`).join(", ");
    const linhas =
      (await co.queryObject({ text: `SELECT ${lista} FROM "${t}"${ordem}` }))
        .rows as Record<string, unknown>[];

    console.log(`  copiar  ${t.padEnd(12)} ${linhas.length} linha(s)`);
    if (!executar) continue;

    for (const linha of linhas) {
      const valores = cols.map((c) => linha[c]);
      const marcas = cols.map((_, i) => `$${i + 1}`).join(", ");
      await cd.queryObject({
        text: `INSERT INTO "${t}" (${lista}) VALUES (${marcas})`,
        args: valores,
      });
    }
  }

  if (executar) {
    await cd.queryArray("COMMIT");
    console.log("\n  ✓ cópia concluída\n");
  } else {
    console.log("\n  nada foi escrito. Repita com --executar.\n");
  }
} catch (erro) {
  if (executar) await cd.queryArray("ROLLBACK");
  console.error("\n  ✗ falhou, nada foi gravado:", erro);
  Deno.exit(1);
} finally {
  co.release();
  cd.release();
  await origem.end();
  await destino.end();
}

Deno.exit(0);
