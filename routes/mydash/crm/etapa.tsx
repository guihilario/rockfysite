import { define } from "@/utils.ts";
import { atualizarLead, CHAVES_ETAPA } from "@/domain/leads.ts";

/**
 * Troca de etapa pelo kanban: o navegador só solta o cartão aqui depois do
 * arrasto, então o payload é JSON — não dá para fazer isso com <form>. Sem
 * JavaScript a rota não é alcançada e nada quebra: é o mesmo POST que a lista
 * faz, só que sem recarregar a página.
 */
export const handler = define.handlers({
  async POST(ctx) {
    let corpo: { id?: unknown; etapa?: unknown };
    try {
      corpo = await ctx.req.json();
    } catch {
      return Response.json({ ok: false }, { status: 400 });
    }
    const id = String(corpo.id ?? "");
    const etapa = String(corpo.etapa ?? "");
    if (!id || !CHAVES_ETAPA.has(etapa)) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const ok = await atualizarLead(id, { etapa });
    return ok
      ? Response.json({ ok: true })
      : Response.json({ ok: false }, { status: 404 });
  },
});
