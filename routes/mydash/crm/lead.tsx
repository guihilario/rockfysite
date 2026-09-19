import { define } from "@/utils.ts";
import { atualizarLead, CHAVES_ETAPA, removerLead } from "@/domain/leads.ts";
import { formatarTelefone, telefoneValido } from "@/core/formata.ts";

/**
 * Ações do CRM sobre um lead: salvar edição ou remover. O destino do
 * redirect vem no próprio form (`voltar`) — da ficha, do funil ou da lista —
 * para o usuário voltar para onde estava. Aceita só caminho dentro do painel:
 * um form malicioso não pode transformar isso em redirecionador aberto.
 */
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

    if (String(form.get("acao") ?? "") === "deletar") {
      const voltar = paraOnde(
        String(form.get("voltar") ?? ""),
        "lead-removido",
      );
      await removerLead(id);
      return new Response(null, { status: 303, headers: { location: voltar } });
    }

    const tem = (nome: string): boolean => form.has(nome);
    const vazio = (nome: string): string | null =>
      String(form.get(nome) ?? "").replace(/\s+/g, " ").trim() || null;

    /* Valida cada campo só quando chegado no form: o funil da lista manda
       somente a etapa, e exigir nome/e-mail ali quebraria a troca rápida.
       Campo presente e em branco conta como inválido (quero apagar? só em
       plan/source/observacao, que têm `null` de verdade). */
    const name = tem("name") ? String(form.get("name") ?? "").trim() : null;
    const email = tem("email") ? String(form.get("email") ?? "").trim() : null;
    const phone = tem("phone") ? vazio("phone") : null;
    const etapa = tem("etapa") ? vazio("etapa") : null;
    const proximoRaw = String(form.get("proximoContato") ?? "").trim();

    const problema = (name !== null && !name) ||
      (email !== null && !email.includes("@")) ||
      (phone !== null && !telefoneValido(phone)) ||
      (etapa !== null && !CHAVES_ETAPA.has(etapa)) ||
      (proximoRaw && !/^\d{4}-\d{2}-\d{2}$/.test(proximoRaw));

    if (problema) {
      return new Response(null, {
        status: 303,
        headers: {
          location: paraOnde(String(form.get("voltar") ?? ""), "invalido"),
        },
      });
    }

    await atualizarLead(id, {
      name: name ?? undefined,
      email: email ?? undefined,
      phone: phone !== null ? formatarTelefone(phone) : undefined,
      plan: tem("plan") ? vazio("plan") : undefined,
      source: tem("source") ? vazio("source") : undefined,
      etapa: etapa ?? undefined,
      observacao: tem("observacao")
        ? String(form.get("observacao") ?? "").slice(0, 5000)
        : undefined,
      proximoContato: tem("proximoContato") ? (proximoRaw || null) : undefined,
    });

    return new Response(null, {
      status: 303,
      headers: {
        location: paraOnde(String(form.get("voltar") ?? ""), "lead-salvo"),
      },
    });
  },
});
