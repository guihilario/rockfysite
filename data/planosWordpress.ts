import type { Plan } from "@/data/plans.ts";

/**
 * Planos do Rockfy WordPress (spec §6).
 *
 * /hospedagem-wordpress e /hospedagem-elementor-pro vendem o mesmo produto
 * com os mesmos valores — muda só a narrativa de aquisição. Por isso a tabela
 * é uma só, e o destaque é aplicado por página: Pro no WordPress, Studio no
 * Elementor. `comDestaque` evita duplicar a tabela inteira só para trocar
 * qual card ganha o contorno.
 *
 * Sem Deploy e sem caixas de e-mail nos cards: o spec proíbe incluir produto
 * de uma linha no plano de outra. E-mail é oferecido como adicional, fora
 * do card.
 */
const base: Plan[] = [
  {
    tag: "Para o primeiro site",
    name: "Essencial",
    price: "R$37",
    note:
      "Pra quem tem um site e quer ele isolado, com Elementor original incluso.",
    items: [
      { n: "[1]", label: "Conta cPanel isolada" },
      { n: "[1]", label: "Site principal" },
      { n: null, label: "Elementor Pro oficial" },
      { n: "[1]", label: "Migração gratuita" },
      { n: null, label: "SSL incluso" },
      { n: null, label: "Backup diário por 30 dias" },
      { n: null, label: "Servidor em São Paulo" },
    ],
    cta: "Hospedar meu site",
  },
  {
    tag: "Para quem atende clientes",
    name: "Pro",
    price: "R$77",
    note:
      "Pra quem cuida de alguns sites e precisa separar um cliente do outro.",
    items: [
      { n: "[3]", label: "Contas cPanel isoladas" },
      { n: "[3]", label: "Sites principais" },
      { n: null, label: "Elementor Pro oficial" },
      { n: "[3]", label: "Migrações gratuitas" },
      { n: null, label: "Organização por cliente" },
      { n: null, label: "SSL incluso" },
      { n: null, label: "Backup diário por 30 dias" },
    ],
    cta: "Hospedar meus sites",
  },
  {
    tag: "Para estúdios",
    name: "Studio",
    price: "R$157",
    note:
      "Pra estúdio com carteira formada, que precisa de suporte que responde antes.",
    items: [
      { n: "[8]", label: "Contas cPanel isoladas" },
      { n: "[8]", label: "Sites principais" },
      { n: null, label: "Elementor Pro oficial" },
      { n: "[8]", label: "Migrações gratuitas" },
      { n: null, label: "Organização por cliente" },
      { n: null, label: "Backup diário por 30 dias" },
      { n: null, label: "Suporte prioritário" },
    ],
    cta: "Montar meu estúdio",
  },
  {
    tag: "Para agências",
    name: "Agency",
    price: "R$297",
    note:
      "Pra agência que hospeda a carteira inteira e cobra recorrente do cliente.",
    items: [
      { n: "[15]", label: "Contas cPanel isoladas" },
      { n: "[15]", label: "Sites principais" },
      { n: null, label: "Elementor Pro oficial" },
      { n: "[15]", label: "Migrações gratuitas" },
      { n: null, label: "Organização por cliente" },
      { n: null, label: "Backup diário por 30 dias" },
      { n: null, label: "Suporte prioritário" },
    ],
    cta: "Falar sobre Agency",
  },
];

/** Devolve a tabela com o contorno de destaque no plano indicado. */
function comDestaque(nome: string): Plan[] {
  return base.map((p) => ({ ...p, featured: p.name === nome }));
}

export const planosWordpress = comDestaque("Pro");
export const planosElementor = comDestaque("Studio");
