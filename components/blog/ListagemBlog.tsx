import { Layout } from "@/components/Layout.tsx";
import { PostGrid } from "@/components/blog/PostGrid.tsx";
import type { Post } from "@/domain/posts.ts";

type Props = {
  rota: string;
  titulo: string;
  descricao: string;
  /** Dados estruturados da listagem (ItemList). */
  jsonLd?: unknown[];
  chapeu: string;
  h1: preact.ComponentChildren;
  intro: string;
  posts: Post[];
  base: string;
  pagina: number;
  temMais: boolean;
  busca?: string;
  tag?: string;
};

/** Corpo comum de /blog e /ajuda: cabeçalho, busca, grade e paginação. */
export function ListagemBlog(
  {
    rota,
    titulo,
    descricao,
    jsonLd,
    chapeu,
    h1,
    intro,
    posts,
    base,
    pagina,
    temMais,
    busca,
    tag,
  }: Props,
) {
  const url = (p: number) => {
    const q = new URLSearchParams();
    if (busca) q.set("q", busca);
    if (tag) q.set("tag", tag);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `${base}?${s}` : base;
  };

  return (
    <Layout
      rota={rota}
      titulo={titulo}
      descricao={descricao}
      jsonLd={jsonLd}
    >
      <section class="section">
        <div>
          <p class="eyebrow">{chapeu}</p>
          <h1 class="title">{h1}</h1>
          <p class="para">{intro}</p>
        </div>

        <form class="blog-busca" method="get" action={base} role="search">
          <input
            type="search"
            name="q"
            value={busca ?? ""}
            placeholder="Buscar por título ou resumo"
            aria-label="Buscar"
          />
          {tag && <input type="hidden" name="tag" value={tag} />}
          <button type="submit">Buscar</button>
        </form>

        {tag && (
          <p class="blog-filtro">
            Filtrando por <b>#{tag}</b> · <a href={base}>limpar</a>
          </p>
        )}

        <PostGrid posts={posts} base={base} />

        {(pagina > 1 || temMais) && (
          <nav class="blog-paginacao" aria-label="Paginação">
            {pagina > 1
              ? <a href={url(pagina - 1)}>← Anteriores</a>
              : <span aria-hidden="true"></span>}
            <span class="blog-paginacao__n">página {pagina}</span>
            {temMais ? <a href={url(pagina + 1)}>Próximos →</a> : <span></span>}
          </nav>
        )}
      </section>
    </Layout>
  );
}
