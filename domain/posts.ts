import { db, type Queryable } from "@/core/db/index.ts";
import { slugify } from "@/core/content/slugify.ts";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  /** Dimensões reais da imagem processada (SPEC §27) — `null` pra posts
   * criados antes dessa coluna existir ou sem imagem de capa. */
  coverImageWidth: number | null;
  coverImageHeight: number | null;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string | null;
  /** Nome da categoria (join com `categories`) — só presente quando a
   * query junta a tabela (ex.: listagem pública). `null` nas demais. */
  categoryName: string | null;
  /** Nomes das tags (#assunto) — agregados na query da listagem pública
   * pra os cards mostrarem as pills sem N+1 (SPEC §28). */
  tagNames: string[];
  /** Minutos de leitura. Vem calculado do SQL nas listagens, para elas
   *  não precisarem baixar o corpo de cada artigo. */
  readingMinutes: number;
  /** Slug da categoria raiz ("blog" ou "ajuda") — decide a seção pública.
   *  Vem no mesmo SELECT de `getPostBySlug`, para a página do post não
   *  gastar uma segunda ida ao banco só para descobrir onde ele mora. */
  sectionSlug?: string | null;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  /** Ausente nas listagens: elas não trazem o corpo do artigo. */
  content?: string;
  cover_image_url: string | null;
  cover_image_width: number | null;
  cover_image_height: number | null;
  status: PostStatus;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  author_id: string;
  category_id: string | null;
  category_name?: string | null;
  tag_names?: string[] | null;
  /** Só nas listagens (LIST_COLUMNS), calculado no SQL. */
  reading_minutes?: number;
  section_slug?: string | null;
};

function fromRow(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content ?? "",
    coverImageUrl: row.cover_image_url,
    coverImageWidth: row.cover_image_width,
    coverImageHeight: row.cover_image_height,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorId: row.author_id,
    categoryId: row.category_id,
    categoryName: row.category_name ?? null,
    tagNames: row.tag_names ?? [],
    /* Nas listagens vem do SQL; na leitura de um post só, calcula do corpo
       que já está em mãos. */
    sectionSlug: row.section_slug ?? null,
    readingMinutes: row.reading_minutes ??
      Math.max(
        1,
        Math.ceil((row.content ?? "").replace(/<[^>]+>/g, " ").length / 1100),
      ),
  };
}

// Prefixado com "posts." — necessário desde que listPublishedPosts passou a
// dar LEFT JOIN em categories, que também tem uma coluna "id".
const SELECT_COLUMNS = `
  posts.id, posts.title, posts.slug, posts.excerpt, posts.content,
  posts.cover_image_url, posts.cover_image_width, posts.cover_image_height,
  posts.status, posts.published_at, posts.created_at,
  posts.updated_at, posts.author_id, posts.category_id
`;

/**
 * As mesmas colunas, sem `content`.
 *
 * O corpo do artigo tem ~2 KB por post e a listagem só mostra o resumo —
 * trazer os 12 corpos custava cerca de 19 ms por página, só de bytes na
 * rede (o banco fica em São Paulo). O único uso que a listagem fazia do
 * corpo era calcular o tempo de leitura, então esse cálculo desce para o
 * SQL: volta um inteiro no lugar de dois quilobytes por linha.
 */
const LIST_COLUMNS = `
  posts.id, posts.title, posts.slug, posts.excerpt,
  posts.cover_image_url, posts.cover_image_width, posts.cover_image_height,
  posts.status, posts.published_at, posts.created_at,
  posts.updated_at, posts.author_id, posts.category_id,
  GREATEST(1, CEIL(LENGTH(REGEXP_REPLACE(posts.content, '<[^>]+>', ' ', 'g')) / 1100.0))::int AS reading_minutes
`;

export type ListPostsFilter = {
  page?: number;
  perPage?: number;
  /** Busca livre em title/excerpt (ILIKE). */
  q?: string;
  /** Slug de uma tag (#assunto) — filtro livre, ortogonal à categoria. */
  tag?: string;
  /** Slug da categoria RAIZ ('blog' ou 'ajuda') — decide a seção do site.
   * Sem isso, a listagem não é restrita a nenhuma seção. */
  section?: string;
  /** Slug de uma subcategoria dentro da seção — filtro mais específico. */
  subcategory?: string;
};

export type ListPostsResult = {
  posts: Post[];
  hasMore: boolean;
};

// As faixas de posts nas páginas institucionais são conteúdo secundário e
// repetem os mesmos filtros. Um cache curto evita que cada renderização da
// home/produto espere uma ida ao Postgres, sem deixar publicação ou edição
// antiga visível por mais de um minuto dentro de uma instância.
const PUBLIC_POSTS_CACHE_TTL_MS = 60_000;
const publicPostsCache = new Map<
  string,
  { value: ListPostsResult; expiresAt: number }
>();

/**
 * Somente posts `published`, mais recentes primeiro, paginado (SPEC §44).
 * Busca perPage+1 linhas pra saber se há próxima página sem um segundo
 * SELECT count(*) (SPEC §28, evitar consultas repetidas).
 *
 * `section`/`subcategory` decidem em qual página o post aparece (/blog vs
 * /ajuda); `tag` é um filtro de assunto independente disso. O join com
 * `root` resolve a categoria raiz em uma consulta só, sem CTE recursiva —
 * a hierarquia tem no máximo 2 níveis por design (SPEC do projeto).
 */
export async function listPublishedPosts(
  { page = 1, perPage = 12, q, tag, section, subcategory }: ListPostsFilter =
    {},
  client: Queryable = db,
): Promise<ListPostsResult> {
  const offset = (page - 1) * perPage;
  const result = await client.queryObject<PostRow>({
    text: `
      SELECT ${LIST_COLUMNS},
        cat.name AS category_name,
        -- A seção (blog/ajuda) vem da categoria raiz e é o que monta a
        -- URL pública do post. O JOIN de root já existia para o filtro.
        root.slug AS section_slug,
        tg.tag_names
      FROM posts
      LEFT JOIN categories cat ON cat.id = posts.category_id
      LEFT JOIN categories root ON root.id = COALESCE(cat.parent_id, cat.id)
      LEFT JOIN LATERAL (
        SELECT COALESCE(array_agg(t.name ORDER BY t.name), '{}') AS tag_names
        FROM post_tags pt
        JOIN tags t ON t.id = pt.tag_id
        WHERE pt.post_id = posts.id
      ) tg ON TRUE
      WHERE status = 'published'
        AND ($3::text IS NULL OR title ILIKE '%' || $3 || '%' OR excerpt ILIKE '%' || $3 || '%')
        AND ($4::text IS NULL OR EXISTS (
          SELECT 1 FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = posts.id AND t.slug = $4
        ))
        AND ($5::text IS NULL OR root.slug = $5)
        AND ($6::text IS NULL OR cat.slug = $6)
      ORDER BY published_at DESC
      LIMIT $1 OFFSET $2
    `,
    args: [
      perPage + 1,
      offset,
      q ?? null,
      tag ?? null,
      section ?? null,
      subcategory ?? null,
    ],
  });
  const rows = result.rows.map(fromRow);
  return { posts: rows.slice(0, perPage), hasMore: rows.length > perPage };
}

/**
 * A mesma listagem, para quem mostra posts como enfeite.
 *
 * Nas páginas de produto a faixa "Se liga" é conteúdo secundário: se o banco
 * estiver fora do ar, a página deve continuar de pé sem ela — vender
 * hospedagem não depende de listar artigos. Sem isto, um tropeço no banco
 * derrubava a página inteira em 500, que era o erro intermitente relatado.
 *
 * Só para faixas assim. Onde o post É a página (/blog, /ajuda), o erro tem
 * que subir: melhor a página de erro do que uma listagem vazia mentindo que
 * não existe conteúdo.
 */
export async function listPublishedPostsOrNone(
  filter: ListPostsFilter = {},
  client: Queryable = db,
): Promise<ListPostsResult> {
  // Clientes injetados são usados em testes e operações explícitas; cachear
  // apenas o pool real evita misturar resultados de fontes diferentes.
  const cacheKey = client === db ? JSON.stringify(filter) : null;
  if (cacheKey !== null) {
    const cached = publicPostsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    if (cached) publicPostsCache.delete(cacheKey);
  }

  try {
    const result = await listPublishedPosts(filter, client);
    if (cacheKey !== null) {
      publicPostsCache.set(cacheKey, {
        value: result,
        expiresAt: Date.now() + PUBLIC_POSTS_CACHE_TTL_MS,
      });
    }
    return result;
  } catch (error) {
    console.error("[posts] faixa de posts indisponível:", error);
    return { posts: [], hasMore: false };
  }
}

/**
 * Busca por slug. `includeDrafts` deve vir `true` apenas em contexto
 * autenticado (admin/preview) — nunca em rota pública.
 */
export async function getPostBySlug(
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
  client: Queryable = db,
): Promise<Post | null> {
  const result = await client.queryObject<PostRow>({
    text: `
      SELECT ${SELECT_COLUMNS},
        cat.name AS category_name,
        root.slug AS section_slug
      FROM posts
      LEFT JOIN categories cat ON cat.id = posts.category_id
      LEFT JOIN categories root ON root.id = COALESCE(cat.parent_id, cat.id)
      WHERE posts.slug = $1 ${
      includeDrafts ? "" : "AND posts.status = 'published'"
    }
      LIMIT 1
    `,
    args: [slug],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function getPostById(
  id: string,
  client: Queryable = db,
): Promise<Post | null> {
  const result = await client.queryObject<PostRow>({
    text: `SELECT ${SELECT_COLUMNS} FROM posts WHERE id = $1 LIMIT 1`,
    args: [id],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

/**
 * Slug a partir do título, sufixado até ficar único (SPEC §48). Só usado
 * na criação — depois disso o slug nunca muda automaticamente.
 */
export async function generateUniqueSlug(
  title: string,
  client: Queryable = db,
): Promise<string> {
  const base = slugify(title) || "post";
  let candidate = base;
  let suffix = 2;

  while (await slugExists(candidate, client)) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

async function slugExists(slug: string, client: Queryable): Promise<boolean> {
  const result = await client.queryObject({
    text: `SELECT 1 FROM posts WHERE slug = $1 LIMIT 1`,
    args: [slug],
  });
  return result.rows.length > 0;
}

export type ListAllPostsResult = {
  posts: Post[];
  hasMore: boolean;
};

/** Todos os posts (draft + published), mais recentemente atualizados
 * primeiro — só pro admin, nunca exposto publicamente. */
export async function listAllPosts(
  { page = 1, perPage = 20, q }: {
    page?: number;
    perPage?: number;
    /** Busca livre em título, resumo e slug. */
    q?: string;
  } = {},
  client: Queryable = db,
): Promise<ListAllPostsResult> {
  const offset = (page - 1) * perPage;
  const busca = q?.trim() ? `%${q.trim()}%` : null;
  const result = await client.queryObject<PostRow>({
    text: `
      SELECT ${LIST_COLUMNS},
        cat.name AS category_name
      FROM posts
      LEFT JOIN categories cat ON cat.id = posts.category_id
      WHERE ($3::text IS NULL
             OR posts.title ILIKE $3
             OR posts.excerpt ILIKE $3
             OR posts.slug ILIKE $3)
      ORDER BY posts.updated_at DESC
      LIMIT $1 OFFSET $2
    `,
    args: [perPage + 1, offset, busca],
  });
  const rows = result.rows.map(fromRow);
  return { posts: rows.slice(0, perPage), hasMore: rows.length > perPage };
}

export type SitemapEntry = { slug: string; section: string; updatedAt: Date };

/**
 * Só o essencial pro sitemap (SPEC §35): posts publicados COM categoria —
 * um post sem categoria não tem URL pública (nem /blog nem /ajuda), então
 * não pertence ao sitemap. Drafts já ficam de fora por `status = 'published'`.
 */
export async function listPublishedPostsForSitemap(
  client: Queryable = db,
): Promise<SitemapEntry[]> {
  const result = await client.queryObject<
    { slug: string; section: string; updated_at: Date }
  >({
    text: `
      SELECT posts.slug, root.slug AS section, posts.updated_at
      FROM posts
      JOIN categories cat ON cat.id = posts.category_id
      JOIN categories root ON root.id = COALESCE(cat.parent_id, cat.id)
      WHERE posts.status = 'published'
      ORDER BY posts.updated_at DESC
    `,
  });
  return result.rows.map((row) => ({
    slug: row.slug,
    section: row.section,
    updatedAt: row.updated_at,
  }));
}

export type CreatePostInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  authorId: string;
  categoryId?: string | null;
};

/** Cria post como `draft`. Publicar é uma ação explícita separada. */
export async function createPost(
  input: CreatePostInput,
  client: Queryable = db,
): Promise<Post> {
  const result = await client.queryObject<PostRow>({
    text: `
      INSERT INTO posts (
        title, slug, excerpt, content, cover_image_url,
        cover_image_width, cover_image_height, author_id, category_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [
      input.title,
      input.slug,
      input.excerpt ?? null,
      input.content,
      input.coverImageUrl ?? null,
      input.coverImageWidth ?? null,
      input.coverImageHeight ?? null,
      input.authorId,
      input.categoryId ?? null,
    ],
  });
  return fromRow(result.rows[0]);
}

export type UpdatePostInput = Partial<{
  title: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  coverImageWidth: number | null;
  coverImageHeight: number | null;
  categoryId: string | null;
}>;

const UPDATE_COLUMN_BY_KEY: Record<keyof UpdatePostInput, string> = {
  title: "title",
  excerpt: "excerpt",
  content: "content",
  coverImageUrl: "cover_image_url",
  coverImageWidth: "cover_image_width",
  coverImageHeight: "cover_image_height",
  categoryId: "category_id",
};

/**
 * Atualiza somente os campos presentes em `input` — patch, não replace.
 * `slug` propositalmente não é editável por aqui: mudar o slug de um post
 * quebraria URLs existentes (SPEC §48). Chamar com `input` vazio é um no-op
 * que apenas retorna o post atual.
 */
export async function updatePost(
  id: string,
  input: UpdatePostInput,
  client: Queryable = db,
): Promise<Post | null> {
  const keys = Object.keys(input) as (keyof UpdatePostInput)[];
  if (keys.length === 0) {
    return await getPostById(id, client);
  }

  const setClauses = keys.map((key, i) =>
    `${UPDATE_COLUMN_BY_KEY[key]} = $${i + 2}`
  );
  const values = keys.map((key) => input[key]);

  const result = await client.queryObject<PostRow>({
    text: `
      UPDATE posts
      SET ${setClauses.join(", ")}, updated_at = now()
      WHERE id = $1
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [id, ...values],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

/** Publica um post, carimbando `published_at` na primeira publicação. */
export async function publishPost(
  id: string,
  client: Queryable = db,
): Promise<Post | null> {
  const result = await client.queryObject<PostRow>({
    text: `
      UPDATE posts
      SET status = 'published',
          published_at = COALESCE(published_at, now()),
          updated_at = now()
      WHERE id = $1
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [id],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

export async function unpublishPost(
  id: string,
  client: Queryable = db,
): Promise<Post | null> {
  const result = await client.queryObject<PostRow>({
    text: `
      UPDATE posts SET status = 'draft', updated_at = now()
      WHERE id = $1
      RETURNING ${SELECT_COLUMNS}
    `,
    args: [id],
  });
  return result.rows[0] ? fromRow(result.rows[0]) : null;
}

/** Exclusão exige chamada explícita — nunca acionável via GET (SPEC §46). */
export async function deletePost(
  id: string,
  client: Queryable = db,
): Promise<boolean> {
  const result = await client.queryObject({
    text: `DELETE FROM posts WHERE id = $1`,
    args: [id],
  });
  return (result.rowCount ?? 0) > 0;
}
