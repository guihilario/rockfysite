import type { ComponentChildren } from "preact";
import { config } from "@/core/config.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { BotaoWhatsApp } from "@/components/BotaoWhatsApp.tsx";
import { Gtm, GtmNoScript } from "@/components/Gtm.tsx";
import { asset } from "fresh/runtime";
import {
  type Degrau,
  imagemDaRota,
  nomeDaRota,
  trilhaSchema,
} from "@/core/seo/meta.ts";
import { faq } from "@/data/faq.ts";

export const SITE = "https://rockfy.com";

type Props = {
  /** Caminho da página, ex.: "/deploy". Vira canonical e og:url, e marca
   *  o item correspondente no menu. */
  rota: string;
  /** Sobrescreve só a canonical e a og:url, mantendo `rota` para o menu e a
   *  trilha. Existe para a paginação: `/ajuda?page=2` precisa apontar a
   *  canonical para si mesma, senão se declara cópia de `/ajuda` e o
   *  buscador consolida as duas — deixando de usar a página 2 como caminho
   *  para os artigos que só aparecem nela. */
  canonica?: string;
  titulo: string;
  descricao: string;
  /** A FAQPage só entra numa página, para não competir consigo mesma no
   *  rich result. Ver o comentário em `routes/index.tsx`. */
  faqSchema?: boolean;
  /**
   * Estrutura fluida: a `.screen` deixa de limitar a largura e cada faixa
   * passa a ir de ponta a ponta, com um `.conteudo` interno segurando os
   * 1440px. Sem isso a página segue no modelo antigo, de container único.
   */
  fluido?: boolean;
  /** "article" nas páginas de post; o padrão serve para o resto. */
  tipoOg?: "website" | "article";
  /** Datas do artigo, em ISO. Saem como `article:published_time` e
   *  `article:modified_time` — o JSON-LD já as declara, mas há parser que só
   *  lê Open Graph, e é barato atender os dois. */
  publicadoEm?: string;
  atualizadoEm?: string;
  /** Imagem de compartilhamento. Nos posts, a capa do próprio artigo. */
  imagem?: string;
  /** Dados estruturados extras da página (trilha, artigo). */
  jsonLd?: unknown[];
  /** A página desenha o próprio cabeçalho — usado quando ele fica sobre a
   *  arte do topo, em vez de acima dela. */
  cabecalhoProprio?: boolean;
  /**
   * A forma do cabeçalho.
   *
   * `padrao` fica no fluxo, acima do conteúdo. `vidro` é transparente sobre
   * a arte do topo e ganha fundo desfocado ao rolar.
   */
  /** "fixo" é o padrão: cabeçalho preso ao topo que ganha vidro ao rolar.
   *  "vidro" é a variante da home, com as cores claras para assentar sobre a
   *  foto da hero. */
  cabecalho?: "padrao" | "vidro" | "fixo";
  /** Força `noindex` mesmo com o site liberado. Para páginas de teste. */
  naoIndexar?: boolean;
  /** Trilha de navegação. Vira BreadcrumbList — é o que troca a URL crua
   *  por "rockfy.com › Blog › Título" no resultado de busca. */
  trilha?: Degrau[];
  children: ComponentChildren;
};

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 1) }}
    />
  );
}

/** O esqueleto de toda página: <head> com SEO, cabeçalho, conteúdo e rodapé. */
export function Layout(
  {
    rota,
    canonica,
    titulo,
    descricao,
    faqSchema = false,
    fluido = false,
    tipoOg = "website",
    publicadoEm,
    atualizadoEm,
    imagem,
    jsonLd,
    trilha,
    cabecalhoProprio = false,
    cabecalho = "fixo",
    naoIndexar = false,
    children,
  }: Props,
) {
  const caminhoCanonico = canonica ?? rota;
  const url = SITE + (caminhoCanonico === "/" ? "/" : caminhoCanonico);
  const ogImagem = imagem ?? SITE + imagemDaRota(rota);
  /* Sem trilha explícita, monta a de um nível a partir do nome da rota. As
     páginas de post passam a sua, que tem três degraus. A home não tem
     trilha: ela é a raiz. */
  const degraus = trilha ??
    (rota !== "/" && nomeDaRota(rota)
      ? [{ nome: "Rockfy", url: "/" }, { nome: nomeDaRota(rota)!, url: rota }]
      : undefined);

  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={descricao} />
        <meta name="theme-color" content="#ffffff" />
        <title>{titulo}</title>

        <Gtm />
        <link rel="canonical" href={url} />
        {
          /* Deixa o llms.txt achável por agente: sem isto ele só é encontrado
            por quem já sabe que a convenção existe e chuta a URL. */
        }
        <link
          rel="alternate"
          type="text/markdown"
          href={`${SITE}/llms.txt`}
          title="Resumo do site em Markdown para agentes e LLMs"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {
          /* O SVG cobre os navegadores atuais; o PNG existe porque iOS ignora
            ícone vetorial ao salvar na tela de início. Ambos saem do mesmo
            arquivo — ver o comentário em static/icon.svg. */
        }
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {
          /* Enquanto o site roda no endereço temporário ele não pode ser
             indexado, senão o Google acha conteúdo duplicado antes de a
             migração terminar. `SEO_INDEXABLE=true` libera; a ausência da
             variável bloqueia — o esquecimento mantém o site fora do
             índice, e não o contrário. */
        }
        <meta
          name="robots"
          content={config.indexable && !naoIndexar
            ? "index,follow,max-image-preview:large"
            : "noindex,nofollow"}
        />

        <meta property="og:type" content={tipoOg} />
        {publicadoEm && (
          <meta property="article:published_time" content={publicadoEm} />
        )}
        {atualizadoEm && (
          <meta property="article:modified_time" content={atualizadoEm} />
        )}
        <meta property="og:site_name" content="Rockfy" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={titulo} />
        <meta property="og:description" content={descricao} />
        {
          /* A capa do post quando existe. O logo é SVG e a maioria das
             redes sociais ignora SVG em og:image — enquanto não houver um
             PNG de 1200×630 da marca, o post com capa é o único que gera
             prévia de verdade. */
        }
        <meta property="og:image" content={ogImagem} />
        <meta property="og:image:alt" content={titulo} />
        {
          /* As dimensões evitam que a rede social tenha que baixar a imagem
            para descobrir o formato antes de montar a prévia. */
        }
        {!imagem && <meta property="og:image:width" content="1200" />}
        {!imagem && <meta property="og:image:height" content="630" />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titulo} />
        <meta name="twitter:description" content={descricao} />
        <meta name="twitter:image" content={ogImagem} />

        {
          /* A fonte é servida pelo próprio domínio (ver @font-face no topo do
            styles.css). O preload evita o salto de texto: sem ele o navegador
            só descobre o arquivo depois de baixar e interpretar o CSS. */
        }
        <link
          rel="preload"
          href={asset("/fonts/instrument-sans-latin.woff2")}
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        {
          /* Com `asset()` o arquivo ganha o hash da build e passa a ser
             servido com cache imutável. Sem ele vinha `no-store`, e os
             95 KB de CSS+JS eram rebaixados a cada navegação. */
        }
        <link rel="stylesheet" href={asset("/styles.css")} />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Rockfy",
            url: SITE,
            logo: `${SITE}/img/rockfy-logo.svg`,
            description:
              "Hospedagem, deploy e gestão de projetos digitais em um só painel.",
            areaServed: { "@type": "Country", name: "Brasil" },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              availableLanguage: ["Portuguese"],
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "08:00",
                closes: "22:00",
              },
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Rockfy",
            url: SITE,
            inLanguage: "pt-BR",
          }}
        />
        {degraus && <JsonLd data={trilhaSchema(degraus)} />}
        {jsonLd?.map((d, i) => <JsonLd key={i} data={d} />)}
        {faqSchema && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }}
          />
        )}
      </head>
      <body>
        <div
          class={[
            "screen",
            fluido && "screen--fluido",
            (cabecalhoProprio || cabecalho !== "padrao") &&
            "screen--colado",
            cabecalho === "fixo" && "screen--sob-fixo",
          ].filter(Boolean).join(" ")}
          id="site-content"
        >
          <GtmNoScript />
          {!cabecalhoProprio && <Header atual={rota} forma={cabecalho} />}
          <main id="main-content">{children}</main>
          <Footer />
          <BotaoWhatsApp />
        </div>
        <script src={asset("/scripts.js")} defer></script>
      </body>
    </html>
  );
}
