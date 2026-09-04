import type { FaqItem } from "@/data/faq.ts";

/**
 * Perguntas da página de Deploy.
 *
 * A FAQ geral do site trata de migração, fidelidade e troca de plano —
 * assuntos de hospedagem. Quem chega aqui pergunta outra coisa, e ler sobre
 * migração de WordPress numa página de deploy é ruído.
 *
 * Cada resposta se apoia em algo que a página já promete. As perguntas
 * sobre limites e preço ficaram de fora até alguém confirmar os números.
 *
 * Não há pergunta sobre onde a aplicação roda: a hospedagem fica em São
 * Paulo, o deploy não, e levantar isso numa FAQ criaria uma objeção que o
 * visitante não trouxe. O cuidado que sobra é não AFIRMAR o contrário — por
 * isso nenhum texto do produto promete servidor no Brasil.
 */
export const faqDeploy: FaqItem[] = [
  {
    q: "O que dá para publicar?",
    a: "Páginas em HTML e aplicações feitas com React, Next.js, Vite ou Astro. Você conecta o repositório ou envia o projeto, e a gente identifica como ele precisa ser construído.",
  },
  {
    q: "Preciso configurar servidor, YAML ou pipeline?",
    a: "Não. A detecção do build é nossa: sem arquivo de configuração, sem YAML e sem DevOps do seu lado. Se o projeto roda na sua máquina, a gente cuida do resto.",
  },
  {
    q: "Posso usar o meu próprio domínio?",
    a: "Sim. O projeto sobe com endereço definitivo e certificado SSL configurado, sem etapa manual — não é um link temporário que expira.",
  },
  {
    q: "Preciso de cartão internacional?",
    a: "Não. A cobrança é em reais, como nos outros produtos da Rockfy, e a nota fiscal sai em reais também.",
  },
  {
    q: "Quanto tempo leva para o projeto ficar no ar?",
    a: "Do envio ao link funcionando são segundos, não uma tarde. A primeira publicação inclui a detecção do build; as seguintes reaproveitam o que já foi identificado.",
  },
];
