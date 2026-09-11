import { define } from "@/utils.ts";
import { listPublishedPostsForSitemap } from "@/domain/posts.ts";
import { SITE } from "@/components/Layout.tsx";

/** As páginas fixas. O terceiro campo diz se a página exibe a faixa do blog
 *  — ou seja, se o conteúdo dela muda quando alguém publica um post.
 *
 *  Isso decide quem recebe `lastmod`. Antes todas recebiam a data do post
 *  mais recente, inclusive `/contato` e `/politicas`, que não têm a faixa e
 *  portanto não mudaram coisa nenhuma. `lastmod` impreciso é pior que
 *  ausente: o Google declara que passa a ignorar o campo no site inteiro
 *  quando percebe que ele não corresponde à mudança real. */
const PAGINAS: [caminho: string, prioridade: string, mudaComPost: boolean][] = [
  ["/", "1.0", true],
  ["/planos", "0.9", true],
  ["/deploy", "0.8", true],
  ["/hospedagem-elementor-pro", "0.8", true],
  ["/hospedagem-wordpress", "0.8", true],
  ["/loja-digital", "0.8", true],
  ["/email-profissional", "0.8", true],
  ["/blog", "0.7", true],
  ["/ajuda", "0.7", true],
  ["/sobre", "0.6", true],
  ["/contato", "0.6", false],
  // Prioridade baixa: é página de consulta, não de entrada — mas precisa
  // estar aqui, porque buscador que não a encontra trata o site como se
  // não tivesse política de privacidade publicada.
  ["/politicas", "0.3", false],
];

/** Escapa o que vai dentro de um nó XML. O título do post é texto livre de
 *  editor: um `&` ou aspas ali quebram o documento inteiro, e um sitemap
 *  malformado é descartado pelo buscador sem aviso. */
function xml(t: string): string {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sitemap gerado a cada requisição: as páginas fixas mais todo post
 *  publicado, com `lastmod` vindo do banco.
 *
 *  Os posts declaram a capa pela extensão `image` do protocolo. É o que diz
 *  ao buscador que aquela imagem pertence àquela página — sem isso ele
 *  precisa inferir pelo HTML, e imagem servida de outro domínio (as capas
 *  vêm do R2) é justamente o caso em que ele infere pior. */
export const handler = define.handlers({
  async GET() {
    const posts = await listPublishedPostsForSitemap();
    const maisRecente = posts
      .map((p) => p.updatedAt.toISOString().slice(0, 10))
      .sort()
      .at(-1) ?? new Date().toISOString().slice(0, 10);
    const urls = [
      /* As páginas que exibem a faixa do blog ganham como `lastmod` a data
         do post mais recente: elas mudam de conteúdo quando alguém publica.
         As que não exibem saem sem `lastmod` — ver o comentário em PAGINAS.
         `changefreq`/`priority` o Google declara ignorar; ficam porque
         outros buscadores ainda leem. */
      ...PAGINAS.map(([loc, pri, mudaComPost]) => {
        const lastmod = mudaComPost ? `\n    <lastmod>${maisRecente}</lastmod>` : "";
        return `  <url>\n    <loc>${SITE}${loc}</loc>${lastmod}\n    <priority>${pri}</priority>\n  </url>`;
      }),
      ...posts.map((p) => {
        const loc = `${SITE}${
          p.section === "ajuda" ? "/ajuda" : "/blog"
        }/${p.slug}`;
        const capa = p.coverImageUrl
          ? `\n    <image:image>\n      <image:loc>${
            xml(p.coverImageUrl)
          }</image:loc>\n      <image:title>${
            xml(p.title)
          }</image:title>\n    </image:image>`
          : "";
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${
          p.updatedAt.toISOString().slice(0, 10)
        }</lastmod>\n    <priority>0.6</priority>${capa}\n  </url>`;
      }),
    ];
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${
        urls.join("\n")
      }\n</urlset>\n`,
      { headers: { "content-type": "application/xml; charset=utf-8" } },
    );
  },
});
