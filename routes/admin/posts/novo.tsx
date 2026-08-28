import { define } from "@/utils.ts";
import { createPost, generateUniqueSlug } from "@/domain/posts.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { PostForm } from "@/components/admin/PostForm.tsx";
import {
  aplicarTags,
  categoriasComRotulo,
  ErroDeFormulario,
  lerFormulario,
} from "@/core/admin/salvarPost.ts";

export const handler = define.handlers({
  async GET(ctx) {
    return {
      data: {
        categorias: await categoriasComRotulo(),
        usuario: ctx.state.usuario!,
        erro: undefined as string | undefined,
      },
    };
  },

  async POST(ctx) {
    try {
      const campos = await lerFormulario(await ctx.req.formData());
      const post = await createPost({
        title: campos.title,
        slug: await generateUniqueSlug(campos.title),
        excerpt: campos.excerpt,
        content: campos.content,
        coverImageUrl: campos.capa?.url ?? null,
        coverImageWidth: campos.capa?.width ?? null,
        coverImageHeight: campos.capa?.height ?? null,
        authorId: ctx.state.usuario!.id,
        categoryId: campos.categoryId,
      });
      if (campos.tags.length) await aplicarTags(post.id, campos.tags);
      return new Response(null, {
        status: 303,
        headers: { location: `/admin/posts/${post.id}?ok=criado` },
      });
    } catch (e) {
      if (!(e instanceof ErroDeFormulario)) throw e;
      return {
        data: {
          categorias: await categoriasComRotulo(),
          usuario: ctx.state.usuario!,
          erro: e.message,
        },
      };
    }
  },
});

export default define.page<typeof handler>(function NovoPost({ data }) {
  return (
    <Shell
      titulo="Novo post"
      usuario={data.usuario}
      atual="posts"
      head={<link rel="stylesheet" href="/css/quill.snow.css" />}
      scripts={
        <>
          <script src="/js/quill.js"></script>
          <script src="/js/admin-editor.js" defer></script>
        </>
      }
    >
      <div class="adm-cabeca">
        <h1>Novo post</h1>
      </div>
      <PostForm categorias={data.categorias} tags="" erro={data.erro} />
    </Shell>
  );
});
