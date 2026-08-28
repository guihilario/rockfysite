import { define } from "@/utils.ts";
import { listPublishedPosts } from "@/domain/posts.ts";
import { BLOG_SECTION_SLUG } from "@/domain/categories.ts";
import { ListagemBlog } from "@/components/blog/ListagemBlog.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const pagina = Math.max(1, Number(u.searchParams.get("page") ?? 1) || 1);
    const q = u.searchParams.get("q")?.trim() || undefined;
    const tag = u.searchParams.get("tag")?.trim() || undefined;
    const { posts, hasMore } = await listPublishedPosts({
      section: BLOG_SECTION_SLUG,
      page: pagina,
      perPage: 12,
      q,
      tag,
    });
    return { data: { posts, hasMore, pagina, q, tag } };
  },
});

export default define.page<typeof handler>(function Blog({ data }) {
  return (
    <ListagemBlog
      rota="/blog"
      titulo="Blog | Rockfy"
      descricao="Artigos sobre hospedagem, deploy, WordPress e gestão de projetos digitais."
      chapeu="Blog"
      h1={
        <>
          Para ler <em>depois</em>
        </>
      }
      intro="O que a gente aprende cuidando de infraestrutura — em texto, sem enrolação."
      base="/blog"
      posts={data.posts}
      pagina={data.pagina}
      temMais={data.hasMore}
      busca={data.q}
      tag={data.tag}
    />
  );
});
