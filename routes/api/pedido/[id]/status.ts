import { define } from "@/utils.ts";
import { aplicarPedidoArea, buscarPedido } from "@/domain/orders.ts";
import { fetchAreaOrderStatuses } from "@/core/sales/area.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const pedido = await buscarPedido(ctx.params.id);
    if (!pedido || !pedido.areaHandoff) {
      return Response.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    let status = pedido.areaStatus;
    if (
      pedido.areaOrderId &&
      !["active", "awaiting_fulfillment", "cancelled", "failed"].includes(
        status ?? "",
      )
    ) {
      try {
        const [order] = await fetchAreaOrderStatuses([pedido.id]);
        if (order) {
          status = order.status;
          if (
            order.status !== pedido.areaStatus ||
            order.paymentUrl !== (pedido.areaPaymentUrl ?? undefined)
          ) {
            await aplicarPedidoArea(pedido.id, order);
          }
        }
      } catch {
        // A temporary Area failure must not turn a pending payment into a success.
      }
    }
    return Response.json({ status }, {
      headers: { "cache-control": "no-store" },
    });
  },
});
