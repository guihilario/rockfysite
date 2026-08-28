import { HttpError } from "fresh";
import { define } from "@/utils.ts";
import { getPostBySlug } from "@/domain/posts.ts";
import { BLOG_SECTION_SLUG } from "@/domain/categories.ts";
import { sanitizeContent } from "@/core/content/sanitize.ts";
import { PaginaPost } from "@/components/blog/PaginaPost.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const post = await getPostBySlug(ctx.params.slug);
    if (!post || post.status !== "published") throw new HttpError(404);
    // Um post de /ajuda não pode ser servido em /blog: é a categoria (uma
    // por post) que decide a seção. A seção já vem no mesmo SELECT.
    if (post.sectionSlug !== BLOG_SECTION_SLUG) throw new HttpError(404);
    const { html, headings } = sanitizeContent(post.content);
    return { data: { post, html, headings } };
  },
});

export default define.page<typeof handler>(function PostBlog({ data }) {
  return (
    <PaginaPost
      post={data.post}
      html={data.html}
      headings={data.headings}
      base="/blog"
      voltar="Blog"
    />
  );
});
