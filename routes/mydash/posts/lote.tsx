import { define } from "@/utils.ts";
import { listAllPosts } from "@/domain/posts.ts";
import { LinhasPosts } from "@/components/admin/LinhasPosts.tsx";

/**
 * Um lote de linhas para o scroll infinito.
 *
 * Devolve só as `<tr>`, sem casca — o cliente as anexa ao `<tbody>` que já
 * está na tela. `data-tem-mais` diz se vale pedir a próxima página.
 */
export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const pagina = Math.max(1, Number(u.searchParams.get("page") ?? 1) || 1);
    const q = u.searchParams.get("q")?.trim() || undefined;
    const { posts, hasMore } = await listAllPosts({
      page: pagina,
      perPage: 20,
      q,
    });
    return { data: { posts, hasMore } };
  },
});

export default define.page<typeof handler>(function Lote({ data }) {
  return (
    <table data-tem-mais={data.hasMore ? "1" : "0"}>
      <tbody>
        <LinhasPosts posts={data.posts} />
      </tbody>
    </table>
  );
});
