/** Hosts de chat que podem receber o código de autorização. */
const HOSTS = [
  "grok.com",
  "x.ai",
  "claude.ai",
  "claude.com",
  "chatgpt.com",
  "openai.com",
  "cursor.com",
  "cursor.sh",
];

/**
 * O callback do chat tem que ser https num host conhecido, ou localhost.
 * Qualquer outro destino transformaria a tela de autorização num
 * redirecionamento aberto.
 */
export function redirectPermitido(uri: string): boolean {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.username || url.password) return false;
  const host = url.hostname.toLowerCase();
  if (
    url.protocol === "http:" &&
    (host === "localhost" || host === "127.0.0.1")
  ) {
    return true;
  }
  if (url.protocol !== "https:") return false;
  return HOSTS.some((permitido) =>
    host === permitido || host.endsWith(`.${permitido}`)
  );
}

/** Só devolve o caminho da própria tela de autorização. */
export function voltaDoLogin(valor: string | undefined): string | null {
  if (!valor) return null;
  let caminho: string;
  try {
    caminho = decodeURIComponent(valor);
  } catch {
    return null;
  }
  if (!caminho.startsWith("/oauth/authorize?")) return null;
  if (
    caminho.startsWith("//") || caminho.includes("\\") || caminho.includes("\n")
  ) {
    return null;
  }
  return caminho;
}
