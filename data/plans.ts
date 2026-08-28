/** Os planos do site.
 *
 * Ficavam dentro do `scripts.js` e eram injetados por `innerHTML`, então
 * preço, nome e itens não existiam no HTML servido — invisíveis para
 * buscadores e para IAs. Agora são dados, e a página renderiza no servidor.
 */
export type PlanItem = {
  /** Quantidade entre colchetes, ex.: "[3]". `null` quando o item não tem número. */
  n: string | null;
  label: string;
  /** `false` risca o item: existe no plano, mas não está incluso. */
  on?: boolean;
  /** Texto do tooltip do "?" ao lado do item. */
  hint?: string;
};

export type Plan = {
  /** A linha pequena acima do nome, ex.: "Para agências e estúdios". */
  tag: string;
  name: string;
  price: string;
  /** O plano com contorno em destaque no trilho. */
  featured?: boolean;
  note: string;
  items: PlanItem[];
};

export const plans: Plan[] = [
  {
    tag: "Para começar hoje",
    name: "Start",
    price: "R$37",
    note:
      "Pra quem está começando. Perfeito para seu projeto ou negócio pessoal",
    items: [
      {
        n: "[1]",
        label: "Conta Isolada cPanel",
      },
      {
        n: null,
        label: "1 Domínio",
      },
      {
        n: null,
        label: "Elementor Pro Oficial",
      },
      {
        n: "[3]",
        label: "Emails Profissionais",
      },
      {
        n: "[1]",
        label: "Deploy de Apps & Sites",
      },
      {
        n: null,
        label: "Gestão & Finanças",
        on: false,
      },
    ],
  },
  {
    tag: "Para negócios em crescimento",
    name: "Pro",
    price: "R$77",
    note:
      "Tudo o que você precisa para criar e expandir seu negócio sem se preocupar com infraestrutura.",
    items: [
      {
        n: "[2]",
        label: "Contas Isoladas cPanel",
      },
      {
        n: null,
        label: "Domínios Ilimitados",
      },
      {
        n: null,
        label: "Elementor Pro Oficial",
      },
      {
        n: "[8]",
        label: "Emails Profissionais",
      },
      {
        n: "[2]",
        label: "Deploy de Apps & Sites",
      },
      {
        n: null,
        label: "Gestão & Finanças",
        on: false,
        hint: "Painel de receitas, despesas e cobrança recorrente.",
      },
    ],
  },
  {
    tag: "Para agências e estúdios",
    name: "Studio",
    price: "R$157",
    featured: true,
    note: "Cobrado mensalmente, sem fidelidade. Cancele quando quiser.",
    items: [
      {
        n: "[8]",
        label: "Contas Isoladas cPanel",
      },
      {
        n: null,
        label: "Domínios Ilimitados",
      },
      {
        n: null,
        label: "Elementor Pro Oficial",
      },
      {
        n: "[15]",
        label: "Emails Profissionais",
      },
      {
        n: "[4]",
        label: "Deploy de Apps & Sites",
      },
      {
        n: null,
        label: "Gestão & Finanças",
        on: true,
        hint: "Inclui repasse para clientes e relatórios por projeto.",
      },
    ],
  },
  {
    tag: "Para operações dedicadas",
    name: "Scale",
    price: "R$297",
    note: "Cobrado mensalmente, sem fidelidade. Cancele quando quiser.",
    items: [
      {
        n: "[15]",
        label: "Contas Isoladas cPanel",
      },
      {
        n: null,
        label: "Domínios Ilimitados",
      },
      {
        n: null,
        label: "Elementor Pro Oficial",
      },
      {
        n: "[25]",
        label: "Emails Profissionais",
      },
      {
        n: "[10]",
        label: "Deploy de Apps & Sites",
      },
      {
        n: null,
        label: "Gestão & Finanças",
        on: true,
        hint: "Multi-tenant, API aberta e suporte com SLA.",
      },
    ],
  },
];
