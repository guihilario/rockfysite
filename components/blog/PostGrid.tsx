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

/** ~200 palavras por minuto, arredondado pra cima, mínimo 1. */
export function tempoLeitura(html: string): number {
  const palavras = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(palavras / 200));
}

export function PostCard({ post, base }: { post: Post; base: string }) {
  const meta = [
    dataCurta(post.publishedAt),
    `${tempoLeitura(post.content)} min`,
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
      <h3 class="post__title">{post.title}</h3>
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

export function PostGrid({ posts, base }: { posts: Post[]; base: string }) {
  if (posts.length === 0) {
    return <p class="para">Nenhum post encontrado por aqui ainda.</p>;
  }
  return (
    <div class="posts posts--grid">
      {posts.map((p) => <PostCard key={p.id} post={p} base={base} />)}
    </div>
  );
}
