/**
 * O conteúdo dos menus suspensos do cabeçalho.
 *
 * Cada item aponta para uma página que existe de verdade — quando um
 * destino ainda não estiver pronto, é melhor deixá-lo fora daqui do que
 * publicar um link morto no menu principal.
 */
export type ItemMenu = {
  titulo: string;
  descricao: string;
  href: string;
  /** Nome do ícone em `Icone.tsx`. */
  icone: string;
};

export type Menu = {
  /** O rótulo que aparece no cabeçalho. */
  rotulo: string;
  /** Usado no `id` do painel e no `aria-controls` do botão. */
  chave: string;
  colunas: { titulo: string; itens: ItemMenu[] }[];
  /** A faixa do rodapé do painel — um destaque, não mais uma coluna. */
  rodape?: { titulo: string; descricao: string; href: string; cta: string };
};

export const menus: Menu[] = [
  {
    rotulo: "Produtos",
    chave: "produtos",
    colunas: [
      {
        titulo: "Hospedagem",
        itens: [
          {
            titulo: "Hospedagem de Site",
            descricao: "Elementor Pro original incluso e ativado na sua conta.",
            href: "/hospedagem-elementor-pro",
            icone: "site",
          },
          {
            titulo: "Hospedagem WordPress",
            descricao:
              "WordPress puro, conta isolada, sem trava de construtor.",
            href: "/hospedagem-wordpress",
            icone: "wordpress",
          },
        ],
      },
      {
        titulo: "Construir e vender",
        itens: [
          {
            titulo: "Deploy [I.A]",
            descricao: "Publique o app que você criou na I.A, sem servidor.",
            href: "/deploy",
            icone: "deploy",
          },
          {
            titulo: "Loja digital",
            descricao: "Pedido no WhatsApp e PIX direto na sua conta.",
            href: "/loja-digital",
            icone: "loja",
          },
          {
            titulo: "E-mail profissional",
            descricao: "seunome@suaempresa.com, com antispam e backup.",
            href: "/email-profissional",
            icone: "email",
          },
        ],
      },
    ],
    rodape: {
      titulo: "Não sabe por onde começar?",
      descricao: "A gente ajuda a escolher o plano certo para o seu caso.",
      href: "/planos",
      cta: "Ver planos",
    },
  },
  {
    rotulo: "Recursos",
    chave: "recursos",
    colunas: [
      {
        titulo: "Conteúdo",
        itens: [
          {
            titulo: "Blog",
            descricao: "O que aprendemos cuidando de infraestrutura.",
            href: "/blog",
            icone: "blog",
          },
          {
            titulo: "Central de ajuda",
            descricao: "Guias curtos para resolver sozinho, agora.",
            href: "/ajuda",
            icone: "ajuda",
          },
        ],
      },
    ],
  },
];
