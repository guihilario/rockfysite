import { SESSION_TTL_MS } from "@/core/auth/session.ts";

const NOME = "session";

/** HttpOnly + Secure + SameSite=Lax + Path=/. `Secure` fica sempre ligado:
 *  browsers tratam http://localhost como origem confiável e aceitam mesmo
 *  assim em desenvolvimento. */
function serializar(valor: string, maxAge: number): string {
  return [
    `${NOME}=${valor}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${maxAge}`,
  ].join("; ");
}

export function cookieDeSessao(token: string): string {
  return serializar(token, Math.floor(SESSION_TTL_MS / 1000));
}

/** Expira imediatamente (logout). */
export function cookieLimpo(): string {
  return serializar("", 0);
}

export function lerCookieDeSessao(req: Request): string | undefined {
  const bruto = req.headers.get("cookie");
  if (!bruto) return undefined;
  for (const parte of bruto.split(";")) {
    const [k, ...resto] = parte.trim().split("=");
    if (k === NOME) return resto.join("=") || undefined;
  }
  return undefined;
}
