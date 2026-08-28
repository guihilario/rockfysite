import { define } from "@/utils.ts";
import { config } from "@/core/config.ts";
import { SITE } from "@/components/Layout.tsx";

/**
 * O robots.txt era um arquivo estático que liberava tudo, mesmo enquanto o
 * site roda num endereço temporário. Virou rota para obedecer ao
 * `SEO_INDEXABLE`: sem a variável, o site pede para não ser rastreado.
 *
 * O bloqueio aqui é o par do `<meta name="robots">` do Layout. Os dois são
 * necessários e fazem coisas diferentes: o robots.txt impede o rastreio, a
 * meta impede a indexação de uma URL que o Google tenha descoberto por um
 * link de fora — que o robots.txt sozinho não cobre.
 */
const LIBERADO = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth

Sitemap: ${SITE}/sitemap.xml
`;

const BLOQUEADO = `User-agent: *
Disallow: /
`;

export const handler = define.handlers({
  GET() {
    return new Response(config.indexable ? LIBERADO : BLOQUEADO, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        // Curto de propósito: quando o site for liberado, o arquivo muda e
        // não pode ficar preso em cache de crawler por um dia.
        "cache-control": "public, max-age=300",
      },
    });
  },
});
