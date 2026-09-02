import { define } from "@/utils.ts";
import { listPublishedPostsForSitemap } from "@/domain/posts.ts";
import { SITE } from "@/components/Layout.tsx";

const PAGINAS = [
  ["/", "1.0"],
  ["/planos", "0.9"],
  ["/deploy", "0.8"],
  ["/hospedagem-elementor-pro", "0.8"],
  ["/hospedagem-wordpress", "0.8"],
  ["/loja-digital", "0.8"],
  ["/email-profissional", "0.8"],
  ["/blog", "0.7"],
  ["/ajuda", "0.7"],
  ["/sobre", "0.6"],
  ["/contato", "0.6"],
  // Prioridade baixa: é página de consulta, não de entrada — mas precisa
  // estar aqui, porque buscador que não a encontra trata o site como se
  // não tivesse política de privacidade publicada.
  ["/politicas", "0.3"],
];

/** Sitemap gerado a cada requisição: as páginas fixas mais todo post
 *  publicado, com `lastmod` vindo do banco. */
export const handler = define.handlers({
  async GET() {
    const posts = await listPublishedPostsForSitemap();
    const maisRecente = posts
      .map((p) => p.updatedAt.toISOString().slice(0, 10))
      .sort()
      .at(-1) ?? new Date().toISOString().slice(0, 10);
    const urls = [
      /* As páginas fixas ganham como `lastmod` a data do post mais
         recente: todas exibem a faixa do blog, então mudam de conteúdo
         quando alguém publica. Sem `lastmod` o buscador não tem sinal
         nenhum de frescor — e `changefreq`/`priority`, que estavam aqui
         sozinhos, o Google declara ignorar. */
      ...PAGINAS.map(([loc, pri]) =>
        `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${maisRecente}</lastmod>\n    <priority>${pri}</priority>\n  </url>`
      ),
      ...posts.map((p) =>
        `  <url>\n    <loc>${SITE}${
          p.section === "ajuda" ? "/ajuda" : "/blog"
        }/${p.slug}</loc>\n    <lastmod>${
          p.updatedAt.toISOString().slice(0, 10)
        }</lastmod>\n    <priority>0.6</priority>\n  </url>`
      ),
    ];
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
        urls.join("\n")
      }\n</urlset>\n`,
      { headers: { "content-type": "application/xml; charset=utf-8" } },
    );
  },
});
