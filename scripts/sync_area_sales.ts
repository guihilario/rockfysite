import { areaSalesConfig } from "../core/sales/area.ts";
import { db, pool } from "../core/db/index.ts";
import type { Lead } from "../domain/leads.ts";
import type { Pedido } from "../domain/orders.ts";

/** Run after the Area sales migration is deployed. Idempotent by Site UUID.
 * Without --apply, only prints counts; no personal data is logged. */
const apply = Deno.args.includes("--apply");
const config = areaSalesConfig();
if (!config) {
  throw new Error(
    "Configure ROCKFY_AREA_SALES_URL and ROCKFY_AREA_SALES_TOKEN",
  );
}

try {
  const [leads, orders] = await Promise.all([
    db.queryObject<Lead>({
      text: `SELECT id,name,email,phone,plan,source,etapa,observacao,
             proximo_contato "proximoContato",created_at "createdAt"
             FROM leads ORDER BY created_at,id`,
    }),
    db.queryObject<Pedido>({
      text: `SELECT id,plan,price_cents "priceCents",name,email,phone,
             document,company,cep,address,number,complement,city,state,
             payment_method "paymentMethod",status,source,observacao,
             created_at "createdAt" FROM orders ORDER BY created_at,id`,
    }),
  ]);
  console.log(
    JSON.stringify({
      leads: leads.rows.length,
      orders: orders.rows.length,
      apply,
    }),
  );
  if (apply) {
    for (
      const [kind, rows] of [["lead", leads.rows], [
        "order",
        orders.rows,
      ]] as const
    ) {
      for (const data of rows) {
        const response = await fetch(
          `${config.baseUrl}/api/sales/import-site`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${config.token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({ kind, data }),
            signal: AbortSignal.timeout(10_000),
          },
        );
        if (!response.ok) {
          throw new Error(
            `${kind} import failed: HTTP ${response.status} ${await response
              .text()}`,
          );
        }
      }
    }
    console.log("Area sales import complete");
  }
} finally {
  await pool.end();
}
