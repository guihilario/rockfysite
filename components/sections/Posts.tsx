import type { Post } from "@/domain/posts.ts";
import { PostCard } from "@/components/blog/PostGrid.tsx";

/**
 * Faixa do blog, antes do rodapé. No mobile o trilho arrasta (ver
 * scripts.js).
 *
 * Os cards vêm do banco, mas a consulta não pesa na renderização: o
 * `listPublishedPostsOrNone` guarda o resultado por um minuto, então é
 * uma ida ao Postgres por minuto por instância (~15 ms) em vez de uma por
 * requisição. Ele também engole falha de banco devolvendo lista vazia —
 * faixa decorativa não pode derrubar uma página de produto.
 *
 * Os posts chegam prontos da rota: o Fresh aguarda o componente de rota,
 * mas não um componente aninhado — se este fosse `async`, o Preact
 * renderizaria a Promise como vazio, sem erro nenhum.
 */
export function Posts({ posts }: { posts: Post[] }) {
  // Sem post nenhum (banco fora do ar, ou seção vazia) a faixa inteira sai:
  // melhor não existir do que existir vazia, com título e botão sozinhos.
  if (posts.length === 0) return null;

  return (
    <>
      {/* ══════ POSTS ══════ */}
      <section class="section">
        <div class="conteudo">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p class="eyebrow">Blog</p>
              <h2 class="title">
                Para ler <em>depois</em>
              </h2>
            </div>
            <a class="cta" href="/blog" style={{ marginTop: "0" }}>
              Todos os posts
              <span class="badge">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          <div class="posts">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                // A seção real do post é quem monta a URL: um artigo de
                // ajuda vive em /ajuda, nunca em /blog.
                base={`/${p.sectionSlug ?? "blog"}`}
              />
            ))}
          </div>
          <div class="dots" id="postDots"></div>
        </div>
      </section>
    </>
  );
}
