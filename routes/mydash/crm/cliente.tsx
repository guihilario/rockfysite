import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import {
  type FichaCliente,
  fichaCliente,
  linkWhatsAppCliente,
} from "@/domain/crm.ts";
import { ETAPAS_CRM } from "@/domain/leads.ts";
import { formatarPreco, type PedidoStatus } from "@/domain/orders.ts";

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

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão de crédito",
  boleto: "Boleto",
};

const ROTULO_STATUS: Record<PedidoStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  cancelled: "Cancelado",
};

export const handler = define.handlers({
  async GET(ctx) {
    const u = new URL(ctx.req.url);
    const email = (u.searchParams.get("e") ?? "").trim().toLowerCase();
    const telefone = u.searchParams.get("f") ?? "";
    if (!email && !telefone) {
      return new Response(null, {
        status: 303,
        headers: { location: "/mydash/crm" },
      });
    }
    const ficha = await fichaCliente(email, telefone);
    return {
      data: {
        ficha,
        /* Caminho cheio, não "?e=…": os forms desta página mandam `voltar`
           e a rota de ação só aceita quem começa com /mydash/crm — um
           sufixo de query sozinho cairia no CRM, longe da ficha. */
        voltar: email
          ? `/mydash/crm/cliente?e=${encodeURIComponent(email)}`
          : `/mydash/crm/cliente?f=${encodeURIComponent(telefone)}`,
        usuario: ctx.state.usuario!,
      },
    };
  },
});

export default define.page<typeof handler>(function Cliente({ data }) {
  const { ficha, voltar } = data;
  return (
    <Shell titulo="Ficha" usuario={data.usuario} atual="crm">
      <div class="adm-cabeca">
        <div>
          <h1>{ficha.nome}</h1>
          <p class="adm-meta">
            {ficha.email}
            {ficha.telefone ? ` · telefone ${ficha.telefone}` : ""}
          </p>
          {ficha.documento && <p class="adm-meta">{ficha.documento}</p>}
          {ficha.endereco && <p class="adm-meta">{ficha.endereco}</p>}
        </div>
        <div class="crm-acoes">
          <a class="btn btn--ghost btn--sm" href="/mydash/crm">Voltar ao CRM</a>
          <a
            class="btn btn--ghost btn--sm"
            href={`/mydash/crm/novo-pedido?e=${
              encodeURIComponent(ficha.email)
            }`}
          >
            Lançar pedido
          </a>
          {ficha.telefone && (
            <a
              class="btn btn--sm"
              href={linkWhatsAppCliente(
                ficha.telefone,
                `Oi! Aqui é da Rockfy. Vi seu contato por aqui e queria entender o que você está procurando.`,
              )}
              rel="noopener"
              target="_blank"
            >
              Chamar no WhatsApp
            </a>
          )}
        </div>
      </div>

      <div class="crm-ficha-numeros">
        <p>
          {ficha.leads.length} lead(s)
          {ficha.pedidosPagos > 0 && ` · ${ficha.pedidosPagos} pago(s)`}
        </p>
        {ficha.valorTotalCents > 0 && (
          <p>{formatarPreco(ficha.valorTotalCents)} nos pedidos ativos</p>
        )}
      </div>

      {(ficha.leads.length === 0 && ficha.pedidos.length === 0)
        ? (
          <p class="vazio">
            Nenhum registro encontrado para este contato.
            <br />
            <a class="btn btn--ghost btn--sm" href="/mydash/crm">Voltar</a>
          </p>
        )
        : (
          <>
            <section class="adm-bloco">
              <h2 class="adm-meta adm-meta--secao">Leads desta pessoa</h2>
              {ficha.leads.length === 0
                ? <p class="adm-nota">Nenhum lead neste contato.</p>
                : <CadastroContato ficha={ficha} voltar={voltar} />}
            </section>

            <section class="adm-bloco">
              <h2 class="adm-meta adm-meta--secao">Pedidos desta pessoa</h2>
              {ficha.pedidos.length === 0
                ? (
                  <p class="adm-nota">
                    Nenhum pedido. Se alguém pagar por fora,{" "}
                    <a href="/mydash/crm/novo-pedido">lance aqui</a>.
                  </p>
                )
                : <PedidosDo ficha={ficha} voltar={voltar} />}
            </section>
          </>
        )}
    </Shell>
  );
});

/** Cada lead vira um formulário de edição: é o único lugar onde trocar
 *  etapa, anotação e dados do contato convivem. Tudo POST (funciona sem JS). */
function CadastroContato(
  { ficha, voltar }: { ficha: FichaCliente; voltar: string },
) {
  return (
    <div class="crm-ficha-lista">
      {ficha.leads.map((l) => (
        <form method="post" action="/mydash/crm/lead" class="crm-ficha-item">
          <input type="hidden" name="id" value={l.id} />
          <input type="hidden" name="voltar" value={voltar} />
          <div class="crm-grid">
            <label class="campo">
              <span>Nome</span>
              <input type="text" name="name" value={l.name} />
            </label>
            <label class="campo">
              <span>E-mail</span>
              <input type="text" name="email" value={l.email} />
            </label>
            <label class="campo">
              <span>Telefone</span>
              <input type="text" name="phone" value={l.phone} />
            </label>
            <label class="campo">
              <span>Plano</span>
              <input type="text" name="plan" value={l.plan ?? ""} />
            </label>
            <label class="campo">
              <span>Origem</span>
              <input type="text" name="source" value={l.source ?? ""} />
            </label>
            <label class="campo">
              <span>Etapa</span>
              <select name="etapa">
                {ETAPAS_CRM.map((e) => (
                  <option value={e.chave} selected={l.etapa === e.chave}>
                    {e.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label class="campo">
              <span>Retorno</span>
              <input
                type="date"
                name="proximoContato"
                value={l.proximoContato ?? ""}
              />
            </label>
            <label class="campo campo--g">
              <span>
                Anotação{" "}
                <em class="adm-meta">
                  — o que combinamos, o que falar no retorno
                </em>
              </span>
              <textarea name="observacao">{l.observacao}</textarea>
            </label>
          </div>
          <div class="form-acoes">
            <button class="btn btn--sm" type="submit">Salvar lead</button>
            <span class="adm-meta">{quando(l.createdAt)}</span>
            <button
              class="btn btn--perigo btn--sm espaco"
              type="submit"
              name="acao"
              value="deletar"
              data-confirmar="Remover este lead? A pessoa sai do CRM (os pedidos dela ficam)."
            >
              Remover
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}

/** Pedidos com os campos do checkout editáveis e o status à mão. */
function PedidosDo(
  { ficha, voltar }: { ficha: FichaCliente; voltar: string },
) {
  return (
    <div class="crm-ficha-lista">
      {ficha.pedidos.map((p) => (
        <form method="post" action="/mydash/crm/pedido" class="crm-ficha-item">
          <input type="hidden" name="id" value={p.id} />
          <input type="hidden" name="voltar" value={voltar} />
          <div class="crm-linha-titulo">
            <b>#{p.id.slice(0, 8)}</b>
            <span class="adm-meta">{quando(p.createdAt)}</span>
          </div>
          <div class="crm-grid">
            <label class="campo">
              <span>Plano</span>
              <input type="text" name="plan" value={p.plan} />
            </label>
            <label class="campo">
              <span>Valor/mês (R$)</span>
              <input
                type="number"
                name="priceReais"
                min="0"
                step="0.01"
                value={(p.priceCents / 100).toFixed(2)}
              />
            </label>
            <label class="campo">
              <span>Pagamento</span>
              <select name="paymentMethod">
                {Object.entries(ROTULO_PAGAMENTO).map(([v, r]) => (
                  <option value={v} selected={p.paymentMethod === v}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label class="campo">
              <span>Status</span>
              <select name="status">
                {Object.entries(ROTULO_STATUS).map(([v, r]) => (
                  <option value={v} selected={p.status === v}>{r}</option>
                ))}
              </select>
            </label>
            <label class="campo">
              <span>Nome do cliente</span>
              <input type="text" name="name" value={p.name} />
            </label>
            <label class="campo">
              <span>E-mail</span>
              <input type="text" name="email" value={p.email} />
            </label>
            <label class="campo">
              <span>Telefone</span>
              <input type="text" name="phone" value={p.phone} />
            </label>
            <label class="campo">
              <span>CPF/CNPJ</span>
              <input type="text" name="document" value={p.document} />
            </label>
            <label class="campo">
              <span>Empresa</span>
              <input type="text" name="company" value={p.company ?? ""} />
            </label>
            <label class="campo">
              <span>CEP</span>
              <input type="text" name="cep" value={p.cep} />
            </label>
            <label class="campo">
              <span>Endereço</span>
              <input type="text" name="address" value={p.address} />
            </label>
            <label class="campo">
              <span>Número</span>
              <input type="text" name="number" value={p.number} />
            </label>
            <label class="campo">
              <span>Complemento</span>
              <input type="text" name="complement" value={p.complement ?? ""} />
            </label>
            <label class="campo">
              <span>Cidade</span>
              <input type="text" name="city" value={p.city} />
            </label>
            <label class="campo">
              <span>UF</span>
              <input type="text" name="state" value={p.state} />
            </label>
            <label class="campo camp--g">
              <span>Anotação</span>
              <textarea name="observacao">{p.observacao}</textarea>
            </label>
          </div>
          <div class="form-acoes">
            <button class="btn btn--sm" type="submit">Salvar pedido</button>
            <span class="adm-meta">
              {ROTULO_PAGAMENTO[p.paymentMethod] ?? p.paymentMethod} · {p.phone}
            </span>
            <button
              class="btn btn--perigo btn--sm espaco"
              type="submit"
              name="acao"
              value="deletar"
              data-confirmar="Apagar este pedido? Os números do funil somem com ele."
            >
              Apagar
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
