import { ConnectionError, Pool } from "postgres";
import type { PoolClient } from "postgres";
import { config } from "@/core/config.ts";

// Pool sobre a connection string pooled do Neon — sem segundo pool local
// por cima dela (SPEC §2, "Banco"). Tamanho pequeno: Cloud Run tende a rodar
// várias instâncias, cada uma com seu próprio pool.
export const pool = new Pool(config.databaseUrl, 3, true);

/**
 * Contrato mínimo que o código de domínio precisa: rodar uma query
 * parametrizada e ler linhas tipadas de volta. `PoolClient` (uma conexão
 * dentro de uma transação) e `db` (abaixo) satisfazem os dois.
 */
export interface Queryable {
  queryObject<T extends Record<string, unknown> = Record<string, unknown>>(
    query: { text: string; args?: unknown[] },
  ): Promise<{ rows: T[]; rowCount?: number }>;
}

async function withPooledClient<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

/**
 * Erro de conexão, não de query: o socket caiu, o banco estava dormindo, a
 * rede piscou. Vale tentar de novo — diferente de um `PostgresError` (SQL
 * inválido, constraint violada), que vai falhar igual quantas vezes rodar.
 */
export function isTransient(error: unknown): boolean {
  if (error instanceof ConnectionError) return true;
  if (!(error instanceof Error)) return false;
  // a lib nem sempre embrulha: socket fechado no meio chega como Error cru
  return /connection|socket|closed|terminated|ECONNRESET|EPIPE/i.test(
    error.message,
  );
}

/**
 * Só leitura se repete. Um INSERT/UPDATE pode ter chegado no banco e a
 * resposta é que se perdeu — repetir criaria linha duplicada. SELECT não tem
 * esse risco.
 */
export function isReadOnly(text: string): boolean {
  return /^\s*(--[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(SELECT|WITH)\b/i.test(text);
}

const RETRY_DELAY_MS = 120;

/**
 * Acesso "one-shot": pega uma conexão do pool, roda a query, devolve.
 *
 * Com uma segunda chance. O banco é serverless (Neon) e a conexão ociosa é
 * derrubada do outro lado: a primeira query depois de um tempo parado pode
 * pegar um socket morto. Sem isto, esse tropeço vira 500 na página inteira —
 * era o erro intermitente que aparecia no site sem nada no código ter mudado.
 * Uma tentativa extra basta: o pool abre uma conexão nova, e o que falha duas
 * vezes seguidas é problema de verdade, que sobe.
 */
export const db: Queryable = {
  queryObject: async (query) => {
    try {
      return await withPooledClient((client) => client.queryObject(query));
    } catch (error) {
      if (!isTransient(error) || !isReadOnly(query.text)) throw error;

      console.warn(
        "[db] conexão caiu, tentando de novo:",
        error instanceof Error ? error.message : error,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return await withPooledClient((client) => client.queryObject(query));
    }
  },
};

/**
 * Roda `fn` dentro de uma transação (BEGIN/COMMIT, ROLLBACK em erro) —
 * usada quando uma ação de domínio precisa de mais de um INSERT/UPDATE
 * atômico (ex.: criar post + associar tags no admin).
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return await withPooledClient(async (client) => {
    await client.queryArray("BEGIN");
    try {
      const result = await fn(client);
      await client.queryArray("COMMIT");
      return result;
    } catch (error) {
      await client.queryArray("ROLLBACK");
      throw error;
    }
  });
}
