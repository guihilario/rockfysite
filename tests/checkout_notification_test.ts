import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.0";

Deno.test({
  name: "Area checkout still notifies the Site admin of a new order",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const previous = new Map<string, string | undefined>();
    for (
      const [key, value] of Object.entries({
        RESEND_API_KEY: "test-key",
        EMAIL_FROM: "Rockfy <pedidos@example.test>",
        EMAIL_TO: "admin@example.test",
        ROCKFY_AREA_SALES_URL: "http://127.0.0.1:19095",
        ROCKFY_AREA_SALES_TOKEN: "test-token",
      })
    ) {
      previous.set(key, Deno.env.get(key));
      Deno.env.set(key, value);
    }
    const originalFetch = globalThis.fetch;
    let orderId = "";
    let pool: { end: () => Promise<void> } | undefined;
    try {
      const { handler } = await import("@/routes/checkout/[slug].tsx");
      const database = await import("@/core/db/index.ts");
      pool = database.pool;
      const notices: Array<Record<string, unknown>> = [];
      globalThis.fetch = (request, init) => {
        const url = String(request);
        if (url.endsWith("/api/sales/offers")) {
          return Promise.resolve(Response.json([{
            slug: "bora",
            amountCents: 4790,
            status: "active",
          }]));
        }
        if (url === "https://api.resend.com/emails") {
          notices.push(JSON.parse(String(init?.body)));
          return Promise.resolve(Response.json({ id: "email-test" }));
        }
        if (url.endsWith("/api/sales/orders")) {
          const input = JSON.parse(String(init?.body));
          return Promise.resolve(Response.json({
            order: {
              id: crypto.randomUUID(),
              checkoutKey: input.checkoutKey,
              status: "payment_pending",
              amountCents: 4790,
            },
          }));
        }
        throw new Error(`Unexpected fetch: ${url}`);
      };
      orderId = crypto.randomUUID();
      const form = new URLSearchParams({
        checkout_key: orderId,
        name: "Cliente Teste",
        email: `notify-${orderId}@example.test`,
        phone: "11987654321",
        document: "52998224725",
        cep: "01310100",
        address: "Avenida Paulista",
        number: "100",
        city: "São Paulo",
        state: "SP",
        payment: "pix",
      });
      const post = () =>
        handler.POST!({
          params: { slug: "bora" },
          req: new Request("http://localhost/checkout/bora", {
            method: "POST",
            body: form,
          }),
        } as never);
      const response = await post();
      if (!(response instanceof Response)) {
        throw new Error("Checkout did not redirect to the order");
      }
      assertEquals(response.status, 303);
      assertEquals(response.headers.get("location"), `/pedido/${orderId}`);
      assertEquals(notices.length, 1);
      assertEquals(notices[0].to, "admin@example.test");
      assertMatch(String(notices[0].subject), /Novo pedido no site/);
      assertMatch(String(notices[0].text), new RegExp(orderId));
      await post();
      assertEquals(notices.length, 1);
    } finally {
      globalThis.fetch = originalFetch;
      if (orderId && pool) {
        const { db } = await import("@/core/db/index.ts");
        await db.queryObject({
          text: "DELETE FROM orders WHERE id=$1",
          args: [orderId],
        });
      }
      await pool?.end();
      for (const [key, value] of previous) {
        if (value === undefined) Deno.env.delete(key);
        else Deno.env.set(key, value);
      }
    }
  },
});
