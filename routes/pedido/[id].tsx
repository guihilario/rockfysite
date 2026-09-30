import { define } from "@/utils.ts";
import { Layout } from "@/components/Layout.tsx";
import {
  aplicarPedidoArea,
  buscarPedido,
  formatarPreco,
} from "@/domain/orders.ts";
import {
  areaSalesConfig,
  fetchAreaOrderStatuses,
  submitOrderToArea,
} from "@/core/sales/area.ts";

async function refresh(id: string) {
  let pedido = await buscarPedido(id);
  if (!pedido || !pedido.areaHandoff) return null;
  if (pedido.areaOrderId) {
    try {
      const [order] = await fetchAreaOrderStatuses([pedido.id]);
      if (order) {
        await aplicarPedidoArea(pedido.id, order);
        pedido = await buscarPedido(id);
      }
    } catch {
      // Show the last known state; a later visit can reconcile it.
    }
  }
  return pedido;
}

export const handler = define.handlers({
  async GET(ctx) {
    const pedido = await refresh(ctx.params.id);
    if (!pedido) return new Response("Pedido não encontrado", { status: 404 });
    return { data: { pedido, retry: ctx.url.searchParams.has("retry") } };
  },
  async POST(ctx) {
    const pedido = await buscarPedido(ctx.params.id);
    if (!pedido || !pedido.areaHandoff || !areaSalesConfig()) {
      return new Response("Pedido não encontrado", { status: 404 });
    }
    if (
      !pedido.areaOrderId ||
      ["pending", "payment_pending"].includes(pedido.areaStatus ?? "")
    ) {
      try {
        const order = await submitOrderToArea(pedido);
        await aplicarPedidoArea(pedido.id, order);
      } catch {
        return new Response(null, {
          status: 303,
          headers: { location: `${ctx.url.pathname}?retry=1` },
        });
      }
    }
    return new Response(null, {
      status: 303,
      headers: { location: ctx.url.pathname },
    });
  },
});

export default define.page<typeof handler>(function PedidoPage({ data }) {
  const { pedido } = data;
  const status = pedido.areaStatus;
  const paid = status === "active" || status === "paid" ||
    status === "awaiting_fulfillment";
  const areaBase = areaSalesConfig()?.baseUrl ?? "https://area.rockfy.net";
  return (
    <Layout
      rota="/checkout"
      titulo={`Pedido ${pedido.plan} | Rockfy`}
      descricao="Acompanhe seu pedido Rockfy."
      naoIndexar
    >
      <main class="ckout">
        <div class="ckout__painel">
          <section class="ckout__confirmacao">
            <p class="ckout__chapeu">Pedido #{pedido.id.slice(0, 8)}</p>
            <h1 class="ckout__titulo">
              {status === "active"
                ? "Tudo pronto para começar"
                : "Seu pedido foi recebido"}
            </h1>
            <p class="ckout__lede">
              Plano {pedido.plan} · {formatarPreco(pedido.priceCents)}/mês
            </p>
            <div class="ckout__proximos">
              <p class="ckout__chapeu">Próximos passos</p>
              {status === "active"
                ? <p>Pagamento confirmado. Seu acesso já está disponível.</p>
                : status === "awaiting_fulfillment"
                ? (
                  <p>
                    Pagamento confirmado. Nossa equipe está ativando sua loja e
                    enviará os acessos.
                  </p>
                )
                : status === "cancelled" || status === "failed"
                ? (
                  <p>
                    Este pedido foi encerrado. Fale com nossa equipe para
                    continuar.
                  </p>
                )
                : pedido.areaPaymentUrl
                ? (
                  <p>
                    Abra a cobrança para concluir o pagamento. Atualizaremos
                    esta página após a confirmação.
                  </p>
                )
                : (
                  <p>
                    Estamos preparando sua cobrança. Tente novamente em
                    instantes.
                  </p>
                )}
            </div>
            {data.retry && (
              <p class="aviso aviso--erro">
                Não foi possível concluir agora. Tente novamente.
              </p>
            )}
            {pedido.areaPaymentUrl && !paid && (
              <p>
                <a
                  class="ckout__enviar"
                  href={pedido.areaPaymentUrl}
                  rel="noopener noreferrer"
                >
                  Abrir pagamento
                </a>
              </p>
            )}
            {!pedido.areaPaymentUrl && !paid && status !== "cancelled" &&
              status !== "failed" && (
              <form method="POST">
                <button class="ckout__enviar" type="submit">
                  Gerar cobrança
                </button>
              </form>
            )}
            {status === "active" && pedido.areaTenantSlug && (
              <p>
                <a
                  class="ckout__enviar"
                  href={`${areaBase}/${pedido.areaTenantSlug}`}
                >
                  Acessar minha Area
                </a>
              </p>
            )}
            {status === "active" && pedido.areaFulfillmentUrl && (
              <p>
                <a
                  class="ckout__enviar"
                  href={pedido.areaFulfillmentUrl}
                  rel="noopener noreferrer"
                >
                  Abrir minha loja
                </a>
              </p>
            )}
            {status !== "active" && status !== "cancelled" &&
              status !== "failed" && (
              <p>
                <a href={`/pedido/${pedido.id}`}>Atualizar status</a>
              </p>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
});
