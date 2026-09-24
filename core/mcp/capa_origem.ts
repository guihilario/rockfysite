export class ErroDeCapa extends Error {}

/** Endereço que não pode ser buscado a partir do servidor. */
export function ipPrivado(ip: string): boolean {
  const n = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (n === "::1" || n === "0.0.0.0" || n.startsWith("fe80:")) return true;
  if (n.startsWith("fc") || n.startsWith("fd")) return true;
  if (n.startsWith("127.") || n.startsWith("10.") || n.startsWith("192.168.")) {
    return true;
  }
  if (n.startsWith("169.254.")) return true;
  const bloco = /^172\.(\d+)\./.exec(n);
  if (bloco) {
    const segundo = Number(bloco[1]);
    if (segundo >= 16 && segundo <= 31) return true;
  }
  return false;
}

function hostBloqueado(host: string): boolean {
  const nome = host.toLowerCase().replace(/\.$/, "");
  if (
    nome === "localhost" || nome.endsWith(".localhost") ||
    nome === "metadata.google.internal" || nome.endsWith(".internal")
  ) {
    return true;
  }
  if (nome.includes(":")) return ipPrivado(nome);
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(nome)) return ipPrivado(nome);
  return false;
}

const MAX_BYTES = 8 * 1024 * 1024;

/** https público, ou data URL de PNG, JPEG ou WebP. */
export function origemDeImagem(valor: string): URL | "data" {
  const texto = valor.trim();
  if (/^data:image\/(png|jpe?g|webp)(?:;[^,]*)?;base64,/i.test(texto)) {
    return "data";
  }
  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    throw new ErroDeCapa("A imagem destacada precisa ser um endereço https.");
  }
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new ErroDeCapa("A imagem destacada precisa ser um endereço https.");
  }
  if (hostBloqueado(url.hostname)) {
    throw new ErroDeCapa("Esse endereço de imagem não pode ser usado.");
  }
  return url;
}

/** O arquivo decodificado, não o texto da data URL. O teto é 8 MB. */
export function bytesDaDataUrl(valor: string): Uint8Array {
  const base64 = valor.slice(valor.indexOf(",") + 1).replace(/\s/g, "");
  let binario: string;
  try {
    binario = atob(base64);
  } catch {
    throw new ErroDeCapa("A imagem destacada está ilegível.");
  }
  if (binario.length > MAX_BYTES) {
    throw new ErroDeCapa("A imagem destacada passa de 8 MB.");
  }
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}
