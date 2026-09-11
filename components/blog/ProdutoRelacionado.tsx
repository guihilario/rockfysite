import { menus } from "@/data/menu.ts";

/**
 * O bloco de produto no fim de um artigo.
 *
 * Por que existe: a central de ajuda é 49 dos 64 endereços do site e não
 * linkava para nenhuma página de produto — só para `/ajuda` e `/contato`.
 * Três quartos do site não passavam sinal nenhum para o que a Rockfy vende,
 * e link de menu, que se repete em toda página, pesa muito menos para
 * buscador do que link dentro do conteúdo.
 *
 * O outro lado, que importa tanto quanto: quem chega no artigo "como criar
 * conta de e-mail no cPanel" vindo de uma busca **ainda não é cliente**. Ele
 * resolvia o problema e ia embora sem descobrir que a Rockfy vende e-mail
 * profissional.
 *
 * A escolha é pela CATEGORIA do artigo, não por palavra-chave no texto.
 * Casar por palavra erra em artigo que cita duas tecnologias; a categoria já
 * é uma decisão editorial tomada por quem escreveu.
 */
type Alvo = { href: string; chamada: string };

/** Categoria do artigo -> produto que ela puxa.
 *
 *  `cpanel`, `dominios` e a categoria genérica `ajuda` apontam para os planos:
 *  quem lê sobre a conta em si está a um passo de precisar de mais conta, e
 *  `/planos` é onde isso se resolve. */
const POR_CATEGORIA: Record<string, Alvo> = {
  wordpress: {
    href: "/hospedagem-wordpress",
    chamada:
      "WordPress puro, sem construtor travado nem tema fechado, numa conta isolada — e a gente migra o seu site sem custo.",
  },
  elementor: {
    href: "/hospedagem-elementor-pro",
    chamada:
      "A licença oficial do Elementor Pro já vem ativada na sua conta. Você não compra à parte nem renova em dólar.",
  },
  email: {
    href: "/email-profissional",
    chamada:
      "E-mail com o seu domínio, sem cobrança por caixa, com antispam e backup.",
  },
  cpanel: {
    href: "/planos",
    chamada:
      "Conta cPanel isolada, SSL, backup diário e migração feita pelo nosso time. A partir de R$37 por mês, sem fidelidade.",
  },
  dominios: {
    href: "/planos",
    chamada:
      "Domínios ilimitados a partir do plano Pro, com DNS no mesmo painel do site.",
  },
  ajuda: {
    href: "/planos",
    chamada:
      "Conta isolada, SSL, backup diário e migração por nossa conta. Sem fidelidade.",
  },
};

/** Título e descrição saem do mesmo menu do cabeçalho: renomear um produto
 *  num lugar só continua valendo aqui. */
function doMenu(href: string) {
  for (const menu of menus) {
    for (const coluna of menu.colunas) {
      const item = coluna.itens.find((i) => i.href === href);
      if (item) return { titulo: item.titulo, descricao: item.descricao };
    }
  }
  return null;
}

export function ProdutoRelacionado(
  { categoriaSlug }: { categoriaSlug: string | null },
) {
  if (!categoriaSlug) return null;
  const alvo = POR_CATEGORIA[categoriaSlug];
  if (!alvo) return null;

  const doCabecalho = doMenu(alvo.href);
  const titulo = doCabecalho?.titulo ?? "Planos de hospedagem";

  return (
    <aside class="produtoRel" aria-labelledby="produtoRel-t">
      <p class="produtoRel__chapeu">Da Rockfy</p>
      <h2 class="produtoRel__titulo" id="produtoRel-t">{titulo}</h2>
      <p class="produtoRel__texto">{alvo.chamada}</p>
      <a class="produtoRel__cta" href={alvo.href}>
        Conhecer {titulo.toLowerCase()}
      </a>
    </aside>
  );
}
