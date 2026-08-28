/** Depoimentos.
 *
 * Também vinham de `innerHTML` no cliente. Agora o servidor entrega os
 * slides prontos e o JS só cuida do movimento do carrossel.
 */
export type Testimonial = { name: string; role: string; quote: string };

export const testimonials: Testimonial[] = [
  {
    name: "Ariel Monteoliva",
    role: "Designer · Calavera",
    quote:
      "Trocamos três dias de estúdio por uma tarde. O catálogo inteiro saiu com a mesma luz.",
  },
  {
    name: "Kyono Andre",
    role: "Fotográfo · Liv Produtora",
    quote:
      "Subimos 240 peças e recebemos as campanhas prontas. A taxa de clique subiu 18%.",
  },
  {
    name: "Guilherme Lacerda",
    role: "Empresário · Soma Impressões",
    quote:
      "Uso para testar direção antes de fotografar. Chego ao set já sabendo o que quero.",
  },
  {
    name: "José Rosan",
    role: "Advogado · Rosan Empresarial",
    quote:
      "O que era orçamento de produção virou orçamento de mídia. Mudou nossa conta.",
  },
  {
    name: "Marcelo Celo",
    role: "Gestor de Tráego · reobot Digital",
    quote:
      "Nenhum modelo remarcado, nenhuma diária perdida. A coleção nova sai no mesmo dia.",
  },
];
