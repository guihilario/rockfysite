import type { FaqItem } from "@/data/faq.ts";

/**
 * As perguntas da página de loja digital.
 *
 * As do site tratam de migração, fidelidade e troca de plano — assuntos de
 * hospedagem. Quem chega aqui pergunta outra coisa, então a página traz a
 * sua própria lista em vez de reaproveitar a geral.
 */
export const faqLoja: FaqItem[] = [
  {
    q: "Quanto custa?",
    a: "A partir de R$47,90 por mês, com 7 dias grátis e sem cartão para testar. Não há taxa por pedido: o PIX do seu cliente cai direto na sua conta.",
  },
  {
    q: "Já uso iFood ou vendo pelas redes sociais",
    a: "Ótimo, e dá para manter. A loja digital vira o seu endereço próprio na internet, com link seu, sem depender de marketplace nem do alcance de uma rede social.",
  },
  {
    q: "Não sei mexer com tecnologia",
    a: "Se você sabe postar um story, sabe usar. Tudo é feito pelo celular, em poucos toques — e a gente configura a sua loja antes de você começar, sem custo.",
  },
  {
    q: "Meu negócio é pequeno demais",
    a: "É justamente onde mais faz diferença: quanto menor o movimento, mais cada venda importa. Você começa no menor plano e sobe quando o catálogo crescer.",
  },
];
