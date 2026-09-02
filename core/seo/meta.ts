import { SITE } from "@/components/Layout.tsx";
import type { Post } from "@/domain/posts.ts";
import { menus } from "@/data/menu.ts";

/**
 * Corta um texto no limite que os buscadores exibem.
 *
 * A meta description dos posts vinha do resumo inteiro, que tem mediana de
 * 235 caracteres e chega a 474: 49 dos 52 artigos apareciam truncados no
 * meio de uma palavra no resultado de busca. Cortar aqui é decisão de
 * metadado — o resumo continua inteiro no card e na página.
 *
 * O corte é na última fronteira de palavra antes do limite, com reticência,
 * para o trecho terminar como frase e não como pedaço.
 */
export function resumirParaMeta(texto: string, limite = 155): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite - 1);
  const espaco = corte.lastIndexOf(" ");
  return (espaco > limite * 0.6 ? corte.slice(0, espaco) : corte).replace(
    /[,;:.\s]+$/,
    "",
  ) + "…";
}

/**
 * O nome curto de uma rota, para a trilha.
 *
 * Os produtos já têm nome no menu suspenso; reusar de lá evita uma segunda
 * lista que envelhece sozinha. O resto é o punhado de páginas que não
 * aparece no menu.
 */
const FORA_DO_MENU: Record<string, string> = {
  "/planos": "Planos",
  "/sobre": "Sobre",
  "/contato": "Contato",
  "/politicas": "Políticas e termos",
};

export function nomeDaRota(rota: string): string | null {
  for (const menu of menus) {
    for (const col of menu.colunas) {
      for (const item of col.itens) {
        if (item.href === rota) return item.titulo;
      }
    }
  }
  return FORA_DO_MENU[rota] ?? null;
}

/**
 * A imagem de compartilhamento de cada rota.
 *
 * O padrão era o logo em SVG, e a maioria das redes sociais ignora SVG em
 * `og:image` — na prática nenhuma página fixa gerava prévia. Os cards são
 * PNGs de 1200×630 gerados a partir do CSS do próprio site
 * (`tools/og/gerar.js`), então acompanham a marca.
 */
const OG_POR_ROTA: Record<string, string> = {
  "/": "home",
  "/planos": "planos",
  "/deploy": "deploy",
  "/hospedagem-wordpress": "wordpress",
  "/hospedagem-elementor-pro": "elementor",
  "/loja-digital": "loja",
  "/email-profissional": "email",
  "/blog": "blog",
  "/ajuda": "ajuda",
  "/sobre": "sobre",
  "/contato": "contato",
  "/politicas": "politicas",
};

export function imagemDaRota(rota: string): string {
  const exata = OG_POR_ROTA[rota];
  if (exata) return `/og/${exata}.png`;
  // Post sem capa cai no card da seção a que pertence.
  if (rota.startsWith("/blog/")) return "/og/blog.png";
  if (rota.startsWith("/ajuda/")) return "/og/ajuda.png";
  return "/og/padrao.png";
}

/** Um degrau da trilha de navegação. */
export type Degrau = { nome: string; url: string };

/**
 * BreadcrumbList.
 *
 * O site não tinha nenhum. É o que faz o Google trocar a URL crua por
 * "rockfy.com › Blog › Título" no resultado — e ajuda a entender a
 * hierarquia entre seção e artigo, que hoje só existe na URL.
 */
export function trilhaSchema(degraus: Degrau[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: degraus.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.nome,
      item: d.url.startsWith("http") ? d.url : SITE + d.url,
    })),
  };
}

/**
 * BlogPosting de um artigo.
 *
 * Os 52 posts iam para o ar sem nenhuma marcação: sem autor, sem data, sem
 * imagem declarada. É a maior lacuna de dados estruturados do site — são
 * 83% das URLs indexáveis.
 */
export function artigoSchema(post: Post, base: string) {
  const url = `${SITE}${base}/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.slice(0, 110),
    description: post.excerpt ? resumirParaMeta(post.excerpt) : undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    articleSection: post.categoryName ?? undefined,
    keywords: post.tagNames?.length ? post.tagNames.join(", ") : undefined,
    inLanguage: "pt-BR",
    // Sem `author` pessoa: o site não publica assinatura em nenhum artigo, e
    // declarar um nome que não aparece na página é o tipo de dado que o
    // Google trata como inconsistente. A organização responde pelo texto.
    publisher: {
      "@type": "Organization",
      name: "Rockfy",
      url: SITE,
    },
  };
}

/**
 * `Product` com `AggregateOffer` para uma família de planos.
 *
 * A modelagem é deliberada. Marcar cada plano como um `Product` separado
 * faria a página declarar ser quatro produtos ao mesmo tempo; e repetir
 * essa marcação nas cinco páginas que exibem o trilho faria cada uma
 * declarar ser o produto. Aqui é um produto — a hospedagem — com as quatro
 * faixas de preço dentro, e a marcação vive só na página que é dona do
 * preço.
 *
 * Sobre expectativa: para serviço recorrente o Google raramente exibe
 * preço em rich result (isso é para produto de e-commerce). O ganho aqui é
 * de clareza de entidade e de faixa de preço, não de snippet garantido.
 */
export function planosSchema(
  { nome, descricao, url, planos }: {
    nome: string;
    descricao: string;
    url: string;
    planos: { name: string; price: string }[];
  },
) {
  /** "R$47,90" → "47.90". Devolve null no que não for valor (sob consulta). */
  const valor = (p: string): string | null => {
    const m = p.replace(/\s/g, "").match(/R\$([\d.]+),?(\d{2})?/);
    if (!m) return null;
    return `${m[1].replace(/\./g, "")}.${m[2] ?? "00"}`;
  };

  const ofertas = planos
    .map((p) => ({ nome: p.name, v: valor(p.price) }))
    .filter((o): o is { nome: string; v: string } => o.v !== null);
  if (ofertas.length === 0) return null;

  const numeros = ofertas.map((o) => Number(o.v));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nome,
    description: descricao,
    url: SITE + url,
    brand: { "@type": "Brand", name: "Rockfy" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: Math.min(...numeros).toFixed(2),
      highPrice: Math.max(...numeros).toFixed(2),
      offerCount: ofertas.length,
      offers: ofertas.map((o) => ({
        "@type": "Offer",
        name: o.nome,
        price: o.v,
        priceCurrency: "BRL",
        url: SITE + url,
        availability: "https://schema.org/InStock",
      })),
    },
  };
}

/**
 * `ItemList` de uma listagem de posts.
 *
 * Diz ao buscador que a página é uma coleção ordenada e quais URLs a
 * compõem, em vez de deixá-lo inferir isso dos links. Vale para /blog e
 * /ajuda, que sem isto eram só uma página com muitos links.
 */
export function listaSchema(
  { nome, url, itens }: {
    nome: string;
    url: string;
    itens: { title: string; slug: string }[];
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: nome,
    url: SITE + url,
    numberOfItems: itens.length,
    itemListElement: itens.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE}${url}/${p.slug}`,
    })),
  };
}
