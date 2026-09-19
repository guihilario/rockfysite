import { define } from "@/utils.ts";
import { fichaCliente, linkWhatsAppCliente } from "@/domain/crm.ts";
import { ETAPAS_CRM, valorPotencialCents } from "@/domain/leads.ts";
import { formatarPreco, type PedidoStatus } from "@/domain/orders.ts";

/**
 * A ficha do cliente em fragmento, para o popover do kanban. Não vira uma
 * página de verdade (sem Shell, sem edição): o crm.js busca este HTML quando
 * o card é clicado e injeta no popover nativo. Editar continua na página
 * `/mydash/crm/cliente`, que tem este mesmo dado por inteiro.
 */

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

function quando(d: Date): string {
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d.getDate()} ${MESES[d.getMonth()]} · ${hora}`;
}

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão",
  boleto: "Boleto",
};

const ROTULO_STATUS: Record<PedidoStatus, string> = {
  pending: "Aguardando",
  paid: "Pago",
  cancelled: "Cancelado",
};

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const email = (u.searchParams.get("e") ?? "").trim().toLowerCase();
    const telefone = u.searchParams.get("f") ?? "";
    if (!email && !telefone) {
      return new Response(null, {
        status: 303,
        headers: { location: "/mydash/crm" },
      });
    }
    const ficha = await fichaCliente(email, telefone);
    return { data: { ficha } };
  },
});

export default define.page<typeof handler>(function Popover({ data }) {
  const ficha = data.ficha;
  const whats = (telefone: string) =>
    linkWhatsAppCliente(
      telefone,
      `Oi! Aqui é da Rockfy. Vi seu contato por aqui e queria entender o que você está procurando.`,
    );

  return (
    <div class="crm-popover-corpo">
      <header class="crm-pop-cabeca">
        <h3>{ficha.nome}</h3>
        <p class="adm-meta">
          {ficha.email}
          {ficha.telefone ? ` · ${ficha.telefone}` : ""}
        </p>
        {ficha.documento && <p class="adm-meta">{ficha.documento}</p>}
        {ficha.endereco && <p class="adm-meta">{ficha.endereco}</p>}
      </header>

      <div class="crm-pop-acoes">
        {ficha.telefone && (
          <a
            class="crm-zap"
            href={whats(ficha.telefone)}
            aria-label="Chamar no WhatsApp"
            rel="noopener"
            target="_blank"
          >
            <img src="/img/whatsapp.svg" alt="" />
          </a>
        )}
        <a
          class="btn btn--ghost btn--sm"
          href={`/mydash/crm/cliente?e=${encodeURIComponent(ficha.email)}`}
        >
          Abrir página
        </a>
        <a
          class="btn btn--ghost btn--sm"
          href={`/mydash/crm/novo-pedido?e=${encodeURIComponent(ficha.email)}`}
        >
          Lançar pedido
        </a>
      </div>

      <div class="crm-ficha-numeros">
        <p>
          {ficha.leads.length}{" "}
          lead(s){ficha.pedidosPagos > 0 && ` · ${ficha.pedidosPagos} pago(s)`}
        </p>
        {ficha.valorTotalCents > 0 && (
          <p>{formatarPreco(ficha.valorTotalCents)} nos pedidos ativos</p>
        )}
      </div>

      <section>
        <h4 class="adm-meta adm-meta--secao">Leads desta pessoa</h4>
        {ficha.leads.length === 0
          ? <p class="adm-nota">Nenhum lead neste contato.</p>
          : (
            <ul class="crm-pop-lista">
              {ficha.leads.map((l) => {
                const info = ETAPAS_CRM.find((e) => e.chave === l.etapa);
                const valor = valorPotencialCents(l.plan);
                return (
                  <li key={l.id}>
                    <span class="crm-pop-linha">
                      <i class="crm-ponto" data-cor={info?.chave} />
                      <b>{info?.rotulo ?? l.etapa}</b>
                      {valor > 0 && <em>{formatarPreco(valor)}</em>}
                    </span>
                    {l.plan
                      ? (
                        <small>
                          {l.plan}
                          {l.source ? ` · ${l.source}` : ""}
                        </small>
                      )
                      : <small>{l.source ?? ""}</small>}
                    {l.proximoContato && (
                      <small>Retorno {l.proximoContato}</small>
                    )}
                    {l.observacao && <blockquote>{l.observacao}</blockquote>}
                    <small class="adm-meta">{quando(l.createdAt)}</small>
                  </li>
                );
              })}
            </ul>
          )}
      </section>

      <section>
        <h4 class="adm-meta adm-meta--secao">Pedidos desta pessoa</h4>
        {ficha.pedidos.length === 0
          ? (
            <p class="adm-nota">
              Nenhum pedido. Se alguém pagar por fora,{" "}
              <a
                href={`/mydash/crm/novo-pedido?e=${
                  encodeURIComponent(ficha.email)
                }`}
              >
                lance aqui
              </a>
              .
            </p>
          )
          : (
            <ul class="crm-pop-lista">
              {ficha.pedidos.map((p) => (
                <li key={p.id}>
                  <span class="crm-pop-linha">
                    <b>{p.plan}</b>
                    <em>{formatarPreco(p.priceCents)}</em>
                  </span>
                  <small>
                    {ROTULO_STATUS[p.status] ?? p.status}
                    {ROTULO_PAGAMENTO[p.paymentMethod]
                      ? ` · ${ROTULO_PAGAMENTO[p.paymentMethod]}`
                      : ""}
                  </small>
                  {p.observacao && <blockquote>{p.observacao}</blockquote>}
                  <small class="adm-meta">{quando(p.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
      </section>
    </div>
  );
});
