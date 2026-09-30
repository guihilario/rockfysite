import { assertEquals } from "jsr:@std/assert@^1.0.0";
import { db, pool } from "@/core/db/index.ts";
import {
  aplicarPedidoArea,
  atualizarStatus,
  buscarPedido,
  criarPedido,
  removerPedido,
} from "@/domain/orders.ts";
import { submitOrderToArea } from "@/core/sales/area.ts";

Deno.test({
  name: "Site persists checkout and keeps Area billing authoritative",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const originalUrl = Deno.env.get("ROCKFY_AREA_SALES_URL");
    const originalToken = Deno.env.get("ROCKFY_AREA_SALES_TOKEN");
    const originalFetch = globalThis.fetch;
    const checkoutKey = crypto.randomUUID();
    const input = {
      plan: "Bora",
      priceCents: 4790,
      name: "Cliente Teste",
      email: `hybrid-${crypto.randomUUID()}@example.test`,
      phone: "(11) 98765-4321",
      document: "529.982.247-25",
      cep: "01310-100",
      address: "Avenida Paulista",
      number: "100",
      city: "São Paulo",
      state: "SP",
      paymentMethod: "pix",
      areaHandoff: true,
      checkoutKey,
    };
    const order = await criarPedido(input);
    try {
      Deno.env.set("ROCKFY_AREA_SALES_URL", "http://localhost:4000");
      Deno.env.set("ROCKFY_AREA_SALES_TOKEN", "test-secret");
      assertEquals((await criarPedido(input)).id, order.id);
      globalThis.fetch = (request, init) => {
        assertEquals(String(request), "http://localhost:4000/api/sales/orders");
        const body = JSON.parse(String(init?.body));
        assertEquals(body.checkoutKey, order.id);
        assertEquals(body.offerSlug, "bora");
        assertEquals(body.paymentMethod, "pix");
        return Promise.resolve(Response.json({
          order: {
            id: crypto.randomUUID(),
            checkoutKey: order.id,
            status: "payment_pending",
            amountCents: 4790,
            paymentUrl: "https://pay.example.test/invoice",
          },
        }));
      };
      const result = await submitOrderToArea(order);
      await aplicarPedidoArea(order.id, result);
      await atualizarStatus(order.id, "paid");
      const stored = await buscarPedido(order.id);
      assertEquals(stored?.areaOrderId, result.id);
      assertEquals(stored?.areaStatus, "payment_pending");
      assertEquals(stored?.status, "pending");
      await removerPedido(order.id);
      assertEquals((await buscarPedido(order.id))?.id, order.id);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalUrl === undefined) Deno.env.delete("ROCKFY_AREA_SALES_URL");
      else Deno.env.set("ROCKFY_AREA_SALES_URL", originalUrl);
      if (originalToken === undefined) {
        Deno.env.delete("ROCKFY_AREA_SALES_TOKEN");
      } else Deno.env.set("ROCKFY_AREA_SALES_TOKEN", originalToken);
      await db.queryObject({
        text: "DELETE FROM orders WHERE id=$1",
        args: [order.id],
      });
      await pool.end();
    }
  },
});
