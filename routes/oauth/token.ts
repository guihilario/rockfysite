import { define } from "@/utils.ts";
import { pkceConfere } from "@/core/oauth/pkce.ts";
import { formulario, json } from "@/core/oauth/http.ts";
import { consumirCodigo, emitirGrant, girarGrant } from "@/domain/oauth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const form = await formulario(ctx.req);
    const tipo = form.get("grant_type");
    const clientId = form.get("client_id") ?? "";

    if (tipo === "refresh_token") {
      const novo = await girarGrant(form.get("refresh_token") ?? "", clientId);
      if (!novo) return json({ error: "invalid_grant" }, 400);
      return json(corpoDoToken(novo));
    }

    if (tipo !== "authorization_code") {
      return json({ error: "unsupported_grant_type" }, 400);
    }

    const linha = await consumirCodigo(form.get("code") ?? "");
    if (!linha || linha.client_id !== clientId) {
      return json({ error: "invalid_grant" }, 400);
    }
    if (linha.redirect_uri !== (form.get("redirect_uri") ?? "")) {
      return json({ error: "invalid_grant" }, 400);
    }
    const verifier = form.get("code_verifier") ?? "";
    if (!await pkceConfere(verifier, linha.code_challenge)) {
      return json({ error: "invalid_grant" }, 400);
    }

    const grant = await emitirGrant({
      clientId: linha.client_id,
      userId: linha.user_id,
      scopes: linha.scopes,
    });
    return json(corpoDoToken(grant));
  },
});

function corpoDoToken(grant: {
  access: string;
  refresh: string;
  expiresIn: number;
  scope: string;
}) {
  return {
    access_token: grant.access,
    token_type: "Bearer",
    expires_in: grant.expiresIn,
    refresh_token: grant.refresh,
    scope: grant.scope,
  };
}
