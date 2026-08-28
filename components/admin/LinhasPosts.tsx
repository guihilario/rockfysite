import type { Post } from "@/domain/posts.ts";

/** As linhas da tabela de posts. Vive em separado porque o scroll infinito
 *  pede só este pedaço ao servidor e o anexa ao fim da tabela. */
export function LinhasPosts({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((p) => (
        <tr key={p.id}>
          <td class="adm-capa-cel">
            {p.coverImageUrl
              ? (
                <img
                  class="adm-thumb"
                  src={p.coverImageUrl}
                  alt=""
                  width={p.coverImageWidth ?? 96}
                  height={p.coverImageHeight ?? 60}
                  loading="lazy"
                  decoding="async"
                />
              )
              : <span class="adm-thumb adm-thumb--vazia" aria-hidden="true" />}
          </td>
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
            <form method="post" action="/admin/posts">
              <input type="hidden" name="id" value={p.id} />
              <input
                type="hidden"
                name="acao"
                value={p.status === "published" ? "despublicar" : "publicar"}
              />
              <button class="btn btn--ghost btn--sm" type="submit">
                {p.status === "published" ? "Despublicar" : "Publicar"}
              </button>
            </form>{" "}
            <form
              method="post"
              action="/admin/posts"
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
    </>
  );
}
