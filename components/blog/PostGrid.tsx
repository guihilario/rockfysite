import type { Post } from "@/domain/posts.ts";

/**
 * A grade de posts das listagens (/blog e /ajuda).
 *
 * Reaproveita as classes `.posts` / `.post` que o site já usa na faixa do
 * blog da home — mesmo desenho, sem CSS novo.
 */
const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** "12 ago" — o mesmo formato dos cards estáticos da home. */
export function dataCurta(d: Date | null): string {
  if (!d) return "";
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}

/* O tempo de leitura vem pronto em `post.readingMinutes`: é calculado no
   SQL para a listagem não precisar baixar o corpo de cada artigo. */

/**
 * `nivel` existe por causa da hierarquia de títulos: nas listagens o card é
 * o conteúdo principal, logo abaixo do h1, e usar h3 ali pulava um nível.
 * Na faixa do rodapé das outras páginas ele vem depois de um h2 ("Para ler
 * depois"), e aí h3 é o certo.
 */
export function PostCard(
  { post, base, nivel = 3 }: { post: Post; base: string; nivel?: 2 | 3 },
) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  const meta = [
    dataCurta(post.publishedAt),
    `${post.readingMinutes} min`,
  ]
    .filter(Boolean).join(" · ");

  return (
    <a class="post" href={`${base}/${post.slug}`}>
      <span class="post__media">
        {post.coverImageUrl
          ? (
            <img
              class="post__cover"
              src={post.coverImageUrl}
              alt=""
              width={post.coverImageWidth ?? 600}
              height={post.coverImageHeight ?? 375}
              loading="lazy"
              decoding="async"
            />
          )
          : null}
        {post.categoryName && <span class="post__tag">{post.categoryName}
        </span>}
      </span>
      <p class="post__meta">{meta}</p>
      <Titulo class="post__title">{post.title}</Titulo>
      {post.excerpt && <p class="post__text">{post.excerpt}</p>}
      <span class="post__link">
        Ler{" "}
        <svg viewBox="0 0 24 24">
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

export function PostGrid(
  { posts, base }: { posts: Post[]; base: string },
) {
  if (posts.length === 0) {
    return <p class="para">Nenhum post encontrado por aqui ainda.</p>;
  }
  return (
    <div class="posts posts--grid">
      {posts.map((p) => <PostCard key={p.id} post={p} base={base} nivel={2} />)}
    </div>
  );
}
