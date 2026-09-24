import { lerCookieDeSessao } from "@/core/auth/cookie.ts";
import { hashSessionToken } from "@/core/auth/session.ts";
import { touchSessionAndGetUser } from "@/domain/sessions.ts";

export type UsuarioDaSessao = { id: string; email: string; name: string };

/** A mesma sessão do painel, para rotas fora de /mydash (a tela de autorização). */
export async function usuarioDaSessao(
  req: Request,
): Promise<UsuarioDaSessao | null> {
  const token = lerCookieDeSessao(req);
  if (!token) return null;
  const user = await touchSessionAndGetUser(await hashSessionToken(token));
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}
