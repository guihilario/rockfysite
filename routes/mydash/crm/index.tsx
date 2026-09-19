import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import {
  CHAVES_ETAPA,
  contarPorEtapa,
  ETAPAS_CRM,
  listarLeads,
} from "@/domain/leads.ts";
import { digitosTelefone } from "@/domain/crm.ts";

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

/** A data de retorno sem o ano quando é o ano atual — "amanhã" tem que ser
 *  óbvio sem precisar descer o olho até o calendário. */
function quandoVoltar(d: string): string {
  const [ano, mes, dia] = d.split("-");
  if (`${ano}` === new Date().getFullYear().toString()) {
    return `${Number(dia)} ${MESES[Number(mes) - 1]}`;
  }
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${ano}`;
}

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const q = u.searchParams.get("q")?.trim() ?? "";
    const etapa = u.searchParams.get("etapa") ?? "";
    /* Sem `visao`, cai na lista: é a que funciona sem JavaScript (o kanban
       mexe card por arrasto). */
    const visao = u.searchParams.get("visao") === "kanban" ? "kanban" : "lista";

    const [leads, contagem] = await Promise.all([
      listarLeads({ limite: 500, busca: q, etapa }),
      contarPorEtapa(),
    ]);

    return {
      data: {
        leads,
        contagem,
        q,
        etapa: CHAVES_ETAPA.has(etapa) ? etapa : "",
        visao,
        total: leads.length,
        voltar: u.pathname + u.search,
        usuario: ctx.state.usuario!,
        aviso: u.searchParams.get("ok") ?? undefined,
      },
    };
  },
});

const RECADO: Record<string, string> = {
  "lead-salvo": "Lead atualizado.",
  "lead-criado": "Lead criado.",
  "lead-removido": "Lead removido.",
  "pedido-salvo": "Pedido atualizado.",
  "pedido-criado": "Pedido criado.",
  "pedido-removido": "Pedido removido.",
  invalido: "Alguns dados não passaram na validação — nada foi salvo.",
};

export default define.page<typeof handler>(function Crm({ data }) {
  const filtro = data.etapa || data.q;
  const origem = new URLSearchParams();
  if (data.etapa) origem.set("etapa", data.etapa);
  if (data.q) origem.set("q", data.q);
  const comOrigem = (extra: string): string => {
    const p = new URLSearchParams(origem);
    for (const [k, v] of new URLSearchParams(extra)) p.set(k, v);
    const s = p.toString();
    return s ? `/mydash/crm?${s}` : "/mydash/crm";
  };

  return (
    <Shell
      titulo="CRM"
      usuario={data.usuario}
      atual="crm"
      scripts={<script src="/js/crm.js" defer />}
    >
      <div class="adm-cabeca">
        <div>
          <h1>CRM</h1>
          <p class="adm-meta">
            {filtro ? `${data.total} resultado(s)` : `${data.total} lead(s)`}
            {" "}
            · leads e pedidos juntos por pessoa
          </p>
        </div>
        <div class="crm-acoes">
          <a class="btn btn--ghost btn--sm" href="/mydash/crm/novo-lead">
            Novo lead
          </a>
          <a class="btn btn--sm" href="/mydash/crm/novo-pedido">
            Novo pedido
          </a>
        </div>
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      {data.visao === "lista" && (
        <nav class="crm-visao" aria-label="Visão">
          <span class="is-on">Lista</span>
          <a href={comOrigem("visao=kanban")}>Kanban</a>
        </nav>
      )}
      {data.visao === "kanban" && (
        <nav class="crm-visao" aria-label="Visão">
          <a href={comOrigem("visao=lista")}>Lista</a>
          <span class="is-on">Kanban</span>
        </nav>
      )}

      <form method="get" action="/mydash/crm" class="adm-busca">
        <input
          type="search"
          name="q"
          value={data.q}
          placeholder="Buscar por nome, e-mail ou telefone…"
        />
        <button class="btn btn--sm" type="submit">Buscar</button>
      </form>

      {data.visao === "lista" && (
        <div class="crm-funil">
          <a
            href={data.etapa || data.q ? comOrigem("etapa=") : "/mydash/crm"}
            class={!data.etapa ? "is-on" : undefined}
          >
            Todas{" "}
            <b>{Object.values(data.contagem).reduce((a, b) => a + b, 0)}</b>
          </a>
          {ETAPAS_CRM.map((e) => (
            <a
              href={comOrigem(`etapa=${e.chave}`)}
              class={data.etapa === e.chave ? "is-on" : undefined}
              data-etapa-crm={e.chave}
              data-cor={e.chave}
            >
              <i /> {e.rotulo}{" "}
              <b data-conta-etapa={e.chave}>{data.contagem[e.chave] ?? 0}</b>
            </a>
          ))}
        </div>
      )}

      {data.leads.length === 0
        ? (
          <p class="vazio">
            {data.visao === "kanban"
              ? "Nenhum lead nesta etapa."
              : "Nenhum lead ainda. Os contatos dos planos e do checkout vêm para cá."}
          </p>
        )
        : data.visao === "lista"
        ? (
          <table class="adm-tabela crm-tabela">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Plano · Origem</th>
                <th>Etapa</th>
                <th>Próximo contato</th>
                <th>Anotação</th>
                <th>Chegou</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <span class="adm-titulo-cel">
                      <a
                        href={`/mydash/crm/cliente?e=${
                          encodeURIComponent(l.email)
                        }`}
                      >
                        {l.name}
                      </a>
                    </span>
                    <span class="adm-slug">
                      {l.email}
                      <br />
                      {l.phone}
                    </span>
                  </td>
                  <td>
                    {l.plan ?? "—"}
                    <span class="adm-slug">{l.source ?? ""}</span>
                  </td>
                  <td>
                    <form
                      method="post"
                      action="/mydash/crm/lead"
                      class="crm-inline"
                      data-crm-etapa
                    >
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="voltar" value={data.voltar} />
                      <select name="etapa" class="crm-etapa">
                        {ETAPAS_CRM.map((e) => (
                          <option
                            value={e.chave}
                            selected={l.etapa === e.chave}
                          >
                            {e.rotulo}
                          </option>
                        ))}
                      </select>
                      <button
                        class="btn btn--sm crm-submit"
                        type="submit"
                      >
                        Mover
                      </button>
                    </form>
                  </td>
                  <td>
                    {l.proximoContato
                      ? (
                        <span class="crm-prazo">
                          {quandoVoltar(l.proximoContato)}
                        </span>
                      )
                      : <span class="adm-meta">—</span>}
                  </td>
                  <td class="crm-anotacao">
                    {l.observacao
                      ? (
                        <span class="adm-slug">
                          {l.observacao.length > 42
                            ? `${l.observacao.slice(0, 42)}…`
                            : l.observacao}
                        </span>
                      )
                      : <span class="adm-meta">—</span>}
                  </td>
                  <td>
                    <span class="adm-slug">{quando(l.createdAt)}</span>
                  </td>
                  <td class="acoes">
                    <a
                      class="btn btn--ghost btn--sm"
                      href={`/mydash/crm/cliente?e=${
                        encodeURIComponent(l.email)
                      }`}
                    >
                      Abrir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        : (
          <div class="crm-kanban" data-crm-kanban>
            {ETAPAS_CRM.filter((e) =>
              (data.etapa && e.chave === data.etapa) || !data.etapa
            ).map((e) => {
              const cards = data.leads.filter((l) => l.etapa === e.chave);
              return (
                <section
                  class="crm-coluna"
                  data-etapa-coluna={e.chave}
                  data-cor={e.chave}
                >
                  <header class="crm-coluna-topo">
                    <h2>
                      <i /> {e.rotulo}
                    </h2>
                    <b data-conta-etapa={e.chave}>{cards.length}</b>
                  </header>
                  <div class="crm-coluna-cartoes">
                    {cards.map((l) => (
                      <article
                        class="crm-card"
                        data-id={l.id}
                        data-etapa={l.etapa}
                        key={l.id}
                      >
                        <p class="crm-card-nome">
                          <a
                            draggable={false}
                            href={`/mydash/crm/cliente?e=${
                              encodeURIComponent(l.email)
                            }`}
                          >
                            {l.name}
                          </a>
                        </p>
                        <p class="crm-card-meta">
                          {l.plan ?? "Sem plano"}
                          {l.source ? ` · ${l.source}` : ""}
                        </p>
                        {l.proximoContato && (
                          <p class="crm-prazo" data-cor={e.chave}>
                            Retorno {quandoVoltar(l.proximoContato)}
                          </p>
                        )}
                        {l.observacao && (
                          <p class="crm-card-anotacao">
                            {l.observacao.length > 70
                              ? `${l.observacao.slice(0, 70)}…`
                              : l.observacao}
                          </p>
                        )}
                        <p class="crm-card-fio">
                          <a
                            draggable={false}
                            href={`/mydash/crm/cliente?e=${
                              encodeURIComponent(l.email)
                            }`}
                          >
                            Abrir ficha
                          </a>
                          <a
                            draggable={false}
                            href={`https://wa.me/55${digitosTelefone(l.phone)}`}
                            rel="noopener"
                            target="_blank"
                          >
                            WhatsApp
                          </a>
                        </p>
                      </article>
                    ))}
                    {cards.length === 0 && (
                      <p class="crm-coluna-vazia">Solte aqui um lead</p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
    </Shell>
  );
});
