import {
  generateImageKey,
  ImageValidationError,
  processUploadedImage,
} from "@/core/upload/image.ts";
import { getPublicUrl, putObject } from "@/core/upload/r2.ts";
import {
  bytesDaDataUrl,
  ErroDeCapa,
  ipPrivado,
  origemDeImagem,
} from "@/core/mcp/capa_origem.ts";

export { ErroDeCapa };

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_REDIRECIONAMENTOS = 3;

async function hostResolveParaRedeInterna(host: string): Promise<boolean> {
  if (host.includes(":") || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return ipPrivado(host);
  }
  const achados: string[] = [];
  for (const tipo of ["A", "AAAA"] as const) {
    try {
      achados.push(...await Deno.resolveDns(host, tipo));
    } catch {
      // sem esse tipo de registro
    }
  }
  if (achados.length === 0) return true;
  return achados.some(ipPrivado);
}

async function lerCorpo(resposta: Response): Promise<Uint8Array> {
  const leitor = resposta.body?.getReader();
  if (!leitor) throw new ErroDeCapa("A imagem veio vazia.");
  const partes: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await leitor.cancel();
      throw new ErroDeCapa("A imagem destacada passa de 8 MB.");
    }
    partes.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const parte of partes) {
    bytes.set(parte, offset);
    offset += parte.byteLength;
  }
  return bytes;
}

async function baixar(url: URL, saltos = 0): Promise<Uint8Array> {
  if (await hostResolveParaRedeInterna(url.hostname)) {
    throw new ErroDeCapa("Esse endereço de imagem não pode ser usado.");
  }
  const resposta = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
    headers: { accept: "image/jpeg,image/png,image/webp,*/*" },
  });
  if ([301, 302, 303, 307, 308].includes(resposta.status)) {
    if (saltos >= MAX_REDIRECIONAMENTOS) {
      throw new ErroDeCapa("A imagem destacada redireciona demais.");
    }
    const location = resposta.headers.get("location");
    if (!location) throw new ErroDeCapa("Não consegui baixar a imagem.");
    const proxima = origemDeImagem(new URL(location, url).toString());
    if (proxima === "data") {
      throw new ErroDeCapa("Não consegui baixar a imagem.");
    }
    return await baixar(proxima, saltos + 1);
  }
  if (!resposta.ok) throw new ErroDeCapa("Não consegui baixar a imagem.");
  return await lerCorpo(resposta);
}

/** Baixa a imagem, converte para WebP e devolve a URL pública no R2. */
export async function subirCapa(
  origem: string,
): Promise<{ url: string; width: number; height: number }> {
  const destino = origemDeImagem(origem);
  const bytes = destino === "data"
    ? bytesDaDataUrl(origem.trim())
    : await baixar(destino);
  let img;
  try {
    img = await processUploadedImage(bytes);
  } catch (e) {
    if (e instanceof ImageValidationError) throw new ErroDeCapa(e.message);
    throw e;
  }
  const key = generateImageKey();
  await putObject(key, img.webp, "image/webp");
  return { url: getPublicUrl(key), width: img.width, height: img.height };
}
