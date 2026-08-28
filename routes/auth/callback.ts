import { define } from "@/utils.ts";
import { config } from "@/core/config.ts";
import { exchangeCodeForProfile } from "@/core/auth/google.ts";
import { redirectUriDe } from "@/core/auth/origem.ts";
import { getOrCreateUserByGoogleSub } from "@/domain/users.ts";
import { createSession } from "@/domain/sessions.ts";
import {
  generateSessionToken,
  hashSessionToken,
  SESSION_TTL_MS,
} from "@/core/auth/session.ts";
import { cookieDeSessao } from "@/core/auth/cookie.ts";

const LIMPA_STATE =
  "oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";

function cookieBruto(req: Request, nome: string): string | undefined {
  for (const p of (req.headers.get("cookie") ?? "").split(";")) {
    const [k, ...v] = p.trim().split("=");
    if (k === nome) return v.join("=") || undefined;
  }
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const code = u.searchParams.get("code");
    const state = u.searchParams.get("state");
    const esperado = cookieBruto(ctx.req, "oauth_state");

    // O state precisa bater com o que gravamos antes de sair daqui.
    if (!code || !state || !esperado || state !== esperado) {
      return new Response(
        "Falha na autenticação: state inválido ou expirado.",
        {
          status: 400,
          headers: { "set-cookie": LIMPA_STATE },
        },
      );
    }

    // mesma URI enviada no /auth/login — o Google compara as duas
    const perfil = await exchangeCodeForProfile(code, redirectUriDe(ctx.req));

    // Sem sistema de permissões: só e-mails da allowlist viram admin.
    if (!config.adminEmails.includes(perfil.email.toLowerCase())) {
      return new Response("Esta conta não tem acesso ao painel.", {
        status: 403,
        headers: { "set-cookie": LIMPA_STATE },
      });
    }

    const user = await getOrCreateUserByGoogleSub({
      googleSub: perfil.sub,
      email: perfil.email,
      name: perfil.name ?? null,
    });

    const token = generateSessionToken();
    await createSession({
      userId: user.id,
      tokenHash: await hashSessionToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    });

    const headers = new Headers({ location: "/admin" });
    headers.append("set-cookie", LIMPA_STATE);
    headers.append("set-cookie", cookieDeSessao(token));
    return new Response(null, { status: 302, headers });
  },
});
