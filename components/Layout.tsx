import type { ComponentChildren } from "preact";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { asset } from "fresh/runtime";
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
  { rota, titulo, descricao, faqSchema = false, fluido = false, children }:
    Props,
) {
  const url = SITE + (rota === "/" ? "/" : rota);

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
        <meta name="robots" content="index,follow,max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rockfy" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={titulo} />
        <meta property="og:description" content={descricao} />
        <meta property="og:image" content={`${SITE}/img/rockfy-logo.svg`} />
        <meta property="og:image:alt" content="Rockfy" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titulo} />
        <meta name="twitter:description" content={descricao} />
        <meta name="twitter:image" content={`${SITE}/img/rockfy-logo.svg`} />

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
        <link rel="stylesheet" href="/styles.css" />

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
        <script src="/scripts.js" defer></script>
      </body>
    </html>
  );
}
