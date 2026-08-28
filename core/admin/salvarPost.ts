import { generateUniqueSlug } from "@/domain/posts.ts";
import { listAllCategories } from "@/domain/categories.ts";
import { getOrCreateTagByName, setPostTags } from "@/domain/tags.ts";
import {
  generateImageKey,
  ImageValidationError,
  processUploadedImage,
} from "@/core/upload/image.ts";
import { getPublicUrl, putObject } from "@/core/upload/r2.ts";

/** Rótulo hierárquico para o <select>: "Blog › Performance". */
export async function categoriasComRotulo(): Promise<
  { id: string; rotulo: string }[]
> {
  const todas = await listAllCategories();
  const nomePorId = new Map(todas.map((c) => [c.id, c.name]));
  return todas
    .map((c) => ({
      id: c.id,
      rotulo: c.parentId
        ? `${nomePorId.get(c.parentId) ?? "?"} › ${c.name}`
        : c.name,
    }))
    .sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));
}

export type CamposPost = {
  title: string;
  excerpt: string | null;
  content: string;
  categoryId: string | null;
  tags: string[];
  capa: { url: string; width: number; height: number } | null;
};

/** Erro de preenchimento — vira mensagem no formulário, não 500. */
export class ErroDeFormulario extends Error {}

/**
 * Lê o formulário e, quando há arquivo, processa e sobe a capa para o R2.
 *
 * A imagem passa pelo pipeline (orientação EXIF, redimensionamento, WebP)
 * antes de subir — o que chega no bucket nunca é o arquivo cru do usuário.
 */
export async function lerFormulario(form: FormData): Promise<CamposPost> {
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();
  if (!title) throw new ErroDeFormulario("O título é obrigatório.");
  if (!content) throw new ErroDeFormulario("O conteúdo é obrigatório.");

  const excerptBruto = String(form.get("excerpt") ?? "").trim();
  const categoryId = String(form.get("categoryId") ?? "").trim() || null;

  const tags = String(form.get("newTags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let capa: CamposPost["capa"] = null;
  const arquivo = form.get("coverImage");
  if (arquivo instanceof File && arquivo.size > 0) {
    try {
      const bytes = new Uint8Array(await arquivo.arrayBuffer());
      const img = await processUploadedImage(bytes);
      const key = generateImageKey();
      await putObject(key, img.webp, "image/webp");
      capa = { url: getPublicUrl(key), width: img.width, height: img.height };
    } catch (e) {
      if (e instanceof ImageValidationError) {
        throw new ErroDeFormulario(e.message);
      }
      throw e;
    }
  }

  return {
    title,
    excerpt: excerptBruto || null,
    content,
    categoryId,
    tags,
    capa,
  };
}

/** Cria as tags que ainda não existem e liga todas ao post. */
export async function aplicarTags(postId: string, nomes: string[]) {
  const ids: string[] = [];
  for (const nome of nomes) {
    const tag = await getOrCreateTagByName(nome);
    ids.push(tag.id);
  }
  await setPostTags(postId, ids);
}

export { generateUniqueSlug };
