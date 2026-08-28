import { config } from "@/core/config.ts";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

/** `state` é validado no callback contra um cookie próprio — protege o
 * fluxo OAuth em si contra CSRF (independente do §14, que é sobre as
 * mutações da própria aplicação). */
export function buildGoogleAuthUrl(state: string, redirectUri: string): string {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", config.google.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export type GoogleProfile = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

/** Troca o `code` do callback por um perfil verificado. Chama o Google
 * diretamente pelo servidor (server-to-server, com client secret) — o
 * resultado já vem de uma origem confiável, sem precisar validar um JWT. */
export async function exchangeCodeForProfile(
  code: string,
  /* Precisa ser byte a byte o mesmo enviado no /auth/login — o Google
     compara os dois e recusa a troca se diferirem. */
  redirectUri: string,
): Promise<GoogleProfile> {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error(`Falha ao trocar code por token: ${tokenResponse.status}`);
  }
  const { access_token } = await tokenResponse.json() as {
    access_token: string;
  };

  const profileResponse = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileResponse.ok) {
    throw new Error(
      `Falha ao buscar perfil do Google: ${profileResponse.status}`,
    );
  }
  const profile = await profileResponse.json() as {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture?: string;
  };

  if (!profile.email_verified) {
    throw new Error("E-mail do Google não verificado");
  }

  return {
    sub: profile.sub,
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
  };
}
