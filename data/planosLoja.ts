import type { Plan } from "@/data/plans.ts";

/**
 * Os planos da loja digital.
 *
 * São outros planos, com outra régua: os de hospedagem cobram por conta e
 * domínio, estes cobram por quantidade de produtos e usuários. Por isso
 * moram num arquivo separado, e não como mais três itens em `plans.ts`.
 *
 * O período do "Especial" é `null` porque o preço é sob consulta — um
 * "/ mês" ali prometeria um valor que não existe.
 */
export const planosLoja: Plan[] = [
  {
    tag: "7 dias grátis, sem cartão",
    name: "Bora",
    price: "R$47,90",
    note: "Pra tirar a loja do papel e começar a receber pedido sem taxa.",
    items: [
      { n: "[80]", label: "Produtos no catálogo" },
      { n: null, label: "Catálogo digital" },
      { n: null, label: "PIX sem taxa por pedido" },
      { n: null, label: "Pedidos no WhatsApp" },
      { n: null, label: "PDV — frente de caixa" },
      { n: null, label: "Relatórios da sua loja" },
      { n: "[5]", label: "Usuários" },
      { n: null, label: "Suporte por WhatsApp" },
    ],
    cta: "Escolher Bora",
  },
  {
    tag: "7 dias grátis, sem cartão",
    name: "Top",
    price: "R$87,90",
    featured: true,
    note: "Pra quem já vende e precisa de mais catálogo e mais gente junto.",
    items: [
      { n: "[280]", label: "Produtos no catálogo" },
      { n: null, label: "Tudo do plano Bora" },
      { n: "[10]", label: "Usuários" },
      { n: null, label: "Suporte prioritário" },
    ],
    cta: "Começar agora",
  },
  {
    tag: "7 dias grátis, sem cartão",
    name: "Especial",
    price: "Sob consulta",
    period: null,
    note: "Pra operação grande, com catálogo e equipe sem limite.",
    items: [
      { n: null, label: "Produtos ilimitados" },
      { n: null, label: "Tudo do plano Top" },
      { n: null, label: "Usuários ilimitados" },
      { n: null, label: "Atendimento dedicado" },
    ],
    cta: "Falar com a gente",
  },
];
