import { db, type Queryable } from "@/core/db/index.ts";
import type { User } from "@/domain/users.ts";

// Inatividade máxima aceita (SPEC §10): além do TTL absoluto de 30 dias do
// cookie, uma sessão morre se ficar 14 dias sem uso. O `last_seen_at` já era
// tocado a cada request pelo guard — só faltava usá-lo como critério.
export const SESSION_IDLE_MS = 14 * 24 * 60 * 60 * 1000;

export async function createSession(
  input: { userId: string; tokenHash: string; expiresAt: Date },
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
    `,
    args: [input.userId, input.tokenHash, input.expiresAt],
  });
}

type SessionUserRow = {
  user_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  google_sub: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

function fromRow(row: SessionUserRow): User {
  return {
    id: row.user_id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    googleSub: row.google_sub,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Valida a sessão (existe, não expirou e não está inativa além do idle
 * timeout) e já atualiza `last_seen_at`, numa query só, devolvendo o
 * usuário — evita N+1 no meio do authGuard, que roda em toda request pro
 * admin (SPEC §11, §28).
 */
export async function touchSessionAndGetUser(
  tokenHash: string,
  client: Queryable = db,
): Promise<User | null> {
  const result = await client.queryObject<SessionUserRow>({
    text: `
      UPDATE sessions s
      SET last_seen_at = now()
      FROM users u
      WHERE s.token_hash = $1
        AND s.expires_at > now()
        AND s.last_seen_at > $2
        AND u.id = s.user_id
      RETURNING
        u.id AS user_id, u.email, u.name, u.avatar_url,
        u.google_sub, u.role, u.created_at, u.updated_at
    `,
    args: [tokenHash, new Date(Date.now() - SESSION_IDLE_MS)],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function deleteSessionByTokenHash(
  tokenHash: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `DELETE FROM sessions WHERE token_hash = $1`,
    args: [tokenHash],
  });
}
