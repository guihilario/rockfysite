/** Depoimentos de clientes.
 *
 * Vinham de `innerHTML` no cliente; agora o servidor entrega os slides
 * prontos e o JS só cuida do movimento do carrossel.
 *
 * O texto é o que cada pessoa escreveu — não foi reescrito nem "melhorado".
 * Depoimento é declaração de terceiro: ajustar a redação muda o que alguém
 * afirmou tendo nome e rosto na página.
 *
 * `role` é opcional porque nem todo mundo informou cargo. Quando falta, a
 * linha some — melhor do que inventar uma ocupação.
 */
export type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  /** Retrato em static/img/depoimentos/. */
  foto: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ariel Monteoliva",
    role: "Designer",
    quote:
      "Atendimento ótimo, além de sempre executar tudo com agilidade e excelência. Muita qualidade em cada detalhe dos processos!",
    foto: "/img/depoimentos/ariel.webp",
  },
  {
    name: "José Rosan",
    role: "Advogado",
    quote:
      "Trabalhamos juntos desde 2017 sempre de forma muito satisfatória e eficiente.",
    foto: "/img/depoimentos/jose.webp",
  },
  {
    name: "Marcelo Celo",
    role: "Gestor de Tráfego",
    quote:
      "Atendimento super humanizado, hospedagem muito rápido, podem confiar.",
    foto: "/img/depoimentos/marcelo.webp",
  },
  {
    name: "Edson Rodrigues",
    role: "Engenheiro · Promei",
    quote:
      "Qualidade, preço justo, e o suporte é bem próximo. Só tenho a agradecer por estarem ajudando a escalar o meu negócio!",
    foto: "/img/depoimentos/edson.webp",
  },
  {
    name: "Kyono",
    quote:
      "A velocidade do meu site ficou outra coisa! Muito boa e ainda vem com recursos que uso no meu dia a dia. Vale muito a pena.",
    foto: "/img/depoimentos/kyono.webp",
  },
  {
    name: "Paulo Henrique",
    role: "Investidor",
    quote:
      "Pessoal atenciosos, me ajudam muito com meus sites. Sempre indico para meus contatos.",
    foto: "/img/depoimentos/paulo.webp",
  },
  {
    name: "Guilherme",
    quote:
      "Suporte e design de primeiríssima qualidade. Agregou valor à minha marca e me faz chegar com excelência até meu cliente. Vale cada investimento.",
    foto: "/img/depoimentos/guilherme.webp",
  },
];
