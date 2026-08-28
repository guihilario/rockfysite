import { define } from "@/utils.ts";
import { lerCookieDeSessao } from "@/core/auth/cookie.ts";
import { hashSessionToken } from "@/core/auth/session.ts";
import { touchSessionAndGetUser } from "@/domain/sessions.ts";

/**
 * Portão do painel. A existência do cookie nunca basta: o token é hasheado
 * e revalidado contra o banco a cada requisição, o que também renova a
 * expiração da sessão. Sem sessão válida, vai para o login.
 */
export const handler = define.middleware(async (ctx) => {
  const token = lerCookieDeSessao(ctx.req);
  if (token) {
    const user = await touchSessionAndGetUser(await hashSessionToken(token));
    if (user) {
      ctx.state.usuario = { id: user.id, email: user.email, name: user.name };
      return await ctx.next();
    }
  }
  return new Response(null, {
    status: 302,
    headers: { location: "/auth/login" },
  });
});
