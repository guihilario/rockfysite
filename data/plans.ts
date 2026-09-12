/** Os planos do site — a tabela única das páginas de hospedagem.
 *
 * Ficavam dentro do `scripts.js` e eram injetados por `innerHTML`, então
 * preço, nome e itens não existiam no HTML servido — invisíveis para
 * buscadores e para IAs. Agora são dados, e a página renderiza no servidor.
 *
 * Por um tempo cada produto teve a sua própria tabela (`planosWordpress`,
 * `planosEmail`, `planosDeploy`), com nome, preço e régua diferentes. Quem
 * visitava duas páginas via duas ofertas e precisava descobrir sozinho como
 * uma se relacionava com a outra. Voltou a ser uma tabela só: os mesmos
 * quatro planos em todo lugar, e cada página muda apenas a chamada acima do
 * trilho.
 *
 * A loja digital é a exceção, e de propósito. Ela cobra por catálogo e
 * usuário, não por conta e domínio, e tem entrada mais barata que o Start:
 * embutir isso aqui obrigaria quem só quer vender no WhatsApp a comprar
 * hospedagem junto. Os planos dela vivem em `planosLoja.ts`.
 *
 * Nenhum item traz quantidade. cPanel, caixa de e-mail e aplicação de
 * Deploy já foram numerados aqui; contar empurra o cliente a economizar o
 * que a gente quer que ele use, e o número certo muda de caso para caso.
 * Quantidade virou conversa comercial, não linha de card.
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
  /** O que vem depois do preço. `null` some com a linha — usado no plano
   *  sob consulta, onde "/ mês" não faria sentido. */
  period?: string | null;
  /** O plano com contorno em destaque no trilho. */
  featured?: boolean;
  note: string;
  items: PlanItem[];
  /** O rótulo do botão. O padrão serve para os planos de hospedagem. */
  cta?: string;
};

/* Repetidos nos quatro cards: escritos uma vez para que mudar o texto não
   dependa de acertar quatro cópias iguais. Cada linha de produto sai daqui
   como um par rótulo/dica, porque separá-los deixava a dica desatualizada
   quando o rótulo mudava. */
const CPANEL = {
  label: "Recursos isolados cPanel",
  hint: "Conta cPanel com memória e recursos isolados só para o seu projeto.",
};
const SITE_ONE = {
  label: "siteOne [Sites HTML&JS]",
  hint:
    "Publique seus sites criados por IA com 1 clique e domínio personalizado.",
};
const MY_DOCKER = {
  label: "myDocker",
  hint: "Container isolado para suas aplicações em Cloud no Brasil.",
};
const DEPLOY = {
  label: "Deploy de Apps",
  hint: "Hospede aplicativos na nuvem com alta performance.",
};
const GESTAO = {
  label: "Gestão & Finanças",
  hint:
    "Automatize faturas, gerencie os clientes, sites e aplicações em um só lugar",
};

export const plans: Plan[] = [
  {
    tag: "Para começar hoje",
    name: "Start",
    price: "R$37",
    note:
      "Pra quem está começando. Perfeito para seu projeto ou negócio pessoal",
    items: [
      { n: null, ...CPANEL },
      { n: null, label: "1 Domínio" },
      { n: null, label: "Emails Profissionais" },
      { n: null, ...SITE_ONE },
      { n: null, ...DEPLOY, on: false },
      { n: null, ...GESTAO, on: false },
    ],
  },
  {
    tag: "Para negócios em crescimento",
    name: "Pro",
    price: "R$77",
    note:
      "Tudo o que você precisa para criar e expandir seu negócio sem se preocupar com infraestrutura.",
    items: [
      { n: null, ...CPANEL },
      { n: null, label: "Domínios Ilimitados" },
      { n: null, label: "Emails Profissionais" },
      { n: null, ...SITE_ONE },
      { n: null, ...DEPLOY, on: true },
      { n: null, ...GESTAO, on: true },
    ],
  },
  {
    tag: "Para agências e estúdios",
    name: "Studio",
    price: "R$157",
    featured: true,
    note: "Cobrado mensalmente, sem fidelidade. Cancele quando quiser.",
    items: [
      { n: null, ...CPANEL },
      { n: null, label: "Domínios Ilimitados" },
      { n: null, label: "Emails Profissionais" },
      { n: null, ...SITE_ONE },
      { n: null, ...DEPLOY, on: true },
      { n: null, ...GESTAO, on: true },
    ],
  },
  {
    tag: "Para operações dedicadas",
    name: "Scale",
    price: "R$297",
    note: "Cobrado mensalmente, sem fidelidade. Cancele quando quiser.",
    items: [
      { n: null, ...CPANEL },
      { n: null, label: "Domínios Ilimitados" },
      { n: null, label: "Emails Profissionais" },
      { n: null, ...SITE_ONE },
      { n: null, ...DEPLOY, on: true },
      { n: null, ...MY_DOCKER },
      { n: null, ...GESTAO, on: true },
    ],
  },
];
