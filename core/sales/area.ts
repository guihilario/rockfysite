/** The Site owns the sales experience; the Area owns billing and access. */
import type { Pedido } from "@/domain/orders.ts";
import { slugPlano } from "@/data/plans.ts";

export interface AreaOrder {
  id: string;
  checkoutKey: string;
  status: string;
  amountCents: number;
  paymentUrl?: string;
  tenantSlug?: string;
  fulfillmentUrl?: string;
}
export function areaSalesConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = Deno.env.get("ROCKFY_AREA_SALES_URL")?.trim().replace(
    /\/$/,
    "",
  );
  const token = Deno.env.get("ROCKFY_AREA_SALES_TOKEN")?.trim();
  if (!baseUrl || !token) return null;
  const url = new URL(baseUrl);
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  ) {
    throw new Error("ROCKFY_AREA_SALES_URL must use HTTPS");
  }
  return { baseUrl: url.toString().replace(/\/$/, ""), token };
}

export async function areaOfferPrice(slug: string): Promise<number | null> {
  const config = areaSalesConfig();
  if (!config) return null;
  const response = await fetch(`${config.baseUrl}/api/sales/offers`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    throw new Error(`Area offers endpoint returned ${response.status}`);
  }
  const offers: unknown = await response.json();
  if (!Array.isArray(offers)) throw new Error("Area returned invalid offers");
  const offer = offers.find((item) =>
    item?.slug === slug && item?.status === "active"
  );
  if (
    !offer || !Number.isSafeInteger(offer.amountCents) || offer.amountCents <= 0
  ) {
    throw new Error("Area offer is unavailable");
  }
  return offer.amountCents;
}

function billingMethod(method: string): "pix" | "bank_slip" | "card" {
  if (method === "cartao") return "card";
  if (method === "boleto") return "bank_slip";
  return "pix";
}

export async function submitOrderToArea(order: Pedido): Promise<AreaOrder> {
  const config = areaSalesConfig();
  if (!config) throw new Error("Area sales integration is unavailable");
  const response = await fetch(`${config.baseUrl}/api/sales/orders`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      offerSlug: slugPlano(order.plan),
      checkoutKey: order.id,
      name: order.name,
      email: order.email,
      phone: order.phone,
      document: order.document,
      company: order.company,
      zip: order.cep,
      street: order.address,
      addressNumber: order.number,
      complement: order.complement,
      city: order.city,
      state: order.state,
      paymentMethod: billingMethod(order.paymentMethod),
      source: order.source ?? "rockfy.com",
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Area order endpoint returned ${response.status}`);
  }
  const data: unknown = await response.json();
  const result = (data as { order?: AreaOrder }).order;
  if (!result || result.checkoutKey !== order.id || !result.id) {
    throw new Error("Area returned an invalid order");
  }
  return result;
}

export async function fetchAreaOrderStatuses(
  checkoutKeys: string[],
): Promise<AreaOrder[]> {
  const config = areaSalesConfig();
  if (!config || checkoutKeys.length === 0) return [];
  const response = await fetch(`${config.baseUrl}/api/sales/orders/status`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ checkoutKeys }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Area order status endpoint returned ${response.status}`);
  }
  const data: unknown = await response.json();
  const orders = (data as { orders?: AreaOrder[] }).orders;
  if (!Array.isArray(orders)) {
    throw new Error("Area returned invalid order statuses");
  }
  return orders;
}
