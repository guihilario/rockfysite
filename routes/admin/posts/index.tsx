import { define } from "@/utils.ts";
import {
  deletePost,
  listAllPosts,
  publishPost,
  unpublishPost,
} from "@/domain/posts.ts";
import { Shell } from "@/components/admin/Shell.tsx";

const POR_PAGINA = 30;

function voltar(url: URL) {
  return new Response(null, {
    status: 303,
    headers: { location: `/admin/posts${url.search}` },
  });
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const pagina = Math.max(1, Number(u.searchParams.get("page") ?? 1) || 1);
    const { posts, hasMore } = await listAllPosts({
      page: pagina,
      perPage: POR_PAGINA,
    });
    return {
      data: {
        posts,
        hasMore,
        pagina,
        usuario: ctx.state.usuario!,
        aviso: u.searchParams.get("ok") ?? undefined,
      },
    };
  },

  /** Ações da listagem chegam como POST de um <form>, para funcionarem
   *  sem JavaScript. */
  async POST(ctx) {
    const form = await ctx.req.formData();
    const id = String(form.get("id") ?? "");
    const acao = String(form.get("acao") ?? "");
    if (!id) return voltar(new URL(ctx.req.url));

    if (acao === "publicar") await publishPost(id);
    else if (acao === "despublicar") await unpublishPost(id);
    else if (acao === "excluir") await deletePost(id);

    const u = new URL(ctx.req.url);
    u.searchParams.set("ok", acao);
    return voltar(u);
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
    <Shell titulo="Posts" usuario={data.usuario} atual="posts">
      <div class="adm-cabeca">
        <div>
          <h1>Posts</h1>
          <p class="adm-meta">
            página {data.pagina} · {data.posts.length} nesta página
          </p>
        </div>
        <a class="btn" href="/admin/posts/novo">Novo post</a>
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      {data.posts.length === 0
        ? <p class="vazio">Nenhum post ainda. Comece criando o primeiro.</p>
        : (
          <table class="adm-tabela">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((p) => (
                <tr key={p.id}>
                  <td class="adm-titulo-cel">
                    <a href={`/admin/posts/${p.id}`}>{p.title}</a>
                    <span class="adm-slug">/{p.slug}</span>
                  </td>
                  <td>{p.categoryName ?? "—"}</td>
                  <td>
                    <span
                      class={p.status === "published"
                        ? "selo selo--pub"
                        : "selo selo--rascunho"}
                    >
                      {p.status === "published" ? "publicado" : "rascunho"}
                    </span>
                  </td>
                  <td class="acoes">
                    <form method="post">
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="acao"
                        value={p.status === "published"
                          ? "despublicar"
                          : "publicar"}
                      />
                      <button class="btn btn--ghost btn--sm" type="submit">
                        {p.status === "published" ? "Despublicar" : "Publicar"}
                      </button>
                    </form>{" "}
                    <form
                      method="post"
                      data-confirmar="Excluir este post? Não dá pra desfazer."
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="acao" value="excluir" />
                      <button class="btn btn--perigo btn--sm" type="submit">
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {(data.pagina > 1 || data.hasMore) && (
        <div class="form-acoes">
          {data.pagina > 1 && (
            <a
              class="btn btn--ghost"
              href={`/admin/posts?page=${data.pagina - 1}`}
            >
              ← Anteriores
            </a>
          )}
          {data.hasMore && (
            <a
              class="btn btn--ghost espaco"
              href={`/admin/posts?page=${data.pagina + 1}`}
            >
              Próximos →
            </a>
          )}
        </div>
      )}
    </Shell>
  );
});
