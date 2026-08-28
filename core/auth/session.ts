import { config } from "@/core/config.ts";

// 30 dias — sessão de admin de baixo tráfego, não precisa expirar rápido.
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Token aleatório de 256 bits, o que o browser recebe no cookie. */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64Url(bytes);
}

/**
 * HMAC-SHA256(token, SESSION_SECRET) — o banco nunca guarda o token em
 * texto puro (SPEC §10). O token já tem 256 bits de entropia própria; o
 * HMAC com segredo do servidor é defesa em profundidade (um dump do banco
 * sozinho não basta pra forjar sessões).
 */
export async function hashSessionToken(token: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(config.sessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(token),
  );
  return encodeBase64Url(new Uint8Array(signature));
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(
    /=+$/,
    "",
  );
}
