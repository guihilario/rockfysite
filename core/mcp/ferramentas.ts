import { sanitizeContent } from "@/core/content/sanitize.ts";
import { aplicarTags } from "@/core/admin/salvarPost.ts";
import { ErroDeCapa, subirCapa } from "@/core/mcp/capa.ts";
import {
  getCategoryBySlug,
  getCategoryWithRoot,
  listAllCategories,
} from "@/domain/categories.ts";
import type { Acesso } from "@/domain/oauth.ts";
import {
  createPost,
  generateUniqueSlug,
  listPostsResumo,
  publishPost,
  updatePost,
} from "@/domain/posts.ts";
import { SITE } from "@/components/Layout.tsx";

type Resultado = { texto: string; erro?: boolean };

function texto(htmlOuTexto: string): string {
  const bruto = htmlOuTexto.trim();
  const html = bruto.startsWith("<")
    ? bruto
    : bruto.split(/\n{2,}/).map((parte) =>
      `<p>${
        parte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
          /\n/g,
          "<br>",
        )
      }</p>`
    ).join("");
  return sanitizeContent(html).html;
}

function tem(acesso: Acesso, escopo: string): boolean {
  return acesso.scopes.includes(escopo);
}

async function capaDe(origem: string) {
  try {
    return await subirCapa(origem);
  } catch (e) {
    if (e instanceof ErroDeCapa) return e;
    throw e;
  }
}

export async function executarFerramenta(
  nome: string,
  args: Record<string, unknown>,
  acesso: Acesso,
): Promise<Resultado> {
  if (nome === "listar_categorias") {
    if (!tem(acesso, "posts:write")) {
      return { texto: "Sem permissão para ler o blog.", erro: true };
    }
    const categorias = await listAllCategories();
    return {
      texto: categorias.map((c) => `${c.slug} — ${c.name}`).join("\n") ||
        "Nenhuma categoria.",
    };
  }

  if (nome === "listar_posts") {
    if (!tem(acesso, "posts:write")) {
      return { texto: "Sem permissão para ler o blog.", erro: true };
    }
    const posts = await listPostsResumo({
      limit: Number(args.limite ?? 20) || 20,
    });
    return {
      texto: posts.map((p) =>
        `${p.id}  ${p.status}  ${p.slug}  ${p.title}`
      ).join("\n") || "Nenhum post.",
    };
  }

  if (nome === "criar_rascunho") {
    if (!tem(acesso, "posts:write")) {
      return { texto: "Sem permissão para criar posts.", erro: true };
    }
    const title = String(args.titulo ?? "").trim();
    const content = texto(String(args.conteudo ?? ""));
    if (!title || !content.replace(/<[^>]+>/g, "").trim()) {
      return { texto: "Título e conteúdo são obrigatórios.", erro: true };
    }
    const slugCategoria = String(args.categoria ?? "").trim();
    const categoria = slugCategoria
      ? await getCategoryBySlug(slugCategoria)
      : null;
    if (slugCategoria && !categoria) {
      return { texto: `Categoria "${slugCategoria}" não existe.`, erro: true };
    }
    const imagem = String(args.imagem ?? "").trim();
    const capa = imagem ? await capaDe(imagem) : null;
    if (capa instanceof ErroDeCapa) return { texto: capa.message, erro: true };
    const post = await createPost({
      title,
      slug: await generateUniqueSlug(title),
      excerpt: String(args.resumo ?? "").trim() || null,
      content,
      authorId: acesso.userId,
      categoryId: categoria?.id ?? null,
      ...(capa
        ? {
          coverImageUrl: capa.url,
          coverImageWidth: capa.width,
          coverImageHeight: capa.height,
        }
        : {}),
    });
    const tags = String(args.tags ?? "").split(",").map((t) => t.trim()).filter(
      Boolean,
    );
    if (tags.length) await aplicarTags(post.id, tags);
    return {
      texto: capa
        ? `Rascunho criado, com imagem destacada.\nid: ${post.id}\nslug: ${post.slug}\nAinda não está no ar.`
        : `Rascunho criado.\nid: ${post.id}\nslug: ${post.slug}\nAinda não está no ar.`,
    };
  }

  if (nome === "definir_capa") {
    if (!tem(acesso, "posts:write")) {
      return { texto: "Sem permissão para alterar posts.", erro: true };
    }
    const id = String(args.id ?? "").trim();
    const imagem = String(args.imagem ?? "").trim();
    if (!id || !imagem) {
      return { texto: "Informe o id do post e a imagem.", erro: true };
    }
    const capa = await capaDe(imagem);
    if (capa instanceof ErroDeCapa) return { texto: capa.message, erro: true };
    const post = await updatePost(id, {
      coverImageUrl: capa.url,
      coverImageWidth: capa.width,
      coverImageHeight: capa.height,
    });
    if (!post) return { texto: "Post não encontrado.", erro: true };
    return { texto: `Imagem destacada definida em ${post.slug}.` };
  }

  if (nome === "publicar_post") {
    if (!tem(acesso, "posts:publish")) {
      return { texto: "Esta autorização não inclui publicar.", erro: true };
    }
    const id = String(args.id ?? "").trim();
    const publicado = await publishPost(id);
    if (!publicado) return { texto: "Post não encontrado.", erro: true };
    const raiz = await getCategoryWithRoot(publicado.categoryId);
    const secao = raiz?.root.slug === "ajuda" ? "ajuda" : "blog";
    return { texto: `Publicado: ${SITE}/${secao}/${publicado.slug}` };
  }

  return { texto: `Ferramenta desconhecida: ${nome}`, erro: true };
}

export const FERRAMENTAS = [
  {
    name: "listar_categorias",
    description:
      "Lista as categorias do blog, com o slug que criar_rascunho espera.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "listar_posts",
    description:
      "Lista os posts mais recentes, rascunho e publicado, com id e slug.",
    inputSchema: {
      type: "object",
      properties: {
        limite: { type: "number", description: "Quantos posts, no máximo 50." },
      },
    },
  },
  {
    name: "criar_rascunho",
    description:
      "Cria um post como rascunho. Não publica. Se receber imagem, essa vira a imagem destacada.",
    inputSchema: {
      type: "object",
      properties: {
        titulo: { type: "string" },
        conteudo: {
          type: "string",
          description:
            "HTML ou texto. Parágrafos separados por linha em branco.",
        },
        resumo: { type: "string" },
        categoria: { type: "string", description: "Slug da categoria." },
        tags: { type: "string", description: "Nomes separados por vírgula." },
        imagem: {
          type: "string",
          description:
            "URL https da imagem destacada, JPEG, PNG ou WebP. Também aceita data URL base64 desses formatos.",
        },
      },
      required: ["titulo", "conteudo"],
    },
  },
  {
    name: "definir_capa",
    description:
      "Define ou troca a imagem destacada de um post já criado, pelo id.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        imagem: {
          type: "string",
          description: "URL https ou data URL da imagem destacada.",
        },
      },
      required: ["id", "imagem"],
    },
  },
  {
    name: "publicar_post",
    description:
      "Publica um rascunho existente. Só funciona se a autorização incluir publicar.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
];
