import { define } from "@/utils.ts";
import { criarCliente } from "@/domain/oauth.ts";
import { redirectPermitido } from "@/core/oauth/redirect.ts";
import { json } from "@/core/oauth/http.ts";

/** O chat se apresenta sozinho e recebe um client_id. Sem segredo: o PKCE segura a troca. */
export const handler = define.handlers({
  async POST(ctx) {
    let corpo: Record<string, unknown>;
    try {
      corpo = await ctx.req.json();
    } catch {
      return json({ error: "invalid_client_metadata" }, 400);
    }
    const uris = Array.isArray(corpo.redirect_uris)
      ? corpo.redirect_uris.filter((u): u is string => typeof u === "string")
      : [];
    if (
      uris.length === 0 || uris.length > 8 ||
      uris.some((u) => !redirectPermitido(u))
    ) {
      return json({ error: "invalid_redirect_uri" }, 400);
    }
    const name = String(corpo.client_name ?? "Chat").trim().slice(0, 80) ||
      "Chat";
    const cliente = await criarCliente({ name, redirectUris: uris });
    return json({
      client_id: cliente.clientId,
      client_name: cliente.name,
      redirect_uris: cliente.redirectUris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }, 201);
  },
});
