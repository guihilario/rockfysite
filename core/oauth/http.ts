import { origemDaRequisicao } from "@/core/auth/origem.ts";

export function origem(req: Request): string {
  return origemDaRequisicao(req);
}

export function urlDoMcp(req: Request): string {
  return `${origem(req)}/mcp`;
}

export function json(
  dados: unknown,
  status = 200,
  extra?: HeadersInit,
): Response {
  const headers = new Headers(extra);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(dados), { status, headers });
}

export async function formulario(req: Request): Promise<URLSearchParams> {
  return new URLSearchParams(await req.text());
}

export const COOKIE_VOLTAR = "voltar";

export function cookieVoltar(caminho: string): string {
  return [
    `${COOKIE_VOLTAR}=${encodeURIComponent(caminho)}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=600",
  ].join("; ");
}

export function cookieVoltarLimpo(): string {
  return `${COOKIE_VOLTAR}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
