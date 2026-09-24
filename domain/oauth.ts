import { db, type Queryable } from "@/core/db/index.ts";
import { generateSessionToken, hashSessionToken } from "@/core/auth/session.ts";

export const ESCOPOS = ["posts:write", "posts:publish"] as const;
export type Escopo = typeof ESCOPOS[number];

const ACCESS_MS = 60 * 60 * 1000;
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_MS = 5 * 60 * 1000;

export type ClienteOAuth = {
  clientId: string;
  name: string;
  redirectUris: string[];
};

export async function criarCliente(
  input: { name: string; redirectUris: string[] },
  client: Queryable = db,
): Promise<ClienteOAuth> {
  const clientId = `mcp_${generateSessionToken()}`;
  await client.queryObject({
    text: `
      INSERT INTO oauth_clients (client_id, name, redirect_uris)
      VALUES ($1, $2, $3)
    `,
    args: [clientId, input.name, input.redirectUris],
  });
  return { clientId, name: input.name, redirectUris: input.redirectUris };
}

export async function buscarCliente(
  clientId: string,
  client: Queryable = db,
): Promise<ClienteOAuth | null> {
  const result = await client.queryObject<{
    client_id: string;
    name: string;
    redirect_uris: string[];
  }>({
    text: `
      SELECT client_id, name, redirect_uris
      FROM oauth_clients WHERE client_id = $1 LIMIT 1
    `,
    args: [clientId],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    clientId: row.client_id,
    name: row.name,
    redirectUris: row.redirect_uris,
  };
}

export function escoposPedidos(texto: string | null): Escopo[] {
  const pedidos = new Set(
    (texto ?? "posts:write").split(/\s+/).filter(Boolean),
  );
  return ESCOPOS.filter((escopo) => pedidos.has(escopo));
}

export async function emitirCodigo(
  input: {
    clientId: string;
    userId: string;
    redirectUri: string;
    codeChallenge: string;
    scopes: Escopo[];
  },
  client: Queryable = db,
): Promise<string> {
  const code = generateSessionToken();
  await client.queryObject({
    text: `
      INSERT INTO oauth_codes (
        code_hash, client_id, user_id, redirect_uri, code_challenge, scopes, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    args: [
      await hashSessionToken(code),
      input.clientId,
      input.userId,
      input.redirectUri,
      input.codeChallenge,
      input.scopes,
      new Date(Date.now() + CODE_MS),
    ],
  });
  return code;
}

type CodeRow = {
  id: string;
  client_id: string;
  user_id: string;
  redirect_uri: string;
  code_challenge: string;
  scopes: string[];
  expires_at: Date;
  used_at: Date | null;
};

/** Consome o código uma vez. Devolve null se já foi usado, expirou ou não existe. */
export async function consumirCodigo(
  code: string,
  client: Queryable = db,
): Promise<CodeRow | null> {
  const result = await client.queryObject<CodeRow>({
    text: `
      UPDATE oauth_codes
      SET used_at = now()
      WHERE code_hash = $1
        AND used_at IS NULL
        AND expires_at > now()
      RETURNING id, client_id, user_id, redirect_uri, code_challenge, scopes, expires_at, used_at
    `,
    args: [await hashSessionToken(code)],
  });
  return result.rows[0] ?? null;
}

export type Grant = {
  id: string;
  clientId: string;
  clientName: string;
  userId: string;
  scopes: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

export async function emitirGrant(
  input: { clientId: string; userId: string; scopes: string[] },
  client: Queryable = db,
): Promise<
  { access: string; refresh: string; expiresIn: number; scope: string }
> {
  const access = generateSessionToken();
  const refresh = generateSessionToken();
  await client.queryObject({
    text: `
      INSERT INTO oauth_grants (
        client_id, user_id, scopes, access_hash, refresh_hash,
        access_expires_at, refresh_expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    args: [
      input.clientId,
      input.userId,
      input.scopes,
      await hashSessionToken(access),
      await hashSessionToken(refresh),
      new Date(Date.now() + ACCESS_MS),
      new Date(Date.now() + REFRESH_MS),
    ],
  });
  return {
    access,
    refresh,
    expiresIn: ACCESS_MS / 1000,
    scope: input.scopes.join(" "),
  };
}

export type Acesso = {
  userId: string;
  scopes: string[];
  grantId: string;
};

export async function acessoPeloToken(
  token: string,
  client: Queryable = db,
): Promise<Acesso | null> {
  const result = await client.queryObject<{
    id: string;
    user_id: string;
    scopes: string[];
  }>({
    text: `
      UPDATE oauth_grants
      SET last_used_at = now()
      WHERE access_hash = $1
        AND revoked_at IS NULL
        AND access_expires_at > now()
      RETURNING id, user_id, scopes
    `,
    args: [await hashSessionToken(token)],
  });
  const row = result.rows[0];
  if (!row) return null;
  return { grantId: row.id, userId: row.user_id, scopes: row.scopes };
}

/** Troca o refresh por um par novo e invalida o anterior. */
export async function girarGrant(
  refresh: string,
  clientId: string,
  client: Queryable = db,
): Promise<
  { access: string; refresh: string; expiresIn: number; scope: string } | null
> {
  const atual = await client.queryObject<{
    id: string;
    user_id: string;
    scopes: string[];
  }>({
    text: `
      UPDATE oauth_grants
      SET revoked_at = now()
      WHERE refresh_hash = $1
        AND client_id = $2
        AND revoked_at IS NULL
        AND refresh_expires_at > now()
      RETURNING id, user_id, scopes
    `,
    args: [await hashSessionToken(refresh), clientId],
  });
  const row = atual.rows[0];
  if (!row) return null;
  return await emitirGrant({
    clientId,
    userId: row.user_id,
    scopes: row.scopes,
  }, client);
}

export async function listarGrants(
  userId: string,
  client: Queryable = db,
): Promise<Grant[]> {
  const result = await client.queryObject<{
    id: string;
    client_id: string;
    name: string;
    user_id: string;
    scopes: string[];
    created_at: Date;
    last_used_at: Date | null;
    revoked_at: Date | null;
  }>({
    text: `
      SELECT g.id, g.client_id, c.name, g.user_id, g.scopes,
             g.created_at, g.last_used_at, g.revoked_at
      FROM oauth_grants g
      JOIN oauth_clients c ON c.client_id = g.client_id
      WHERE g.user_id = $1
      ORDER BY g.created_at DESC
      LIMIT 50
    `,
    args: [userId],
  });
  return result.rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    clientName: row.name,
    userId: row.user_id,
    scopes: row.scopes,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    revokedAt: row.revoked_at,
  }));
}

export async function revogarGrant(
  id: string,
  userId: string,
  client: Queryable = db,
): Promise<boolean> {
  const result = await client.queryObject({
    text: `
      UPDATE oauth_grants
      SET revoked_at = now()
      WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL
    `,
    args: [id, userId],
  });
  return (result.rowCount ?? 0) > 0;
}
