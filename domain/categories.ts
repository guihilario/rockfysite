import { db, type Queryable } from "@/core/db/index.ts";
import { slugify } from "@/core/content/slugify.ts";

/** Slugs das duas categorias raiz — seedadas na migration, nunca criadas
 * nem apagadas pela aplicação. `/blog` e `/ajuda` são exatamente estas. */
export const BLOG_SECTION_SLUG = "blog";
export const AJUDA_SECTION_SLUG = "ajuda";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

function fromRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    parentId: row.parent_id,
  };
}

/** As duas categorias raiz (Blog, Ajuda), na ordem em que foram criadas. */
export async function listRootCategories(
  client: Queryable = db,
): Promise<Category[]> {
  const result = await client.queryObject<CategoryRow>({
    text:
      `SELECT id, name, slug, parent_id FROM categories WHERE parent_id IS NULL ORDER BY name`,
  });
  return result.rows.map(fromRow);
}

/** Todas as categorias (raiz + subcategorias) — usado pra montar o select
 * agrupado do form de post e a tela /admin/categories. */
export async function listAllCategories(
  client: Queryable = db,
): Promise<Category[]> {
  const result = await client.queryObject<CategoryRow>({
    text: `
      SELECT id, name, slug, parent_id FROM categories
      ORDER BY COALESCE(parent_id, id), parent_id IS NOT NULL, name
    `,
  });
  return result.rows.map(fromRow);
}

export async function getCategoryById(
  id: string,
  client: Queryable = db,
): Promise<Category | null> {
  const result = await client.queryObject<CategoryRow>({
    text:
      `SELECT id, name, slug, parent_id FROM categories WHERE id = $1 LIMIT 1`,
    args: [id],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

/**
 * Slug da categoria RAIZ de um post — o que decide se ele aparece em
 * /blog ou /ajuda. `null` se o post não tem categoria (não aparece em
 * nenhuma seção).
 */
export async function getSectionSlugForCategory(
  categoryId: string | null,
  client: Queryable = db,
): Promise<string | null> {
  const result = await getCategoryWithRoot(categoryId, client);
  return result?.root.slug ?? null;
}

export type CategoryWithRoot = { category: Category; root: Category };

type CategoryWithRootRow = {
  cat_id: string;
  cat_name: string;
  cat_slug: string;
  cat_parent_id: string | null;
  root_id: string;
  root_name: string;
  root_slug: string;
};

/**
 * A categoria de um post + a raiz dela numa query só — usado tanto pro
 * gate de seção (/blog vs /ajuda) quanto pro breadcrumb da página do post
 * (SPEC §37), evitando pedir isso em duas queries separadas.
 */
export async function getCategoryWithRoot(
  categoryId: string | null,
  client: Queryable = db,
): Promise<CategoryWithRoot | null> {
  if (!categoryId) return null;
  const result = await client.queryObject<CategoryWithRootRow>({
    text: `
      SELECT
        cat.id AS cat_id, cat.name AS cat_name, cat.slug AS cat_slug, cat.parent_id AS cat_parent_id,
        root.id AS root_id, root.name AS root_name, root.slug AS root_slug
      FROM categories cat
      JOIN categories root ON root.id = COALESCE(cat.parent_id, cat.id)
      WHERE cat.id = $1
      LIMIT 1
    `,
    args: [categoryId],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    category: {
      id: row.cat_id,
      name: row.cat_name,
      slug: row.cat_slug,
      parentId: row.cat_parent_id,
    },
    root: {
      id: row.root_id,
      name: row.root_name,
      slug: row.root_slug,
      parentId: null,
    },
  };
}

export type CreateSubcategoryInput = { name: string; parentId: string };

/**
 * Cria uma subcategoria dentro de uma categoria raiz. Rejeita tentar
 * aninhar embaixo de outra subcategoria — no máximo 2 níveis (SPEC do
 * projeto, decisão de 2026-08-18).
 */
export async function createSubcategory(
  input: CreateSubcategoryInput,
  client: Queryable = db,
): Promise<Category> {
  const parent = await getCategoryById(input.parentId, client);
  if (!parent) {
    throw new Error("Categoria pai não encontrada.");
  }
  if (parent.parentId !== null) {
    throw new Error(
      "Subcategorias só podem ser criadas dentro de uma categoria raiz.",
    );
  }

  const slug = slugify(input.name);
  // Nome que não gera slug (ex.: "!!!") gravaria uma categoria quebrada e
  // a segunda tentativa violaria UNIQUE(slug) — recusar com mensagem clara
  // em vez de deixar o erro cru do Postgres chegar na tela.
  if (!slug) throw new Error("Nome inválido — não gera um slug utilizável.");
  const result = await client.queryObject<CategoryRow>({
    text: `
      INSERT INTO categories (name, slug, parent_id) VALUES ($1, $2, $3)
      RETURNING id, name, slug, parent_id
    `,
    args: [input.name.trim(), slug, input.parentId],
  });
  return fromRow(result.rows[0]);
}

/** Só remove subcategorias — categorias raiz são fixas (seedadas via
 * migration, nunca pela aplicação). Posts que usavam essa subcategoria
 * ficam sem categoria (`ON DELETE SET NULL`), não são apagados. */
export async function deleteSubcategory(
  id: string,
  client: Queryable = db,
): Promise<boolean> {
  const result = await client.queryObject({
    text: `DELETE FROM categories WHERE id = $1 AND parent_id IS NOT NULL`,
    args: [id],
  });
  return (result.rowCount ?? 0) > 0;
}
