import { define } from "@/utils.ts";
import { listPublishedPosts } from "@/domain/posts.ts";
import { AJUDA_SECTION_SLUG } from "@/domain/categories.ts";
import { ListagemBlog } from "@/components/blog/ListagemBlog.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const pagina = Math.max(1, Number(u.searchParams.get("page") ?? 1) || 1);
    const q = u.searchParams.get("q")?.trim() || undefined;
    const tag = u.searchParams.get("tag")?.trim() || undefined;
    const { posts, hasMore } = await listPublishedPosts({
      section: AJUDA_SECTION_SLUG,
      page: pagina,
      perPage: 12,
      q,
      tag,
    });
    return { data: { posts, hasMore, pagina, q, tag } };
  },
});

export default define.page<typeof handler>(function Ajuda({ data }) {
  return (
    <ListagemBlog
      rota="/ajuda"
      titulo="Central de ajuda | Rockfy"
      descricao="Guias e respostas para usar a Rockfy: migração, painel, e-mail, domínios e suporte."
      chapeu="Central de ajuda"
      h1={
        <>
          Como <b>podemos</b> <em>ajudar?</em>
        </>
      }
      intro="Guias curtos para resolver sozinho. Se não achar, o suporte responde das 8h às 22h."
      base="/ajuda"
      posts={data.posts}
      pagina={data.pagina}
      temMais={data.hasMore}
      busca={data.q}
      tag={data.tag}
    />
  );
});
