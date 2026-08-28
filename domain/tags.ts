import { db, type Queryable } from "@/core/db/index.ts";
import { slugify } from "@/core/content/slugify.ts";

// Nota histórica: até 2026-08-18 a tag "ajuda" era usada como marcador
// reservado pra decidir se um post aparecia em /ajuda. Isso foi substituído
// por categorias (ver domain/categories.ts) — tags agora são só #assunto
// livre, sem nenhum slug com significado especial. A tag "ajuda" em si
// pode continuar existindo no banco como uma tag normal.

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export async function listTags(
  client: Queryable = db,
): Promise<Tag[]> {
  const result = await client.queryObject<Tag>({
    text: `SELECT id, name, slug FROM tags ORDER BY name`,
  });
  return result.rows;
}

export async function getTagBySlug(
  slug: string,
  client: Queryable = db,
): Promise<Tag | null> {
  const result = await client.queryObject<Tag>({
    text: `SELECT id, name, slug FROM tags WHERE slug = $1 LIMIT 1`,
    args: [slug],
  });
  return result.rows[0] ?? null;
}

export async function addTagToPost(
  postId: string,
  tagId: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `
      INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    args: [postId, tagId],
  });
}

/** Acha pelo slug derivado do nome; cria se não existir. Usado pelo campo
 * "novas tags" do form de post no admin — evita precisar de uma tela de
 * gestão de tags separada só pra isso. */
export async function getOrCreateTagByName(
  name: string,
  client: Queryable = db,
): Promise<Tag> {
  const slug = slugify(name);
  // Nome que não gera slug (ex.: "!!!") gravaria uma tag quebrada e a
  // segunda tentativa violaria UNIQUE(slug) — recusar aqui, com mensagem
  // clara, em vez de deixar o 500 da constraint chegar na rota.
  if (!slug) throw new Error("Nome de tag inválido.");
  const existing = await getTagBySlug(slug, client);
  if (existing) return existing;
  return await createTag({ name: name.trim(), slug }, client);
}

/** Substitui o conjunto de tags de um post por `tagIds` (patch → replace,
 * porque tags de um post não têm outra representação além do conjunto
 * inteiro). Rodar dentro de uma transação junto com o create/update do
 * post (SPEC §28 evitar múltiplas queries desnecessárias, aqui evitando
 * inconsistência entre post e tags). */
export async function setPostTags(
  postId: string,
  tagIds: string[],
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `DELETE FROM post_tags WHERE post_id = $1`,
    args: [postId],
  });
  if (tagIds.length === 0) return;
  await client.queryObject({
    text: `
      INSERT INTO post_tags (post_id, tag_id)
      SELECT $1, unnest($2::uuid[])
      ON CONFLICT DO NOTHING
    `,
    args: [postId, tagIds],
  });
}

/** Tags de um post, numa única query (evita N+1 — SPEC §28). */
export async function listTagsForPost(
  postId: string,
  client: Queryable = db,
): Promise<Tag[]> {
  const result = await client.queryObject<Tag>({
    text: `
      SELECT t.id, t.name, t.slug FROM tags t
      JOIN post_tags pt ON pt.tag_id = t.id
      WHERE pt.post_id = $1
      ORDER BY t.name
    `,
    args: [postId],
  });
  return result.rows;
}

export async function createTag(
  input: { name: string; slug: string },
  client: Queryable = db,
): Promise<Tag> {
  const result = await client.queryObject<Tag>({
    text: `
      INSERT INTO tags (name, slug) VALUES ($1, $2)
      RETURNING id, name, slug
    `,
    args: [input.name, input.slug],
  });
  return result.rows[0];
}
