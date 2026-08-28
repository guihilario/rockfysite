import { Layout } from "@/components/Layout.tsx";
import { dataCurta, tempoLeitura } from "@/components/blog/PostGrid.tsx";
import type { Post } from "@/domain/posts.ts";
import type { Heading } from "@/core/content/sanitize.ts";

type Props = {
  post: Post;
  /** HTML já sanitizado no servidor — nunca o `post.content` cru. */
  html: string;
  headings: Heading[];
  base: string;
  voltar: string;
};

/** Um post. O HTML passa pelo sanitizer a cada render (nunca só no save),
 *  e os `id` dos h2/h3 vêm do mesmo passo, alimentando o sumário. */
export function PaginaPost({ post, html, headings, base, voltar }: Props) {
  const meta = [
    dataCurta(post.publishedAt),
    `${tempoLeitura(post.content)} min de leitura`,
  ]
    .filter(Boolean).join(" · ");

  return (
    <Layout
      rota={`${base}/${post.slug}`}
      titulo={`${post.title} | Rockfy`}
      descricao={post.excerpt ?? `${post.title} — Rockfy`}
    >
      <article class="post-page">
        <p class="eyebrow">
          <a href={base}>{voltar}</a>
          {post.categoryName ? ` · ${post.categoryName}` : ""}
        </p>
        <h1 class="title post-page__titulo">{post.title}</h1>
        <p class="post__meta">{meta}</p>
        {post.excerpt && <p class="para post-page__lede">{post.excerpt}</p>}

        {post.coverImageUrl && (
          <img
            class="post-page__capa"
            src={post.coverImageUrl}
            alt=""
            width={post.coverImageWidth ?? 1200}
            height={post.coverImageHeight ?? 675}
            decoding="async"
          />
        )}

        <div class="post-page__corpo">
          {headings.length > 1 && (
            <aside class="post-sumario" aria-label="Nesta página">
              <p class="post-sumario__t">Nesta página</p>
              <ol>
                {headings.map((h) => (
                  <li key={h.id} class={h.level === 3 ? "is-sub" : undefined}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
          {/* Conteúdo já sanitizado acima (allowlist de tags/atributos). */}
          <div
            class="post-conteudo"
            // deno-lint-ignore react-no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {post.tagNames.length > 0 && (
          <p class="post-tags">
            {post.tagNames.map((t) => (
              <a key={t} href={`${base}?tag=${encodeURIComponent(t)}`}>#{t}</a>
            ))}
          </p>
        )}
      </article>
    </Layout>
  );
}
