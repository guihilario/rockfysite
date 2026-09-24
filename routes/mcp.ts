import { define } from "@/utils.ts";
import { acessoPeloToken } from "@/domain/oauth.ts";
import { executarFerramenta, FERRAMENTAS } from "@/core/mcp/ferramentas.ts";
import { json, urlDoMcp } from "@/core/oauth/http.ts";

type Rpc = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

function rpc(id: Rpc["id"], result: unknown): Response {
  return json({ jsonrpc: "2.0", id: id ?? null, result });
}

function rpcErro(id: Rpc["id"], code: number, message: string): Response {
  return json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
}

function semToken(req: Request): Response {
  const metadata = `${
    new URL(urlDoMcp(req)).origin
  }/.well-known/oauth-protected-resource/mcp`;
  return json({ error: "invalid_token" }, 401, {
    "www-authenticate": `Bearer resource_metadata="${metadata}"`,
  });
}

export const handler = define.handlers({
  async POST(ctx) {
    const header = ctx.req.headers.get("authorization") ?? "";
    const token = header.toLowerCase().startsWith("bearer ")
      ? header.slice(7).trim()
      : "";
    const acesso = token ? await acessoPeloToken(token) : null;
    if (!acesso) return semToken(ctx.req);

    let corpo: Rpc;
    try {
      corpo = await ctx.req.json();
    } catch {
      return rpcErro(null, -32700, "JSON inválido");
    }
    const metodo = corpo.method ?? "";
    const params = corpo.params ?? {};

    if (metodo === "initialize") {
      return rpc(corpo.id, {
        protocolVersion: "2025-03-26",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "rockfy-blog", version: "1.0.0" },
      });
    }
    if (metodo === "notifications/initialized" || metodo === "ping") {
      if (corpo.id == null && metodo.startsWith("notifications/")) {
        return new Response(null, { status: 202 });
      }
      return rpc(corpo.id, {});
    }
    if (metodo === "tools/list") {
      return rpc(corpo.id, { tools: FERRAMENTAS });
    }
    if (metodo === "tools/call") {
      const nome = String(params.name ?? "");
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      const saida = await executarFerramenta(nome, args, acesso);
      return rpc(corpo.id, {
        content: [{ type: "text", text: saida.texto }],
        isError: saida.erro ?? false,
      });
    }
    return rpcErro(corpo.id, -32601, `Método não suportado: ${metodo}`);
  },
});
