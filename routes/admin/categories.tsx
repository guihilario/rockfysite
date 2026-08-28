import { define } from "@/utils.ts";
import {
  createSubcategory,
  deleteSubcategory,
  listAllCategories,
  listRootCategories,
} from "@/domain/categories.ts";
import { Shell } from "@/components/admin/Shell.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const [todas, raizes] = await Promise.all([
      listAllCategories(),
      listRootCategories(),
    ]);
    return {
      data: {
        todas,
        raizes,
        usuario: ctx.state.usuario!,
        erro: u.searchParams.get("erro") ?? undefined,
      },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const acao = String(form.get("acao") ?? "");
    try {
      if (acao === "criar") {
        const nome = String(form.get("nome") ?? "").trim();
        const parentId = String(form.get("parentId") ?? "").trim();
        if (!nome || !parentId) throw new Error("Preencha nome e seção.");
        await createSubcategory({ name: nome, parentId });
      } else if (acao === "excluir") {
        await deleteSubcategory(String(form.get("id") ?? ""));
      }
      return new Response(null, {
        status: 303,
        headers: { location: "/admin/categories" },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falhou.";
      return new Response(null, {
        status: 303,
        headers: {
          location: `/admin/categories?erro=${encodeURIComponent(msg)}`,
        },
      });
    }
  },
});

export default define.page<typeof handler>(function Categorias({ data }) {
  const nomePorId = new Map(data.todas.map((c) => [c.id, c.name]));
  const subs = data.todas.filter((c) => c.parentId);

  return (
    <Shell titulo="Categorias" usuario={data.usuario} atual="categorias">
      <div class="adm-cabeca">
        <div>
          <h1>Categorias</h1>
          <p class="adm-meta">
            As raízes <b>Blog</b> e <b>Ajuda</b>{" "}
            são fixas e decidem a seção do post. Aqui você gerencia as
            subcategorias.
          </p>
        </div>
      </div>

      {data.erro && <p class="aviso aviso--erro">{data.erro}</p>}

      <form class="form" method="post">
        <input type="hidden" name="acao" value="criar" />
        <div class="campo">
          <label for="nome">Nova subcategoria</label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="Performance"
          />
        </div>
        <div class="campo">
          <label for="parentId">Dentro de</label>
          <select id="parentId" name="parentId" required>
            {data.raizes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div class="form-acoes">
          <button class="btn" type="submit">Criar</button>
        </div>
      </form>

      <h2 class="adm-meta" style={{ margin: "30px 0 12px" }}>
        Subcategorias existentes
      </h2>
      {subs.length === 0
        ? <p class="vazio">Nenhuma subcategoria ainda.</p>
        : (
          <table class="adm-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Seção</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.name} <span class="adm-slug">/{c.slug}</span>
                  </td>
                  <td>{nomePorId.get(c.parentId!) ?? "—"}</td>
                  <td class="acoes">
                    <form
                      method="post"
                      data-confirmar="Excluir esta subcategoria? Os posts nela ficam sem categoria."
                    >
                      <input type="hidden" name="acao" value="excluir" />
                      <input type="hidden" name="id" value={c.id} />
                      <button class="btn btn--perigo btn--sm" type="submit">
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </Shell>
  );
});
