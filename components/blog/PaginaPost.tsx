import { Layout } from "@/components/Layout.tsx";
import {
  artigoSchema,
  resumirParaMeta,
  trilhaSchema,
} from "@/core/seo/meta.ts";
import { dataCurta } from "@/components/blog/PostGrid.tsx";
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
    `${post.readingMinutes} min de leitura`,
  ]
    .filter(Boolean).join(" · ");

  /* O convite muda conforme a seção: quem lê o blog está se informando e
     pode virar cliente; quem lê a ajuda quase sempre já é, e o que serve
     ali é o caminho para uma pessoa. */
  const convite = base === "/ajuda"
    ? {
      titulo: "Ainda com dúvida?",
      lede:
        "Se este artigo não resolveu, fale com a gente. Quem responde mexe no servidor de verdade.",
      acao: "Falar com o suporte",
      href: "/contato",
    }
    : {
      titulo: "Pronto para pôr no ar?",
      lede:
        "Hospedagem, deploy, loja e e-mail no mesmo painel, com preço em reais e suporte em português.",
      acao: "Ver planos",
      href: "/planos",
    };

  return (
    <Layout
      rota={`${base}/${post.slug}`}
      titulo={`${post.title} | Rockfy`}
      /* O resumo inteiro passava direto para a meta description; com
         mediana de 235 caracteres, quase todo artigo saía truncado no meio
         de uma palavra no resultado de busca. */
      descricao={resumirParaMeta(post.excerpt ?? `${post.title} — Rockfy`)}
      tipoOg="article"
      imagem={post.coverImageUrl ?? undefined}
      jsonLd={[
        artigoSchema(post, base),
        trilhaSchema([
          { nome: "Rockfy", url: "/" },
          { nome: voltar, url: base },
          { nome: post.title, url: `${base}/${post.slug}` },
        ]),
      ]}
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
              <div class="post-lateral-cta">
                <p>{convite.lede}</p>
                <a href={convite.href}>{convite.acao} &rarr;</a>
              </div>
            </aside>
          )}
          {/* Conteúdo já sanitizado acima (allowlist de tags/atributos). */}
          <div
            class="post-conteudo"
            // deno-lint-ignore react-no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <aside class="post-cta">
          <div>
            <p class="post-cta__t">{convite.titulo}</p>
            <p class="post-cta__s">{convite.lede}</p>
          </div>
          <a class="cta" href={convite.href}>
            {convite.acao}
            <span class="badge">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </a>
        </aside>

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
