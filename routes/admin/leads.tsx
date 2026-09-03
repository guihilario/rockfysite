import { define } from "@/utils.ts";
import {
  CHAVE_WEBHOOK,
  gravarConfig,
  lerConfig,
  listarLeads,
} from "@/domain/leads.ts";
import { Shell } from "@/components/admin/Shell.tsx";

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function quando(d: Date): string {
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d.getDate()} ${MESES[d.getMonth()]} · ${hora}`;
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const [leads, webhook] = await Promise.all([
      listarLeads({ limite: 200 }),
      lerConfig(CHAVE_WEBHOOK),
    ]);
    return {
      data: {
        leads,
        webhook: webhook ?? "",
        usuario: ctx.state.usuario!,
        aviso: u.searchParams.get("ok") ?? undefined,
      },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const url = String(form.get("webhook") ?? "").trim();
    /* Vazio apaga a configuração; qualquer outra coisa precisa ser uma URL
       http(s) — salvar um endereço inválido só produziria falha silenciosa
       na próxima captura. */
    if (url && !/^https?:\/\/\S+$/i.test(url)) {
      return new Response(null, {
        status: 303,
        headers: { location: "/admin/leads?ok=invalida" },
      });
    }
    await gravarConfig(CHAVE_WEBHOOK, url);
    return new Response(null, {
      status: 303,
      headers: { location: "/admin/leads?ok=salvo" },
    });
  },
});

const RECADO: Record<string, string> = {
  salvo: "Endereço do webhook salvo.",
  invalida: "Endereço inválido — precisa começar com http:// ou https://.",
};

export default define.page<typeof handler>(function Leads({ data }) {
  return (
    <Shell titulo="Contatos" usuario={data.usuario} atual="leads">
      <div class="adm-cabeca">
        <div>
          <h1>Contatos dos planos</h1>
          <p class="adm-meta">
            {data.leads.length} registro(s) · mais recentes primeiro
          </p>
        </div>
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      <section class="adm-bloco">
        <h2 class="adm-meta adm-meta--secao">Envio para sistema externo</h2>
        <p class="adm-nota">
          Cada contato capturado é gravado aqui e, se houver um endereço abaixo,
          enviado por <code>POST</code> em JSON com os campos <code>id</code>,
          {" "}
          <code>nome</code>, <code>email</code>, <code>telefone</code>,{" "}
          <code>plano</code>, <code>origem</code> e{" "}
          <code>criado_em</code>. O contato é salvo antes do envio: se o sistema
          externo falhar, nada se perde — a coluna “envio” abaixo mostra o que
          aconteceu.
        </p>
        <form method="POST" class="adm-linha-forma">
          <input
            type="url"
            name="webhook"
            value={data.webhook}
            placeholder="https://seu-crm.exemplo.com/webhook"
            class="adm-input"
          />
          <button type="submit" class="adm-btn">Salvar</button>
        </form>
      </section>

      {data.leads.length === 0
        ? <p class="adm-nota">Nenhum contato capturado ainda.</p>
        : (
          <table class="adm-tabela">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Nome</th>
                <th>Contato</th>
                <th>Plano</th>
                <th>Origem</th>
                <th>Envio</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((l) => (
                <tr key={l.id}>
                  <td>{quando(l.createdAt)}</td>
                  <td>{l.name}</td>
                  <td>
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                    <br />
                    <span class="adm-meta">{l.phone}</span>
                  </td>
                  <td>{l.plan ?? "—"}</td>
                  <td>{l.source ?? "—"}</td>
                  <td>
                    <span
                      class={l.webhookStatus === "ok"
                        ? "adm-selo is-ok"
                        : "adm-selo"}
                    >
                      {l.webhookStatus ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </Shell>
  );
});
