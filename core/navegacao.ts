/**
 * Para onde um CTA de planos deve levar.
 *
 * A `/planos` existe para ter uma URL própria disputando as buscas de
 * preço — não para ser o destino de todo botão. Onde a própria página já
 * mostra o trilho, o CTA rola até ele: tirar a pessoa da página que ela
 * está lendo para mostrar os mesmos preços é perder o contexto por nada.
 *
 * Nas páginas sem trilho (sobre, contato, políticas, blog, ajuda) a âncora
 * não teria destino e o clique não faria nada — ali o link continua sendo
 * a página.
 */
const COM_TRILHO = new Set([
  "/",
  "/v2",
  "/planos",
  "/deploy",
  "/loja-digital",
  "/hospedagem-wordpress",
  "/hospedagem-elementor-pro",
  "/email-profissional",
]);

export function alvoDosPlanos(rota: string | undefined): string {
  return rota && COM_TRILHO.has(rota) ? "#planos" : "/planos";
}
