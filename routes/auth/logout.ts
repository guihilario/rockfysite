import { define } from "@/utils.ts";
import { cookieLimpo, lerCookieDeSessao } from "@/core/auth/cookie.ts";
import { hashSessionToken } from "@/core/auth/session.ts";
import { deleteSessionByTokenHash } from "@/domain/sessions.ts";

/** Apaga a sessão no banco antes de expirar o cookie — só limpar o cookie
 *  deixaria o token válido para quem já o tivesse copiado. */
export const handler = define.handlers({
  async GET(ctx) {
    const token = lerCookieDeSessao(ctx.req);
    if (token) await deleteSessionByTokenHash(await hashSessionToken(token));
    return new Response(null, {
      status: 302,
      headers: { location: "/", "set-cookie": cookieLimpo() },
    });
  },
});
