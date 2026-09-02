import type { ComponentChildren } from "preact";
import { config } from "@/core/config.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
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
  /** Imagem de compartilhamento. Nos posts, a capa do próprio artigo. */
  imagem?: string;
  /** Dados estruturados extras da página (trilha, artigo). */
  jsonLd?: unknown[];
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
    titulo,
    descricao,
    faqSchema = false,
    fluido = false,
    tipoOg = "website",
    imagem,
    jsonLd,
    trilha,
    children,
  }: Props,
) {
  const url = SITE + (rota === "/" ? "/" : rota);
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

        <link rel="canonical" href={url} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {
          /* Enquanto o site roda no endereço temporário ele não pode ser
             indexado, senão o Google acha conteúdo duplicado antes de a
             migração terminar. `SEO_INDEXABLE=true` libera; a ausência da
             variável bloqueia — o esquecimento mantém o site fora do
             índice, e não o contrário. */
        }
        <meta
          name="robots"
          content={config.indexable
            ? "index,follow,max-image-preview:large"
            : "noindex,nofollow"}
        />

        <meta property="og:type" content={tipoOg} />
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
          class={fluido ? "screen screen--fluido" : "screen"}
          id="site-content"
        >
          <Header atual={rota} />
          <main id="main-content">{children}</main>
          <Footer />
        </div>
        <script src={asset("/scripts.js")} defer></script>
      </body>
    </html>
  );
}
