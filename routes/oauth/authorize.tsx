import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { usuarioDaSessao } from "@/core/auth/sessaoAtual.ts";
import { cookieVoltar, origem } from "@/core/oauth/http.ts";
import {
  buscarCliente,
  emitirCodigo,
  type Escopo,
  escoposPedidos,
} from "@/domain/oauth.ts";

type Pedido = {
  clientId: string;
  nome: string;
  redirectUri: string;
  challenge: string;
  state: string;
  scopes: Escopo[];
  resource: string;
};

function lerPedido(url: URL): {
  clientId: string;
  redirectUri: string;
  challenge: string;
  method: string;
  state: string;
  scope: string;
  resource: string;
  responseType: string;
} {
  return {
    clientId: url.searchParams.get("client_id") ?? "",
    redirectUri: url.searchParams.get("redirect_uri") ?? "",
    challenge: url.searchParams.get("code_challenge") ?? "",
    method: url.searchParams.get("code_challenge_method") ?? "",
    state: url.searchParams.get("state") ?? "",
    scope: url.searchParams.get("scope") ?? "posts:write",
    resource: url.searchParams.get("resource") ?? "",
    responseType: url.searchParams.get("response_type") ?? "",
  };
}

async function validar(
  req: Request,
  campos: ReturnType<typeof lerPedido>,
): Promise<
  { pedido: Pedido } | { erro: string }
> {
  if (
    campos.responseType !== "code" || campos.method !== "S256" ||
    !campos.challenge || !campos.state
  ) {
    return { erro: "O pedido de autorização está incompleto." };
  }
  const cliente = await buscarCliente(campos.clientId);
  if (!cliente || !cliente.redirectUris.includes(campos.redirectUri)) {
    return {
      erro: "Este aplicativo não está autorizado a voltar para esse endereço.",
    };
  }
  const esperado = `${origem(req)}/mcp`;
  if (campos.resource && campos.resource !== esperado) {
    return { erro: "O aplicativo pediu acesso a outro recurso." };
  }
  const pedidos = escoposPedidos(campos.scope);
  const scopes: Escopo[] = [
    "posts:write",
    ...(pedidos.includes("posts:publish") ? ["posts:publish" as const] : []),
  ];
  return {
    pedido: {
      clientId: cliente.clientId,
      nome: cliente.name,
      redirectUri: campos.redirectUri,
      challenge: campos.challenge,
      state: campos.state,
      scopes,
      resource: esperado,
    },
  };
}

function voltarComErro(
  redirectUri: string,
  state: string,
  erro: string,
  iss: string,
) {
  const destino = new URL(redirectUri);
  destino.searchParams.set("error", erro);
  destino.searchParams.set("state", state);
  destino.searchParams.set("iss", iss);
  return new Response(null, {
    status: 302,
    headers: { location: destino.toString() },
  });
}

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const campos = lerPedido(url);
    const checagem = await validar(ctx.req, campos);
    if ("erro" in checagem) {
      return new Response(checagem.erro, { status: 400 });
    }
    const usuario = await usuarioDaSessao(ctx.req);
    if (!usuario) {
      const caminho = `${url.pathname}${url.search}`;
      return new Response(null, {
        status: 302,
        headers: {
          location: "/auth/login",
          "set-cookie": cookieVoltar(caminho),
        },
      });
    }
    return { data: { usuario, pedido: checagem.pedido } };
  },

  async POST(ctx) {
    const usuario = await usuarioDaSessao(ctx.req);
    if (!usuario) {
      return new Response(null, {
        status: 302,
        headers: { location: "/auth/login" },
      });
    }
    const form = await ctx.req.formData();
    const campos = {
      clientId: String(form.get("client_id") ?? ""),
      redirectUri: String(form.get("redirect_uri") ?? ""),
      challenge: String(form.get("code_challenge") ?? ""),
      method: "S256",
      state: String(form.get("state") ?? ""),
      scope: String(form.get("scope") ?? ""),
      resource: String(form.get("resource") ?? ""),
      responseType: "code",
    };
    const checagem = await validar(ctx.req, campos);
    if ("erro" in checagem) {
      return new Response(checagem.erro, { status: 400 });
    }
    const { pedido } = checagem;
    const iss = origem(ctx.req);
    if (form.get("decisao") !== "autorizar") {
      return voltarComErro(
        pedido.redirectUri,
        pedido.state,
        "access_denied",
        iss,
      );
    }
    const scopes = pedido.scopes.filter((escopo) =>
      escopo === "posts:write" || form.get("publicar") === "1"
    );
    const code = await emitirCodigo({
      clientId: pedido.clientId,
      userId: usuario.id,
      redirectUri: pedido.redirectUri,
      codeChallenge: pedido.challenge,
      scopes,
    });
    const destino = new URL(pedido.redirectUri);
    destino.searchParams.set("code", code);
    destino.searchParams.set("state", pedido.state);
    destino.searchParams.set("iss", iss);
    return new Response(null, {
      status: 302,
      headers: { location: destino.toString() },
    });
  },
});

export default define.page<typeof handler>(function Autorizar({ data }) {
  const { pedido, usuario } = data;
  const querPublicar = pedido.scopes.includes("posts:publish");
  return (
    <Shell titulo="Autorizar acesso" usuario={usuario} atual="acessos">
      <h1>Autorizar {pedido.nome}</h1>
      <p>
        {pedido.nome}{" "}
        quer usar a sua conta ({usuario.email}) para cuidar dos posts do blog. O
        acesso vale até você revogar em Acessos.
      </p>
      <form method="post" action="/oauth/authorize">
        <input type="hidden" name="client_id" value={pedido.clientId} />
        <input type="hidden" name="redirect_uri" value={pedido.redirectUri} />
        <input type="hidden" name="code_challenge" value={pedido.challenge} />
        <input type="hidden" name="state" value={pedido.state} />
        <input type="hidden" name="scope" value={pedido.scopes.join(" ")} />
        <input type="hidden" name="resource" value={pedido.resource} />
        <ul>
          <li>Criar e listar rascunhos</li>
          {querPublicar
            ? (
              <li>
                <label>
                  <input type="checkbox" name="publicar" value="1" checked />
                  {" "}
                  Também publicar posts
                </label>
              </li>
            )
            : null}
        </ul>
        <p>
          <button class="btn" type="submit" name="decisao" value="autorizar">
            Autorizar
          </button>{" "}
          <button
            class="btn btn--ghost"
            type="submit"
            name="decisao"
            value="recusar"
          >
            Recusar
          </button>
        </p>
      </form>
    </Shell>
  );
});
