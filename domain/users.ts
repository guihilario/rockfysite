import { db, type Queryable } from "@/core/db/index.ts";

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  googleSub: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  google_sub: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

function fromRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    googleSub: row.google_sub,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS = `
  id, email, name, avatar_url, google_sub, role, created_at, updated_at
`;

export async function getUserByGoogleSub(
  googleSub: string,
  client: Queryable = db,
): Promise<User | null> {
  const result = await client.queryObject<UserRow>({
    text: `SELECT ${SELECT_COLUMNS} FROM users WHERE google_sub = $1 LIMIT 1`,
    args: [googleSub],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function getUserById(
  id: string,
  client: Queryable = db,
): Promise<User | null> {
  const result = await client.queryObject<UserRow>({
    text: `SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1 LIMIT 1`,
    args: [id],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export type CreateUserInput = {
  email: string;
  name: string;
  avatarUrl?: string | null;
  googleSub: string;
};

export async function createUser(
  input: CreateUserInput,
  client: Queryable = db,
): Promise<User> {
  const result = await client.queryObject<UserRow>({
    text: `
      INSERT INTO users (email, name, avatar_url, google_sub)
      VALUES ($1, $2, $3, $4)
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [input.email, input.name, input.avatarUrl ?? null, input.googleSub],
  });
  return fromRow(result.rows[0]);
}

/**
 * Versão atômica do primeiro login (SPEC §10): o callback pode receber dois
 * hits concorrentes pro mesmo `google_sub` novo, e `getUserByGoogleSub` +
 * `createUser` separados deixariam um deles violar UNIQUE (google_sub) → 500.
 * `ON CONFLICT DO NOTHING` garante que só um INSERT vence; o perdedor relê o
 * registro do vencedor.
 */
export async function getOrCreateUserByGoogleSub(
  input: CreateUserInput,
  client: Queryable = db,
): Promise<User> {
  const result = await client.queryObject<UserRow>({
    text: `
      INSERT INTO users (email, name, avatar_url, google_sub)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_sub) DO NOTHING
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [input.email, input.name, input.avatarUrl ?? null, input.googleSub],
  });
  if (result.rows[0]) return fromRow(result.rows[0]);
  const existing = await getUserByGoogleSub(input.googleSub, client);
  if (!existing) {
    // Praticamente inalcançável (o INSERT acima não inseriu porque o
    // google_sub já existia) — mas não vale assumir.
    throw new Error("Falha ao criar usuário após conflito de google_sub");
  }
  return existing;
}
