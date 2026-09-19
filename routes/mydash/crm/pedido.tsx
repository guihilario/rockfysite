import { define } from "@/utils.ts";
import {
  atualizarPedido,
  type PedidoStatus,
  removerPedido,
} from "@/domain/orders.ts";
import { formatarTelefone, telefoneValido } from "@/core/formata.ts";

const STATUS_VALIDOS = new Set<PedidoStatus>(["pending", "paid", "cancelled"]);
const PAGAMENTOS_VALIDOS = new Set(["pix", "cartao", "boleto"]);

/** Mesmo guarda do redirect do lead: só caminhos do próprio painel. */
function paraOnde(voltar: string | null, ok: string): string {
  if (!voltar || !voltar.startsWith("/mydash/crm")) voltar = "/mydash/crm";
  const separador = voltar.includes("?") ? "&" : "?";
  return `${voltar}${separador}ok=${ok}`;
}

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const id = String(form.get("id") ?? "");
    if (!id) {
      return new Response(null, {
        status: 303,
        headers: { location: paraOnde(null, "invalido") },
      });
    }
    const voltarIn = String(form.get("voltar") ?? "");

    if (String(form.get("acao") ?? "") === "deletar") {
      await removerPedido(id);
      return new Response(null, {
        status: 303,
        headers: { location: paraOnde(voltarIn, "pedido-removido") },
      });
    }

    const tem = (nome: string): boolean => form.has(nome);
    const vazio = (nome: string): string | null =>
      String(form.get(nome) ?? "").replace(/\s+/g, " ").trim() || null;

    const name = tem("name") ? String(form.get("name") ?? "").trim() : null;
    const email = tem("email") ? String(form.get("email") ?? "").trim() : null;
    const phone = tem("phone") ? vazio("phone") : null;
    const status = tem("status") ? vazio("status") : null;
    const pagamento = tem("paymentMethod") ? vazio("paymentMethod") : null;

    const priceRaw = tem("priceReais")
      ? String(form.get("priceReais") ?? "").trim().replace(",", ".")
      : null;
    const priceCents = priceRaw !== null
      ? Math.round(Number(priceRaw) * 100)
      : null;

    const problema = (name !== null && !name) ||
      (email !== null && !email.includes("@")) ||
      (phone !== null && !telefoneValido(phone)) ||
      (status !== null && !STATUS_VALIDOS.has(status as PedidoStatus)) ||
      (pagamento !== null && !PAGAMENTOS_VALIDOS.has(pagamento)) ||
      (priceCents !== null &&
        (!Number.isFinite(priceCents) || priceCents <= 0));

    if (problema) {
      return new Response(null, {
        status: 303,
        headers: { location: paraOnde(voltarIn, "invalido") },
      });
    }

    await atualizarPedido(id, {
      plan: tem("plan") ? vazio("plan") ?? undefined : undefined,
      priceCents: priceCents ?? undefined,
      name: name ?? undefined,
      email: email ?? undefined,
      phone: phone !== null ? formatarTelefone(phone) : undefined,
      document: tem("document") ? vazio("document") ?? undefined : undefined,
      company: tem("company") ? vazio("company") : undefined,
      cep: tem("cep") ? vazio("cep") ?? undefined : undefined,
      address: tem("address") ? vazio("address") ?? undefined : undefined,
      number: tem("number") ? vazio("number") ?? undefined : undefined,
      complement: tem("complement") ? vazio("complement") : undefined,
      city: tem("city") ? vazio("city") ?? undefined : undefined,
      state: tem("state") ? vazio("state") ?? undefined : undefined,
      paymentMethod: pagamento ?? undefined,
      status: (status ?? undefined) as PedidoStatus | undefined,
      observacao: tem("observacao")
        ? String(form.get("observacao") ?? "").slice(0, 5000)
        : undefined,
    });

    return new Response(null, {
      status: 303,
      headers: { location: paraOnde(voltarIn, "pedido-salvo") },
    });
  },
});
