import { define } from "@/utils.ts";
import { SITE } from "@/components/Layout.tsx";
import { menus } from "@/data/menu.ts";
import { listPublishedPostsOrNone } from "@/domain/posts.ts";
import { resumirParaMeta } from "@/core/seo/meta.ts";
import { site } from "@/data/site.ts";

/**
 * `/llms.txt` — o resumo do site em Markdown, para quem lê por máquina.
 *
 * A convenção (llmstxt.org) é um arquivo curto que diz o que o site é e
 * aponta para o conteúdo, sem o navegador ter que interpretar HTML, menu e
 * rodapé para descobrir. Serve para assistentes que respondem sobre a
 * Rockfy — hoje eles precisam adivinhar a partir da home.
 *
 * É gerado, não escrito à mão: os produtos vêm do mesmo menu que o
 * cabeçalho usa e os artigos vêm do banco, então o arquivo não envelhece
 * sozinho quando alguém publica um post ou renomeia um produto.
 */
function bloco(titulo: string, linhas: string[]): string {
  return linhas.length ? `## ${titulo}\n\n${linhas.join("\n")}\n` : "";
}

export const handler = define.handlers({
  async GET() {
    const [blog, ajuda] = await Promise.all([
      listPublishedPostsOrNone({ perPage: 30, section: "blog" }),
      listPublishedPostsOrNone({ perPage: 30, section: "ajuda" }),
    ]);

    const produtos = menus
      .flatMap((m) => m.colunas)
      .flatMap((c) => c.itens)
      .filter((i) => !["/blog", "/ajuda"].includes(i.href))
      .map((i) => `- [${i.titulo}](${SITE}${i.href}): ${i.descricao}`);

    const artigos = (secao: string, posts: typeof blog.posts) =>
      posts.map((p) =>
        `- [${p.title}](${SITE}/${secao}/${p.slug})${
          p.excerpt ? `: ${resumirParaMeta(p.excerpt, 120)}` : ""
        }`
      );

    const texto = [
      `# ${site.nome}`,
      "",
      "> Nuvem brasileira para quem constrói na internet: hospedagem de sites e WordPress, deploy de aplicações, loja digital e e-mail profissional, num painel só.",
      "",
      `A ${site.nome} é marca da ${site.razaoSocial} (CNPJ ${site.cnpj}), com sede em ${site.cidade}. Os servidores ficam em datacenter em São Paulo; o contrato é regido pela lei brasileira e a nota fiscal é emitida em reais. O atendimento é feito por pessoas, em português.`,
      "",
      bloco("Produtos", produtos),
      bloco("Blog", artigos("blog", blog.posts)),
      bloco("Central de ajuda", artigos("ajuda", ajuda.posts)),
      bloco("Planos e preços", [
        `- [Planos de hospedagem](${SITE}/planos): quatro faixas a partir de R$37/mês, com conta isolada, servidor em São Paulo, SSL, backup diário e migração grátis.`,
      ]),
      bloco("Institucional", [
        `- [Sobre a ${site.nome}](${SITE}/sobre): história, valores, equipe e dados da empresa.`,
        `- [Contato](${SITE}/contato): canais de atendimento e endereço.`,
        `- [Políticas e termos](${SITE}/politicas): Política de Privacidade (LGPD) e Termos de Uso e Prestação de Serviços.`,
      ]),
    ].join("\n");

    return new Response(texto, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        // O conteúdo muda quando um post é publicado; cinco minutos evita
        // gerar o arquivo a cada visita sem deixá-lo velho de verdade.
        "cache-control": "public, max-age=300",
      },
    });
  },
});
