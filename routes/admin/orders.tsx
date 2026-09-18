import { define } from "@/utils.ts";
import {
  atualizarStatus,
  formatarPreco,
  listarPedidos,
  type PedidoStatus,
} from "@/domain/orders.ts";
import { Shell } from "@/components/admin/Shell.tsx";

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão de crédito",
  boleto: "Boleto",
};

const ROTULO_STATUS: Record<PedidoStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  cancelled: "Cancelado",
};

function quando(d: Date): string {
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d.getDate()} ${MESES[d.getMonth()]} · ${hora}`;
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const pedidos = await listarPedidos({ limite: 200 });
    return {
      data: {
        pedidos,
        usuario: ctx.state.usuario!,
        aviso: u.searchParams.get("ok") ?? undefined,
      },
    };
  },

  /* O status muda por POST de <form>, para funcionar sem JavaScript: é a
     única ação que o painel faz sobre um pedido, além de olhar para ele. */
  async POST(ctx) {
    const form = await ctx.req.formData();
    const id = String(form.get("id") ?? "");
    const acao = String(form.get("acao") ?? "");
    if (id && acao in ROTULO_STATUS) {
      await atualizarStatus(id, acao as PedidoStatus);
    }
    return new Response(null, {
      status: 303,
      headers: { location: "/admin/orders?ok=salvo" },
    });
  },
});

const RECADO: Record<string, string> = {
  salvo: "Status do pedido atualizado.",
};

export default define.page<typeof handler>(function Pedidos({ data }) {
  return (
    <Shell titulo="Pedidos" usuario={data.usuario} atual="pedidos">
      <div class="adm-cabeca">
        <div>
          <h1>Pedidos</h1>
          <p class="adm-meta">
            {data.pedidos.length} pedido(s) · mais recentes primeiro
          </p>
        </div>
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      {data.pedidos.length === 0
        ? (
          <p class="vazio">
            Nenhum pedido ainda. Os checkouts dos planos aparecem aqui.
          </p>
        )
        : (
          <table class="adm-tabela">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Plano</th>
                <th>Cliente</th>
                <th>Cobrança</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.pedidos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span class="adm-titulo-cel">#{p.id.slice(0, 8)}</span>
                    <span class="adm-slug">{quando(p.createdAt)}</span>
                  </td>
                  <td>
                    <b>{p.plan}</b>
                    <span class="adm-slug">
                      {formatarPreco(p.priceCents)}/mês
                    </span>
                  </td>
                  <td>
                    {p.name}
                    <span class="adm-slug">
                      <a href={`mailto:${p.email}`}>{p.email}</a> · {p.phone}
                      <br />
                      {p.document}
                      {p.company ? ` · ${p.company}` : ""}
                    </span>
                  </td>
                  <td>
                    {ROTULO_PAGAMENTO[p.paymentMethod] ?? p.paymentMethod}
                    <span class="adm-slug">
                      {p.address}, {p.number}
                      {p.complement ? ` · ${p.complement}` : ""}
                      <br />
                      {p.cep} · {p.city}/{p.state}
                    </span>
                  </td>
                  <td>
                    <span
                      class={[
                        "selo",
                        p.status === "paid" && "selo--pub",
                        p.status === "pending" && "selo--pendente",
                        p.status === "cancelled" && "selo--cancelado",
                      ].filter(Boolean).join(" ")}
                    >
                      {ROTULO_STATUS[p.status]}
                    </span>
                  </td>
                  <td class="acoes">
                    {p.status !== "paid" && (
                      <form
                        method="post"
                        data-confirmar="Marcar este pedido como pago?"
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="acao" value="paid" />
                        <button class="btn btn--sm" type="submit">Pago</button>
                      </form>
                    )}
                    {p.status !== "pending" && (
                      <form method="post">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="acao" value="pending" />
                        <button class="btn btn--ghost btn--sm" type="submit">
                          Reabrir
                        </button>
                      </form>
                    )}
                    {p.status !== "cancelled" && (
                      <form
                        method="post"
                        data-confirmar="Cancelar este pedido?"
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="acao" value="cancelled" />
                        <button class="btn btn--perigo btn--sm" type="submit">
                          Cancelar
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
