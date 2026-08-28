import { define } from "@/utils.ts";
import { buildGoogleAuthUrl } from "@/core/auth/google.ts";

/** Manda pro consentimento do Google com um `state` aleatório guardado em
 *  cookie — é ele que o callback confere para barrar CSRF. */
export const handler = define.handlers({
  GET() {
    const state = crypto.randomUUID();
    return new Response(null, {
      status: 302,
      headers: {
        location: buildGoogleAuthUrl(state),
        "set-cookie":
          `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      },
    });
  },
});
