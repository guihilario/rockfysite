import { define } from "@/utils.ts";
import { SITE } from "@/components/Layout.tsx";
import { menus } from "@/data/menu.ts";
import { listPublishedPostsForLlms } from "@/domain/posts.ts";
import { resumirParaMeta } from "@/core/seo/meta.ts";
import { site } from "@/data/site.ts";
import { plans } from "@/data/plans.ts";
import { planosLoja } from "@/data/planosLoja.ts";
import { faq } from "@/data/faq.ts";
import { faqLoja } from "@/data/faqLoja.ts";
import type { FaqItem } from "@/data/faq.ts";
import type { Plan } from "@/data/plans.ts";

/**
 * `/llms.txt` — o resumo do site em Markdown, para quem lê por máquina.
 *
 * A convenção (llmstxt.org) é um arquivo curto que diz o que o site é e
 * aponta para o conteúdo, sem o navegador ter que interpretar HTML, menu e
 * rodapé para descobrir. Serve para assistentes que respondem sobre a
 * Rockfy — hoje eles precisam adivinhar a partir da home.
 *
 * É gerado, não escrito à mão: produtos vêm do mesmo menu do cabeçalho,
 * preços vêm das mesmas tabelas que as páginas renderizam e artigos vêm do
 * banco. O arquivo não envelhece sozinho quando alguém publica um post,
 * renomeia um produto ou reajusta um plano.
 *
 * Duas correções que mudaram o alcance dele:
 *
 * 1. Listava 30 artigos por seção, reaproveitando a listagem paginada do
 *    site. Com 49 artigos na central de ajuda, 19 ficavam de fora — e a
 *    central de ajuda é justamente o que mais resolve dúvida de cliente.
 *
 * 2. Trazia só "a partir de R$37/mês". Um assistente perguntado "quanto
 *    custa o plano Pro da Rockfy?" não tinha como responder, e responder
 *    errado sobre preço é pior do que não responder. Agora a tabela inteira
 *    está aqui, hospedagem e loja, com o que cada faixa inclui.
 */
function bloco(titulo: string, linhas: string[]): string {
  return linhas.length ? `## ${titulo}\n\n${linhas.join("\n")}\n` : "";
}

/** Uma linha por plano: nome, preço, para quem é e o que inclui.
 *
 *  Só os itens marcados entram. `on: false` significa "existe no produto mas
 *  não nesta faixa" — listar assim viraria promessa quebrada na boca de um
 *  assistente que leu o arquivo. */
function linhaDoPlano(p: Plan): string {
  const periodo = p.period === null ? "" : (p.period ?? "/mês");
  const inclui = p.items
    .filter((i) => i.on !== false)
    .map((i) => (i.n ? `${i.n.replace(/[[\]]/g, "")} ${i.label}` : i.label))
    .join(", ");
  // O `note` vem de card e nem sempre termina em ponto; sem isto a frase
  // emenda com "Inclui" e o arquivo fica com cara de texto quebrado.
  const nota = /[.!?]$/.test(p.note.trim())
    ? p.note.trim()
    : `${p.note.trim()}.`;
  return `- **${p.name}** — ${p.price}${periodo} (${p.tag}): ${nota} Inclui: ${inclui}.`;
}

function perguntas(itens: readonly FaqItem[]): string[] {
  return itens.flatMap((f) => [`### ${f.q}`, "", f.a, ""]);
}

export const handler = define.handlers({
  async GET() {
    const posts = await listPublishedPostsForLlms();
    const daSecao = (secao: string) => posts.filter((p) => p.section === secao);

    const produtos = menus
      .flatMap((m) => m.colunas)
      .flatMap((c) => c.itens)
      .filter((i) => !["/blog", "/ajuda"].includes(i.href))
      .map((i) => `- [${i.titulo}](${SITE}${i.href}): ${i.descricao}`);

    const artigos = (secao: string) =>
      daSecao(secao).map((p) =>
        `- [${p.title}](${SITE}/${secao}/${p.slug})${
          p.excerpt ? `: ${resumirParaMeta(p.excerpt, 120)}` : ""
        }`
      );

    const ajuda = artigos("ajuda");
    const blog = artigos("blog");

    const texto = [
      `# ${site.nome}`,
      "",
      "> Nuvem para quem constrói na internet: hospedagem de sites e WordPress, deploy de aplicações, loja digital e e-mail profissional, num painel só.",
      "",
      `A ${site.nome} é marca da ${site.razaoSocial} (CNPJ ${site.cnpj}), com sede em ${site.cidade}. A infraestrutura é distribuída e cada produto roda onde entrega melhor desempenho. O contrato é regido pela lei brasileira, a nota fiscal é emitida em reais e o atendimento é em português.`,
      "",
      `Atendimento: WhatsApp ${site.whatsappRotulo} (${site.whatsapp}) e ${site.email}.`,
      "",
      bloco("Produtos", produtos),

      bloco("Planos de hospedagem", [
        "Cobrança mensal, sem fidelidade. Todos os planos incluem conta cPanel isolada, SSL, backup diário, Elementor Pro com licença oficial e migração feita pela equipe, sem custo.",
        "",
        ...plans.map(linhaDoPlano),
        "",
        `Página: ${SITE}/planos`,
      ]),

      bloco("Planos da loja digital", [
        "Cobrança separada da hospedagem, com 7 dias grátis e sem cartão. A régua é por catálogo e usuário, não por conta e domínio.",
        "",
        ...planosLoja.map(linhaDoPlano),
        "",
        `Página: ${SITE}/loja-digital`,
      ]),

      bloco("Perguntas frequentes", perguntas(faq)),
      bloco("Perguntas sobre a loja digital", perguntas(faqLoja)),

      bloco(`Central de ajuda (${ajuda.length} artigos)`, [
        `Índice: ${SITE}/ajuda`,
        "",
        ...ajuda,
      ]),

      bloco(`Blog (${blog.length} artigos)`, [
        `Índice: ${SITE}/blog`,
        "",
        ...blog,
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
