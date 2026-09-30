import { assertEquals, assertMatch } from "jsr:@std/assert@^1.0.0";
import { chromium } from "npm:playwright@1.55.0";
import { db, pool } from "@/core/db/index.ts";

const areaPort = 19095;
const sitePort = 18018;
const areaBase = `http://127.0.0.1:${areaPort}`;
const siteBase = `http://127.0.0.1:${sitePort}`;

Deno.test({
  name: "Site wizard creates one Area order and shows payment status",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const created = new Map<string, Record<string, unknown>>();
    let submissions = 0;
    const mockArea = Deno.serve(
      { hostname: "127.0.0.1", port: areaPort, onListen: () => {} },
      async (request) => {
        const path = new URL(request.url).pathname;
        if (path === "/api/sales/offers") {
          return Response.json([{
            slug: "bora",
            name: "Bora",
            amountCents: 4790,
            status: "active",
          }]);
        }
        if (request.headers.get("authorization") !== "Bearer test-token") {
          return new Response("Unauthorized", { status: 401 });
        }
        if (path === "/api/sales/orders") {
          const input = await request.json();
          submissions++;
          if (!created.has(input.checkoutKey)) {
            created.set(input.checkoutKey, {
              id: crypto.randomUUID(),
              checkoutKey: input.checkoutKey,
              status: "payment_pending",
              amountCents: 4790,
              paymentUrl: "https://pay.example.test/invoice",
            });
          }
          return Response.json({ order: created.get(input.checkoutKey) });
        }
        if (path === "/api/sales/orders/status") {
          const { checkoutKeys } = await request.json();
          return Response.json({
            orders: checkoutKeys.map((key: string) => created.get(key)).filter(
              Boolean,
            ),
          });
        }
        if (path === "/api/sales/orders/pix") {
          const { checkoutKey } = await request.json();
          return Response.json({
            pix: created.get(checkoutKey)?.status === "payment_pending"
              ? {
                encodedImage:
                  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=",
                payload: "000201PIX-E2E",
              }
              : undefined,
          });
        }
        return new Response("Not Found", { status: 404 });
      },
    );
    const site = new Deno.Command("deno", {
      args: ["serve", "-A", "--port", String(sitePort), "_fresh/server.js"],
      env: {
        ...Deno.env.toObject(),
        APP_ENV: "development",
        APP_URL: siteBase,
        PORT: String(sitePort),
        ROCKFY_AREA_SALES_URL: areaBase,
        ROCKFY_AREA_SALES_TOKEN: "test-token",
      },
      stdout: "null",
      stderr: "null",
    }).spawn();
    let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
    let email = "";
    try {
      for (let attempt = 0; attempt < 80; attempt++) {
        try {
          const response = await fetch(`${siteBase}/checkout/bora`);
          if (response.ok) break;
        } catch { /* still starting */ }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      browser = await chromium.launch({
        headless: true,
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      });
      const page = await browser.newPage();
      await page.route(
        "https://viacep.com.br/**",
        (route) =>
          route.fulfill({
            json: {
              logradouro: "Avenida Paulista",
              localidade: "São Paulo",
              uf: "SP",
            },
          }),
      );
      await page.goto(`${siteBase}/checkout/bora`);
      assertMatch(
        await page.locator("h1").first().textContent() ?? "",
        /Falta pouco/,
      );
      assertEquals(await page.locator("[data-passo]").count(), 3);
      email = `hybrid-e2e-${crypto.randomUUID()}@example.test`;
      await page.locator('[name="name"]').fill("Cliente E2E");
      await page.locator('[name="email"]').fill(email);
      await page.locator('[name="phone"]').fill("11987654321");
      await page.locator('[name="document"]').fill("52998224725");
      await page.locator('[data-toggle="passar"][data-alvo="2"]').click();
      await page.locator('[name="cep"]').fill("01310100");
      await page.locator('[name="address"]').fill("Avenida Paulista");
      await page.locator('[name="number"]').fill("100");
      await page.locator('[name="city"]').fill("São Paulo");
      await page.locator('[name="state"]').selectOption("SP");
      await page.locator('[data-toggle="passar"][data-alvo="3"]').click();
      await page.locator('[name="payment"][value="pix"]').check();
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/pedido\/[0-9a-f-]+/, { timeout: 15000 });
      assertEquals(
        await page.locator('img[alt="QR Code PIX deste pedido"]')
          .count(),
        1,
      );
      assertEquals(await page.locator("text=Copiar código PIX").count(), 1);
      const id = new URL(page.url()).pathname.split("/").at(-1)!;
      assertEquals(created.size, 1);
      assertEquals(created.has(id), true);
      assertEquals(submissions, 1);
      const order = await db.queryObject<
        { area_order_id: string; status: string }
      >({
        text:
          "SELECT area_order_id::text,status FROM orders WHERE id=$1 LIMIT 1",
        args: [id],
      });
      assertEquals(order.rows[0].status, "pending");
      assertEquals(Boolean(order.rows[0].area_order_id), true);
      Object.assign(created.get(id)!, {
        status: "active",
        tenantSlug: "tiker",
      });
      await page.getByRole("link", { name: "Acessar minha Area" }).waitFor({
        timeout: 20_000,
      });
      assertEquals(
        await page.getByRole("link", { name: "Acessar minha Area" })
          .getAttribute("href"),
        `${areaBase}/tiker`,
      );
    } finally {
      await browser?.close();
      site.kill("SIGTERM");
      await site.status;
      await mockArea.shutdown();
      if (email) {
        await db.queryObject({
          text: "DELETE FROM orders WHERE email=$1",
          args: [email],
        });
        await db.queryObject({
          text: "DELETE FROM leads WHERE email=$1",
          args: [email],
        });
      }
      await pool.end();
    }
  },
});
