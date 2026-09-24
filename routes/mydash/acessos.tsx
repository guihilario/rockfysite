import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { listarGrants, revogarGrant } from "@/domain/oauth.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const usuario = ctx.state.usuario!;
    return {
      data: {
        usuario,
        grants: await listarGrants(usuario.id),
      },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    await revogarGrant(String(form.get("id") ?? ""), ctx.state.usuario!.id);
    return new Response(null, {
      status: 303,
      headers: { location: "/mydash/acessos" },
    });
  },
});

export default define.page<typeof handler>(function Acessos({ data }) {
  return (
    <Shell titulo="Acessos" usuario={data.usuario} atual="acessos">
      <h1>Acessos do blog</h1>
      <p>
        Chats autorizados a criar rascunhos. A conexão é feita em{" "}
        <code>https://rockfy.com/mcp</code>.
      </p>
      {data.grants.length === 0 ? <p>Nenhum chat conectado ainda.</p> : (
        <table>
          <thead>
            <tr>
              <th>Aplicativo</th>
              <th>Pode</th>
              <th>Desde</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.grants.map((g) => (
              <tr>
                <td>{g.clientName}</td>
                <td>{g.scopes.join(", ")}</td>
                <td>{g.createdAt.toISOString().slice(0, 10)}</td>
                <td>
                  {g.revokedAt ? "revogado" : (
                    <form method="post">
                      <input type="hidden" name="id" value={g.id} />
                      <button class="btn btn--perigo btn--sm" type="submit">
                        Revogar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
});
