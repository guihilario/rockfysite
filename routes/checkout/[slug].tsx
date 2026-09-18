import { define } from "@/utils.ts";
import { Layout } from "@/components/Layout.tsx";
import { planoPorSlug, slugPlano } from "@/data/plans.ts";
import { site } from "@/data/site.ts";
import { criarPedido, formatarPreco } from "@/domain/orders.ts";
import {
  cepValido,
  documentoValido,
  formatarCep,
  formatarDocumento,
  formatarTelefone,
  telefoneValido,
} from "@/core/formata.ts";

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const PAGAMENTOS = [
  { valor: "pix", titulo: "PIX" },
  { valor: "cartao", titulo: "Cartão de crédito" },
  { valor: "boleto", titulo: "Boleto" },
] as const;

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão de crédito",
  boleto: "Boleto",
};

function limpar(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export const handler = define.handlers({
  GET(ctx) {
    const u = new URL(ctx.req.url);
    const plano = planoPorSlug(ctx.params.slug);
    /* Sem plano (slug errado) ou sem preço fechado não há o que comprar —
       quem já sabia não tem checkout e segue para o WhatsApp. */
    if (!plano || !plano.priceCents) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `${site.whatsapp}?text=${
            encodeURIComponent(
              "Oi! Estou no site da Rockfy e queria saber o valor do plano.",
            )
          }`,
        },
      });
    }
    return {
      data: {
        plano,
        origem: u.searchParams.get("origem") ?? "/planos",
        aviso: u.searchParams.get("aviso") ?? undefined,
      },
    };
  },

  async POST(ctx) {
    const plano = planoPorSlug(ctx.params.slug);
    if (!plano || !plano.priceCents) {
      return new Response(null, { status: 404 });
    }
    const form = await ctx.req.formData();

    const name = limpar(form.get("name"), 120);
    const email = limpar(form.get("email"), 160);
    const phone = limpar(form.get("phone"), 40);
    const document = limpar(form.get("document"), 20).replace(/\D/g, "");
    const company = limpar(form.get("company"), 160) || null;
    const cep = limpar(form.get("cep"), 10).replace(/\D/g, "");
    const address = limpar(form.get("address"), 200);
    const number = limpar(form.get("number"), 20);
    const complement = limpar(form.get("complement"), 120) || null;
    const city = limpar(form.get("city"), 120);
    const state = limpar(form.get("state"), 2).toUpperCase();
    const paymentMethod = limpar(form.get("payment"), 20);
    const source = limpar(form.get("source"), 200) || "/planos";

    /* Validação de verdade aqui: `required` e os tipos do HTML são dica de
       interface, quem posta direto no endpoint não passou por eles. A regra
       é a mesma do core/formata.ts e do formata.js — os três concordam. */
    const errado = !name || !email.includes("@") || !telefoneValido(phone) ||
      !documentoValido(document) || !cepValido(cep) || !address || !number ||
      !city || !ESTADOS.includes(state);
    if (errado || !(paymentMethod in ROTULO_PAGAMENTO)) {
      const origem = source && source !== "/planos"
        ? `&origem=${encodeURIComponent(source)}`
        : "";
      return new Response(null, {
        status: 303,
        headers: {
          location: `/checkout/${slugPlano(plano.name)}?aviso=erro${origem}`,
        },
      });
    }

    /* Guarda a versão formatada (legível no painel); quem precisar dos
       dígitos puros normaliza com `somenteDigitos`. */
    const pedido = await criarPedido({
      plan: plano.name,
      priceCents: plano.priceCents,
      name,
      email,
      phone: formatarTelefone(phone),
      document: formatarDocumento(document),
      company,
      cep: formatarCep(cep),
      address,
      number,
      complement,
      city,
      state,
      paymentMethod,
      source,
    });

    const texto = [
      "Fiz meu pedido no site e quero confirmar o pagamento.",
      "",
      `Pedido: ${pedido.plan}`,
      `Valor: ${formatarPreco(pedido.priceCents)}/mês`,
    ].join("\n");

    return {
      data: {
        plano: pedido.plan,
        preco: formatarPreco(pedido.priceCents),
        primeiroNome: name.split(" ")[0],
        pagamento: ROTULO_PAGAMENTO[paymentMethod] ?? paymentMethod,
        destino: `${site.whatsapp}?text=${encodeURIComponent(texto)}`,
      },
    };
  },
});

/* ─────────── passos do formulário ──────────────────────────────────── */

/** Campo com rótulo, na malha do checkout. O rótulo vira o <span> de cima;
 *  `largura` controla quantas colunas o campo ocupa na grade ("1"|"2"|"3"). */
function Campo(
  { largura = 1, rotulo, ...props }: {
    largura?: 1 | 2 | 3;
    rotulo: string;
  } & Record<string, unknown>,
) {
  return (
    <label class={`ckout__campo ckout__campo--${largura}`}>
      <span>{rotulo}</span>
      <input {...props} />
    </label>
  );
}

/** Um passo do wizard. `children` é a malha de campos (ou o resumo, no
 *  último passo); `rodape` são os controles de avançar/voltar, que ficam
 *  fora da malha. A navegação é do `scripts.js`; sem script, todos os passos
 *  aparecem em sequência, os controles somem e o botão de confirmar envia. */
function Passo(
  { numero, titulo, dica, grade = true, rodape, children }: {
    numero: number;
    titulo: string;
    dica?: string;
    /** `false` para passos que não têm malha de campos (o de pagamento). */
    grade?: boolean;
    rodape?: import("preact").ComponentChildren;
    children: import("preact").ComponentChildren;
  },
) {
  return (
    <fieldset class="ckout__passo" data-passo={numero}>
      <legend class="ckout__passo-titulo">
        <span class="ckout__passo-numero">{numero}</span>
        {titulo}
      </legend>
      {dica && <p class="ckout__passo-dica">{dica}</p>}
      {grade ? <div class="ckout__grade">{children}</div> : children}
      {rodape && <div class="ckout__controles">{rodape}</div>}
    </fieldset>
  );
}

/** Botão de trocar de passo. Só aparece com JavaScript: sem script os passos
 *  estão todos visíveis e sobra um único submit no final. */
function Controle(
  { modo, alvo, rotulo }: {
    modo: "passar" | "voltar";
    alvo: number;
    rotulo: string;
  },
) {
  return (
    <button
      type="button"
      class="ckout__controle"
      data-toggle={modo}
      data-alvo={alvo}
    >
      {rotulo}
    </button>
  );
}

/** Cartões de escolha de pagamento (PIX, cartão, boleto). */
function CartaoPagamento(
  { valor, titulo }: { valor: string; titulo: string },
) {
  return (
    <label class="ckout__pagamento">
      <input type="radio" name="payment" value={valor} required />
      <span class="ckout__pagamento-corpo">
        <b>{titulo}</b>
      </span>
    </label>
  );
}

export default define.page<typeof handler>(function Checkout({ data }) {
  /* Confirmação: o POST criou o pedido e devolveu o resumo da compra. */
  if ("destino" in data) {
    const { plano, preco, primeiroNome, pagamento, destino } = data;
    return (
      <Layout
        rota="/checkout"
        titulo="Pedido recebido | Rockfy"
        descricao="Seu pedido foi registrado. Aguardamos a confirmação do pagamento."
        naoIndexar
      >
        <main class="ckout">
          <div class="ckout__painel">
            <section class="ckout__confirmacao">
              <p class="ckout__chapeu">Pedido recebido</p>
              <h1 class="ckout__titulo">
                Obrigado, <b>{primeiroNome}!</b>
              </h1>
              <p class="ckout__lede">
                Registramos sua compra do plano <b>{plano}</b> no valor de{" "}
                <b>{preco}/mês</b>, via{" "}
                <b>{pagamento.toUpperCase()}</b>. Seu pedido está em{" "}
                <b>aguardando pagamento</b>.
              </p>
              <div class="ckout__proximos">
                <p class="ckout__chapeu">Próximos passos</p>
                <ol class="ckout__passos-lista">
                  <li>
                    Confirme o pagamento com a gente no WhatsApp usando o botão
                    abaixo.
                  </li>
                  <li>
                    Assim que a cobrança for confirmada, ativamos seu plano e
                    você recebe os acessos por e-mail.
                  </li>
                </ol>
                <a class="cta" href={destino} target="_blank" rel="noopener">
                  Confirmar pagamento no WhatsApp
                  <span class="badge">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M5 12h14m-6-6 6 6-6 6"
                        stroke-width="1.9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <p class="ckout__nota">
                  Pagamento confirmado? Mandamos os acessos na hora. Precisa de
                  ajuda? Nosso time responde aqui mesmo no WhatsApp.
                </p>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    );
  }

  const { plano, origem, aviso } = data;

  return (
    <Layout
      rota="/checkout"
      titulo={`Checkout — ${plano.name} | Rockfy`}
      descricao={`Finalize sua contratação do plano ${plano.name} de hospedagem Rockfy.`}
      naoIndexar
    >
      <main class="ckout">
        <div class="ckout__painel">
          <form class="ckout__forma" method="POST" data-checkout>
            <input type="hidden" name="source" value={origem} />

            <div class="ckout__topo">
              <p class="ckout__chapeu">Checkout · Plano {plano.name}</p>
              <h1 class="ckout__titulo">Falta pouco pra tudo rodar</h1>
              {aviso === "erro" && (
                <p class="aviso aviso--erro">
                  Confira os dados do formulário — algo não ficou completo.
                </p>
              )}
              {
                /* Etapas do wizard. Sem JavaScript o indicador não aparece e
                  os passos seguem um abaixo do outro. */
              }
              <ol class="ckout__degustacao" data-passo-indicador>
                <li>
                  <span>1</span> Seus dados
                </li>
                <li>
                  <span>2</span> Pagamento
                </li>
                <li>
                  <span>3</span> Confirmar
                </li>
              </ol>
            </div>

            <Passo
              numero={1}
              titulo="Seus dados"
              dica="É com estes dados que emitimos a cobrança e a nota."
              rodape={<Controle modo="passar" alvo={2} rotulo="Continuar" />}
            >
              <Campo
                largura={2}
                rotulo="Nome completo"
                name="name"
                type="text"
                required
                autocomplete="name"
                maxLength={120}
                placeholder="Como quiser ser chamado"
              />
              <Campo
                largura={2}
                rotulo="E-mail"
                name="email"
                type="email"
                required
                autocomplete="email"
                maxLength={160}
                placeholder="voce@exemplo.com"
              />
              <Campo
                largura={1}
                rotulo="Telefone / WhatsApp"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autocomplete="tel"
                maxLength={40}
                placeholder="(11) 90000-0000"
                data-mascara="telefone"
              />
              <Campo
                largura={1}
                rotulo="CPF ou CNPJ"
                name="document"
                type="text"
                required
                inputMode="numeric"
                maxLength={18}
                placeholder="Somente números"
                data-mascara="documento"
              />
              <Campo
                largura={2}
                rotulo="Empresa (opcional)"
                name="company"
                type="text"
                autocomplete="organization"
                maxLength={160}
                placeholder="Nome da sua empresa"
              />
            </Passo>

            <Passo
              numero={2}
              titulo="Cobrança e nota"
              dica="O endereço entra na nota fiscal. Preencha o CEP e o resto vem junto."
              rodape={
                <>
                  <Controle modo="voltar" alvo={1} rotulo="Voltar" />
                  <Controle modo="passar" alvo={3} rotulo="Continuar" />
                </>
              }
            >
              <Campo
                largura={1}
                rotulo="CEP"
                name="cep"
                type="text"
                required
                inputMode="numeric"
                maxLength={10}
                placeholder="00000-000"
                data-mascara="cep"
                data-cep
                data-cep-preenche="address"
                data-cep-cidade="city"
                data-cep-uf="state"
                data-cep-foco="number"
              />
              <Campo
                largura={2}
                rotulo="Endereço"
                name="address"
                type="text"
                required
                autocomplete="address-line1"
                maxLength={200}
                placeholder="Rua, avenida…"
              />
              <Campo
                largura={1}
                rotulo="Número"
                name="number"
                type="text"
                required
                inputMode="numeric"
                maxLength={20}
                placeholder="123"
              />
              <Campo
                largura={1}
                rotulo="Complemento (opcional)"
                name="complement"
                type="text"
                maxLength={120}
                placeholder="Apto, bloco…"
              />
              <Campo
                largura={1}
                rotulo="Cidade"
                name="city"
                type="text"
                required
                autocomplete="address-level2"
                maxLength={120}
                placeholder="Sua cidade"
              />
              <label class="ckout__campo ckout__campo--1">
                <span>Estado</span>
                <select name="state" required>
                  <option value="">UF</option>
                  {ESTADOS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </label>
            </Passo>

            <Passo
              numero={3}
              titulo="Como prefere pagar?"
              grade={false}
              dica="Hoje a confirmação é manual: depois de escolher, você finaliza no WhatsApp e nosso time ativa seu plano."
              rodape={<Controle modo="voltar" alvo={2} rotulo="Voltar" />}
            >
              <div class="ckout__pagamentos">
                {PAGAMENTOS.map((p) => (
                  <CartaoPagamento {...p} key={p.valor} />
                ))}
              </div>

              <div class="ckout__resumo">
                <span class="ckout__chapeu">Resumo do pedido</span>
                <dl class="ckout__resumo-linha">
                  <dt>Plano {plano.name}</dt>
                  <dd>{formatarPreco(plano.priceCents ?? 0)}/mês</dd>
                </dl>
                <dl class="ckout__resumo-linha">
                  <dt>Periodicidade</dt>
                  <dd>Mensal, sem fidelidade</dd>
                </dl>
                <p class="ckout__nota">
                  Sem cobrança automática por aqui por enquanto: o pagamento é
                  combinado com nosso time no WhatsApp.
                </p>
              </div>

              <button type="submit" class="ckout__enviar">
                Confirmar pedido
              </button>
              <p class="ckout__nota ckout__nota--lgpd">
                Usamos seus dados só para processar este pedido. Veja nossa{" "}
                <a href="/politicas#privacidade">Política de Privacidade</a>.
              </p>
            </Passo>
          </form>

          <aside class="ckout__lateral">
            <p class="ckout__chapeu">Seu plano</p>
            <h2 class="ckout__lateral-titulo">{plano.name}</h2>
            <p class="ckout__lateral-preco">
              <b>{formatarPreco(plano.priceCents ?? 0)}</b>
              <span>/ mês</span>
            </p>
            <p class="ckout__lateral-nota">{plano.note}</p>
            <ul class="ckout__lateral-lista">
              {plano.items.slice(0, 5).map((item) => (
                <li key={item.label}>
                  <svg viewBox="0 0 24 24">
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <p class="ckout__lateral-aviso">
              Migração grátis, SSL e backup diário em todos os planos. Sem
              fidelidade.
            </p>
          </aside>
        </div>
      </main>
    </Layout>
  );
});
