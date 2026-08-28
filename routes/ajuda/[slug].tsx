import { HttpError } from "fresh";
import { define } from "@/utils.ts";
import { getPostBySlug } from "@/domain/posts.ts";
import { AJUDA_SECTION_SLUG } from "@/domain/categories.ts";
import { sanitizeContent } from "@/core/content/sanitize.ts";
import { PaginaPost } from "@/components/blog/PaginaPost.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await getPostBySlug(ctx.params.slug);
    if (!post || post.status !== "published") throw new HttpError(404);
    // Espelho do que /blog faz: a categoria raiz decide a seção, e ela já
    // vem no mesmo SELECT do post.
    if (post.sectionSlug !== AJUDA_SECTION_SLUG) throw new HttpError(404);
    const { html, headings } = sanitizeContent(post.content);
    return { data: { post, html, headings } };
  },
});

export default define.page<typeof handler>(function PostAjuda({ data }) {
  return (
    <PaginaPost
      post={data.post}
      html={data.html}
      headings={data.headings}
      base="/ajuda"
      voltar="Central de ajuda"
    />
  );
});
