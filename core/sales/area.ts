/** The Site remains a marketing entry point. Once configured, the Area owns
 * new contacts and checkout orders. No gateway credentials live here. */
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

export function areaCheckoutUrl(slug: string, source: string): string | null {
  const config = areaSalesConfig();
  if (!config) return null;
  const url = new URL(`/contratar/${encodeURIComponent(slug)}`, config.baseUrl);
  if (source) url.searchParams.set("origem", source.slice(0, 200));
  return url.toString();
}

export async function forwardLeadToArea(input: {
  name: string;
  email: string;
  phone: string;
  plan?: string | null;
  source?: string | null;
}): Promise<boolean> {
  const config = areaSalesConfig();
  if (!config) return false;
  const response = await fetch(`${config.baseUrl}/api/sales/leads`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: [input.plan, input.source].filter(Boolean).join(" · "),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Area lead endpoint returned ${response.status}`);
  }
  return true;
}
