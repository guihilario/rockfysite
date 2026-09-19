import { define } from "@/utils.ts";
import {
  avisarSistemaExterno,
  criarLead,
  registrarEnvio,
} from "@/domain/leads.ts";
import { formatarTelefone, telefoneValido } from "@/core/formata.ts";

/**
 * Cria um lead a partir da primeira etapa do checkout.
 *
 * O checkout é um formulário único que só envia no final; a pessoa que para
 * na primeira fase ("Seus dados") nunca viraria pedido e, sem este endpoint,
 * sumiria junto. O wizard chama este POST via fetch ao avançar do passo 1 —
 * best effort: falhou a rede, o usuário não fica preso (o pedido, se fechado,
 * ainda se salva), e o console avisa.
 *
 * Mesmo tratamento da rota pública de lead: grava no banco, avisa o webhook,
 * guarda o status do envio. Campos plan/source vêm de campos ocultos do
 * formulário (o plano do slug e a origem do clique).
 */
export const handler = define.handlers({
  async POST(ctx) {
    let corpo: Record<string, unknown>;
    try {
      corpo = await ctx.req.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, erro: "corpo inválido" }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const limpar = (v: unknown, max: number): string =>
      String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
    const name = limpar(corpo.name, 120);
    const email = limpar(corpo.email, 160);
    const phone = limpar(corpo.phone, 40);
    const plan = limpar(corpo.plan, 60) || null;
    const source = limpar(corpo.source, 200) || null;

    /* Quem posta direto não passou pelo `required` do HTML — valida aqui. */
    if (!name || !email.includes("@") || !telefoneValido(phone)) {
      return new Response(
        JSON.stringify({ ok: false, erro: "dados incompletos" }),
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    const lead = await criarLead({
      name,
      email,
      phone: formatarTelefone(phone),
      plan,
      source,
    });
    const status = await avisarSistemaExterno(lead);
    if (status !== "ok") {
      console.warn(`[checkout] webhook: ${status} (lead ${lead.id})`);
    }
    await registrarEnvio(lead.id, status);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  },
});
