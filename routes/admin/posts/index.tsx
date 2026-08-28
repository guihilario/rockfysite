import { define } from "@/utils.ts";
import {
  deletePost,
  listAllPosts,
  publishPost,
  unpublishPost,
} from "@/domain/posts.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { LinhasPosts } from "@/components/admin/LinhasPosts.tsx";

const POR_PAGINA = 20;

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const q = u.searchParams.get("q")?.trim() || undefined;
    const { posts, hasMore } = await listAllPosts({ perPage: POR_PAGINA, q });
    return {
      data: {
        posts,
        hasMore,
        q,
        usuario: ctx.state.usuario!,
        aviso: u.searchParams.get("ok") ?? undefined,
      },
    };
  },

  /** Publicar, despublicar e excluir chegam como POST de um <form>, para
   *  funcionarem mesmo sem JavaScript. */
  async POST(ctx) {
    const form = await ctx.req.formData();
    const id = String(form.get("id") ?? "");
    const acao = String(form.get("acao") ?? "");
    const u = new URL(ctx.req.url);

    if (id) {
      if (acao === "publicar") await publishPost(id);
      else if (acao === "despublicar") await unpublishPost(id);
      else if (acao === "excluir") await deletePost(id);
      u.searchParams.set("ok", acao);
    }
    return new Response(null, {
      status: 303,
      headers: { location: `/admin/posts${u.search}` },
    });
  },
});

const RECADO: Record<string, string> = {
  publicar: "Post publicado.",
  despublicar: "Post voltou para rascunho.",
  excluir: "Post excluído.",
  salvo: "Alterações salvas.",
  criado: "Post criado.",
};

export default define.page<typeof handler>(function AdminPosts({ data }) {
  return (
    <Shell
      titulo="Posts"
      usuario={data.usuario}
      atual="posts"
      scripts={<script src="/js/admin-lista.js" defer></script>}
    >
      <div class="adm-cabeca">
        <div>
          <h1>Posts</h1>
          <p class="adm-meta">
            {data.q
              ? (
                <>
                  resultados para <b>{data.q}</b>
                </>
              )
              : "os mais recentes primeiro"}
          </p>
        </div>
        <a class="btn" href="/admin/posts/novo">Novo post</a>
      </div>

      <form class="adm-busca" method="get" role="search">
        <input
          type="search"
          name="q"
          value={data.q ?? ""}
          placeholder="Buscar por título, resumo ou endereço"
          aria-label="Buscar posts"
        />
        <button class="btn btn--ghost" type="submit">Buscar</button>
        {data.q && <a class="btn btn--ghost" href="/admin/posts">Limpar</a>}
      </form>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      {data.posts.length === 0
        ? (
          <p class="vazio">
            {data.q
              ? "Nenhum post encontrado para essa busca."
              : "Nenhum post ainda. Comece criando o primeiro."}
          </p>
        )
        : (
          <>
            <table
              class="adm-tabela"
              id="tabelaPosts"
              data-q={data.q ?? ""}
              data-tem-mais={data.hasMore ? "1" : "0"}
            >
              <thead>
                <tr>
                  <th class="adm-capa-col"></th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="corpoPosts">
                <LinhasPosts posts={data.posts} />
              </tbody>
            </table>

            {
              /* Sentinela do scroll infinito. Sem JavaScript vira um link
                comum para a próxima página. */
            }
            <div class="adm-mais" id="sentinela" hidden={!data.hasMore}>
              <a
                class="btn btn--ghost"
                href={`/admin/posts/lote?page=2${
                  data.q ? `&q=${encodeURIComponent(data.q)}` : ""
                }`}
              >
                Carregar mais
              </a>
            </div>
          </>
        )}
    </Shell>
  );
});
