import { define } from "@/utils.ts";
import { lerCookieDeSessao } from "@/core/auth/cookie.ts";
import { hashSessionToken } from "@/core/auth/session.ts";
import { touchSessionAndGetUser } from "@/domain/sessions.ts";
import { areaSalesConfig } from "@/core/sales/area.ts";

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
      const area = areaSalesConfig();
      const path = new URL(ctx.req.url).pathname;
      if (
        area && (path === "/mydash/crm" ||
          path.startsWith("/mydash/crm/") || path === "/mydash/leads" ||
          path === "/mydash/orders")
      ) {
        if (ctx.req.method !== "GET") {
          return new Response(
            "O CRM e os pedidos agora são gerenciados na Area.",
            {
              status: 409,
            },
          );
        }
        return new Response(null, {
          status: 302,
          headers: { location: `${area.baseUrl}/admin/sales` },
        });
      }
      return await ctx.next();
    }
  }
  return new Response(null, {
    status: 302,
    headers: { location: "/auth/login" },
  });
});
