import type { Middleware } from "fresh";

/**
 * Endereços do site antigo que ainda têm valor de busca.
 *
 * Quando a URL de uma página muda, o endereço velho não deixa de existir
 * para o Google: ele continua no índice, nos links de terceiros e nos
 * favoritos de quem já visitou. Servir 404 ali joga fora o histórico
 * inteiro daquela página — foi o que estava acontecendo com a de Elementor,
 * que era a mais bem posicionada do site.
 *
 * A alternativa de manter os dois endereços vivos é pior: duas URLs com o
 * mesmo conteúdo dividem os sinais entre si e deixam o Google escolher qual
 * mostrar. Um endereço canônico e um 301 apontando para ele concentra tudo
 * num lugar só.
 *
 * O 301 é permanente e o navegador o guarda em cache de forma agressiva —
 * corrigir um destino errado depois é lento. Só entra aqui endereço que
 * existiu de fato e cujo destino está decidido.
 */
const LEGADO: Record<string, string> = {
  /* Todas conferidas no Wayback antes de escolher o destino: o slug sozinho
     engana. `/infra`, por exemplo, parecia página de infraestrutura e era a
     de "Sobre nós"; `/edu` prometia curso e era conteúdo educativo. */

  // "Criação de Sites com Elementor Pro" e "Crie Landing Pages com
  // Elementor Pro" — as duas vendiam o mesmo produto que a de Elementor.
  "/hospedagem-de-sites-com-elementor-pro": "/hospedagem-elementor-pro",
  "/criacao-de-site": "/hospedagem-elementor-pro",
  "/landing-page": "/hospedagem-elementor-pro",

  // "Hospedagem de Sites Otimizada no Brasil" e "Plugins e Recursos para
  // Wordpress" — ambas sobre o produto de WordPress.
  "/hospedagem-de-site": "/hospedagem-wordpress",
  "/plugins": "/hospedagem-wordpress",

  "/loja-online": "/loja-digital",

  // Título "Sobre Nós", h1 "Tecnologia de ponta, segura e performática".
  "/infra": "/sobre",

  // "Aprenda e Crie sites" / "Empoderamento através do conhecimento": era
  // conteúdo educativo, que hoje vive no blog. A /ajuda é suporte de
  // produto, outra intenção.
  "/edu": "/blog",
};

export function legado<S>(): Middleware<S> {
  return (ctx) => {
    const url = new URL(ctx.req.url);
    /* A barra final é a mesma página para o Google, mas rota diferente
       aqui: sem normalizar, metade dos links de fora continuaria em 404. */
    const caminho = url.pathname.length > 1
      ? url.pathname.replace(/\/+$/, "")
      : url.pathname;

    const destino = LEGADO[caminho];
    if (!destino) return ctx.next();

    /* A query string segue junto: é por ela que campanhas e origens de
       tráfego se identificam, e perdê-la no redirect estraga a medição. */
    const location = destino + url.search;
    return new Response(null, { status: 301, headers: { location } });
  };
}
