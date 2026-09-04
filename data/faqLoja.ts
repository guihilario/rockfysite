import type { FaqItem } from "@/data/faq.ts";

/**
 * Perguntas da página de loja digital.
 *
 * Compilado a partir do que a Tiker — a plataforma por trás do produto —
 * documenta na home e nas páginas de segmento (hamburgueria, petshop,
 * roupas, celular, farmácia).
 *
 * O critério de seleção foi o que a nossa página NÃO mostra. Pedido no
 * WhatsApp, catálogo, PIX sem taxa e atualização pelo celular já estão nas
 * faixas acima; repeti-los aqui gastaria a atenção de quem rolou até o fim.
 * Ficaram as funcionalidades que só aparecem nesta lista — entrega por raio,
 * aplicativo próprio, PDV, usuários — e as objeções reais que a Tiker
 * responde nas páginas de segmento.
 */
export const faqLoja: FaqItem[] = [
  {
    q: "Quanto custa?",
    a: "A partir de R$47,90 por mês, com 7 dias grátis e sem cartão para testar. Não há taxa por pedido: o PIX do seu cliente cai direto na sua conta, sem intermediário.",
  },
  {
    q: "Preciso de CNPJ para começar?",
    a: "Não. Dá para abrir a loja e começar a vender sem CNPJ, e regularizar depois se o negócio crescer.",
  },
  {
    q: "Como funciona a entrega?",
    a: "Você define até onde entrega e quanto cobra por quilômetro. O raio e o preço são seus — útil para quem entrega no bairro ou trabalha com produto pesado, como ração ou bebida.",
  },
  {
    q: "Meus clientes precisam instalar alguma coisa?",
    a: "Não precisam, mas podem: a loja funciona por link, e quem quiser instala ela no próprio celular como um aplicativo, com o seu nome e a sua marca.",
  },
  {
    q: "Serve para quem vende serviço, e não só produto?",
    a: "Serve. Produtos e serviços entram no mesmo catálogo — assistência técnica, fórmulas manipuladas, orçamentos. O cliente monta o pedido e ele chega no WhatsApp para você conduzir o atendimento.",
  },
  {
    q: "Tenho muitos itens. Dá conta?",
    a: "Dá. O plano de entrada vai até 80 produtos, o intermediário até 280 e o Especial não tem limite. E cadastrar é rápido: você fotografa pelo celular e a nossa I.A escreve a descrição.",
  },
  {
    q: "Consigo vender no balcão também?",
    a: "Sim. Todos os planos incluem PDV — frente de caixa — e relatórios da loja, então a venda presencial e a digital ficam no mesmo lugar.",
  },
  {
    q: "Mais de uma pessoa pode mexer na loja?",
    a: "Pode. São até 5 usuários no plano de entrada, 10 no intermediário e sem limite no Especial, cada um com o próprio acesso.",
  },
  {
    q: "As pessoas vão me achar no Google?",
    a: "Sua loja tem endereço próprio na internet, e é isso que faz ela aparecer no Google e nas buscas feitas por inteligência artificial — diferente de um perfil de rede social, que vive dentro da plataforma dos outros.",
  },
  {
    q: "Já uso iFood ou vendo pelas redes sociais",
    a: "Ótimo, e dá para manter. A loja digital vira o seu canal próprio: link seu, cliente seu, sem comissão por pedido e sem depender do alcance de uma plataforma.",
  },
  {
    q: "Não sei mexer com tecnologia",
    a: "Se você sabe postar um story, sabe usar. Tudo é feito pelo celular, em poucos toques — e a gente configura a sua loja antes de você começar, com cores, logo e produtos de exemplo, sem custo.",
  },
  {
    q: "Meu negócio é pequeno demais",
    a: "É justamente onde mais faz diferença: quanto menor o movimento, mais cada venda importa, e cada taxa que você não paga fica no seu bolso. Começa no menor plano e sobe quando o catálogo crescer.",
  },
];
