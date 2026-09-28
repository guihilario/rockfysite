import { areaSalesConfig } from "./area.ts";
import { type Plan, slugPlano } from "../../data/plans.ts";

let cached: { until: number; prices: Record<string, number> } | undefined;

export async function currentSalesPrices(): Promise<Record<string, number>> {
  const config = areaSalesConfig();
  if (!config) return {};
  if (cached && cached.until > Date.now()) return cached.prices;
  try {
    const response = await fetch(`${config.baseUrl}/api/sales/offers`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body: unknown = await response.json();
    if (!Array.isArray(body)) throw new Error("Invalid sales catalog");
    const prices: Record<string, number> = {};
    for (const item of body) {
      if (typeof item !== "object" || item === null) continue;
      const offer = item as Record<string, unknown>;
      if (
        typeof offer.slug === "string" &&
        typeof offer.amountCents === "number" &&
        Number.isSafeInteger(offer.amountCents) && offer.amountCents > 0
      ) {
        prices[offer.slug] = offer.status === "active" ? offer.amountCents : -1;
      }
    }
    cached = { until: Date.now() + 60_000, prices };
    return prices;
  } catch {
    return cached?.prices ?? {};
  }
}

export function pricedPlans(
  plans: Plan[],
  prices: Record<string, number>,
): Plan[] {
  return plans.map((plan) => {
    const amount = prices[slugPlano(plan.name)];
    return amount === undefined ? plan : amount < 0
      ? {
        ...plan,
        priceCents: undefined,
        price: "Indisponível",
        period: null,
        cta: "Falar com a gente",
      }
      : {
        ...plan,
        priceCents: amount,
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount / 100),
      };
  });
}
