import type { Middleware } from "fresh";
import { config } from "@/core/config.ts";

/**
 * Cabeçalhos de segurança em toda resposta.
 *
 * O HSTS fica atrás do `isProduction` porque em desenvolvimento o site roda
 * em HTTP puro: mandá-lo ali faria o navegador se recusar a abrir
 * localhost por HTTP pelos meses seguintes, e não há como desfazer isso do
 * lado do servidor.
 */
export function seguranca<S>(): Middleware<S> {
  return async (ctx) => {
    const res = await ctx.next();
    const h = res.headers;
    // O navegador não deve adivinhar o tipo de um arquivo: é o que permite
    // servir um upload como script.
    h.set("x-content-type-options", "nosniff");
    // A CSP já traz `frame-ancestors 'none'`; este é o equivalente para
    // navegadores que não a interpretam.
    h.set("x-frame-options", "DENY");
    h.set("referrer-policy", "strict-origin-when-cross-origin");
    if (config.isProduction) {
      h.set("strict-transport-security", "max-age=31536000; includeSubDomains");
    }
    return res;
  };
}

/**
 * Compressão gzip das respostas de texto.
 *
 * Sem isto o HTML ia com 65 KB e o CSS com 77 KB crus — nem o Deno Deploy
 * nem nada na frente comprimia. Comprimidos, viram ~12 KB e ~19 KB.
 *
 * Só entra em texto: imagem, fonte e vídeo já vêm comprimidos, e passá-los
 * pelo gzip gasta CPU para não economizar nada.
 */
const COMPRIMIVEL =
  /^(?:text\/|application\/(?:javascript|json|xml|manifest)|image\/svg)/;

export function compressao<S>(): Middleware<S> {
  return async (ctx) => {
    const res = await ctx.next();

    if (!res.body) return res; // 204, 304 e redirects
    if (res.headers.has("content-encoding")) return res;
    if (!(ctx.req.headers.get("accept-encoding") ?? "").includes("gzip")) {
      return res;
    }
    if (!COMPRIMIVEL.test(res.headers.get("content-type") ?? "")) return res;

    const h = new Headers(res.headers);
    h.set("content-encoding", "gzip");
    // O tamanho passa a ser outro, e o corpo vira stream: manter o valor
    // antigo faria o navegador cortar a resposta.
    h.delete("content-length");
    // Sem isto um cache intermediário pode servir a versão comprimida a
    // quem não aceita gzip.
    if (!h.has("vary")) h.set("vary", "accept-encoding");

    return new Response(res.body.pipeThrough(new CompressionStream("gzip")), {
      status: res.status,
      statusText: res.statusText,
      headers: h,
    });
  };
}
