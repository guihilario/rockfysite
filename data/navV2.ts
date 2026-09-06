/**
 * Navegação da v2: quatro links diretos, sem mega menu.
 *
 * A home oficial usa `data/menu.ts`, com painéis suspensos e colunas. Aqui a
 * ideia é outra — o visitante vê os quatro produtos de uma vez e clica. Por
 * isso é uma lista própria, e não uma variação do menu grande: as duas
 * estruturas não têm nada em comum além do href.
 *
 * "CloudDeploy" é o nome comercial novo do produto; a rota segue /deploy para
 * não quebrar links já publicados.
 */
export type ItemNav = { titulo: string; href: string; icone: string };

export const navV2: ItemNav[] = [
  { titulo: "CloudDeploy", href: "/deploy", icone: "foguete" },
  {
    titulo: "Hospedagem de Site",
    href: "/hospedagem-wordpress",
    icone: "globo",
  },
  { titulo: "Loja digital", href: "/loja-digital", icone: "carrinho" },
  {
    titulo: "Email profissional",
    href: "/email-profissional",
    icone: "envelope",
  },
];
