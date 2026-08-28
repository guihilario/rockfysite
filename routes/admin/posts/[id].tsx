import { HttpError } from "fresh";
import { define } from "@/utils.ts";
import { getPostById, publishPost, updatePost } from "@/domain/posts.ts";
import { listTagsForPost } from "@/domain/tags.ts";
import { getSectionSlugForCategory } from "@/domain/categories.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { PostForm } from "@/components/admin/PostForm.tsx";
import {
  aplicarTags,
  categoriasComRotulo,
  ErroDeFormulario,
  lerFormulario,
} from "@/core/admin/salvarPost.ts";

const RECADO: Record<string, string> = {
  criado: "Post criado. Ele ainda é um rascunho — publique quando quiser.",
  salvo: "Alterações salvas.",
  publicado: "Post publicado.",
};

async function carregar(id: string, usuario: { id: string; email: string }) {
  const post = await getPostById(id);
  if (!post) throw new HttpError(404);
  const tags = await listTagsForPost(id);
  // A seção real vem da categoria raiz — é o que decide a URL pública.
  const secao = await getSectionSlugForCategory(post.categoryId);
  return {
    post,
    tags: tags.map((t) => t.name).join(", "),
    categorias: await categoriasComRotulo(),
    secao,
    usuario,
  };
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    return {
      data: {
        ...(await carregar(ctx.params.id, ctx.state.usuario!)),
        aviso: u.searchParams.get("ok") ?? undefined,
        erro: undefined as string | undefined,
      },
    };
  },

  async POST(ctx) {
    const id = ctx.params.id;
    try {
      const form = await ctx.req.formData();
      const campos = await lerFormulario(form);

      await updatePost(id, {
        title: campos.title,
        excerpt: campos.excerpt,
        content: campos.content,
        categoryId: campos.categoryId,
        // Capa só entra quando veio arquivo novo — senão mantém a atual.
        ...(campos.capa
          ? {
            coverImageUrl: campos.capa.url,
            coverImageWidth: campos.capa.width,
            coverImageHeight: campos.capa.height,
          }
          : {}),
      });
      await aplicarTags(id, campos.tags);

      const publicar = String(form.get("acao") ?? "") === "publicar";
      if (publicar) await publishPost(id);

      return new Response(null, {
        status: 303,
        headers: {
          location: `/admin/posts/${id}?ok=${publicar ? "publicado" : "salvo"}`,
        },
      });
    } catch (e) {
      if (!(e instanceof ErroDeFormulario)) throw e;
      return {
        data: {
          ...(await carregar(id, ctx.state.usuario!)),
          aviso: undefined,
          erro: e.message,
        },
      };
    }
  },
});

export default define.page<typeof handler>(function EditarPost({ data }) {
  return (
    <Shell
      titulo={`Editar · ${data.post.title}`}
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
        <div>
          <h1>Editar post</h1>
          <p class="adm-meta">
            {data.post.status === "published" ? "publicado" : "rascunho"} ·{" "}
            /{data.post.slug}
          </p>
        </div>
        {data.post.status === "published" && data.secao && (
          <a
            class="btn btn--ghost"
            href={`/${data.secao}/${data.post.slug}`}
            target="_blank"
            rel="noopener"
          >
            Ver no site
          </a>
        )}
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      <PostForm
        post={data.post}
        categorias={data.categorias}
        tags={data.tags}
        erro={data.erro}
      />
    </Shell>
  );
});
