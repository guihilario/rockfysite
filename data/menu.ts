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

/** Links que não precisam de dropdown na navegação v2. */
export const linksTopo = [
  { titulo: "Preços", href: "/planos" },
  { titulo: "Sobre", href: "/sobre" },
];

export const menus: Menu[] = [
  {
    rotulo: "Produtos",
    chave: "produtos",
    colunas: [
      {
        titulo: "Crie e publique",
        itens: [
          {
            titulo: "siteOne",
            descricao: "Sites HTML e JavaScript no ar em um clique.",
            href: "/site-one",
            icone: "site",
          },
          {
            titulo: "CloudDeploy",
            descricao: "Publique o app que você criou com IA.",
            href: "/deploy",
            icone: "deploy",
          },
          {
            titulo: "myDocker",
            descricao: "Container isolado em cloud no Brasil.",
            href: "/my-docker",
            icone: "container",
          },
        ],
      },
      {
        titulo: "Seu negócio",
        itens: [
          {
            titulo: "Hospedagem de site",
            descricao: "Elementor Pro oficial incluso e ativado.",
            href: "/hospedagem-elementor-pro",
            icone: "wordpress",
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
        titulo: "Explore",
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
          {
            titulo: "Contato",
            descricao: "Fale com o time da Rockfy.",
            href: "/contato",
            icone: "email",
          },
        ],
      },
    ],
  },
];
