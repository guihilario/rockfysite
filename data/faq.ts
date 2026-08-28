/** Perguntas frequentes. O acordeão abre uma por vez. */
export type FaqItem = { q: string; a: string };

export const faq = [
  {
    q: "Preciso pagar alguma taxa para migrar meu site?",
    a: "Não. A migração é feita pelo nosso time, sem custo e sem tempo de fora do ar. Você envia os acessos do provedor atual e devolvemos tudo funcionando no mesmo dia, incluindo e-mails, banco de dados e certificados.",
  },
  {
    q: "Existe fidelidade ou multa de cancelamento?",
    a: "Nenhuma. A cobrança é mensal e você cancela pelo painel quando quiser. O plano segue ativo até o fim do ciclo já pago, e você leva seus arquivos e bancos num backup completo.",
  },
  {
    q: "Posso trocar de plano depois?",
    a: "Sim, para cima ou para baixo, a qualquer momento. O upgrade vale na hora e cobramos apenas a diferença proporcional aos dias restantes. O downgrade entra no próximo ciclo, sem perder nada do que está publicado.",
  },
  {
    q: "O Elementor Pro está mesmo incluído?",
    a: "Está, com licença oficial ativada direto no painel — não é versão anulada nem compartilhada. Vale para todos os sites dentro do seu plano, enquanto a assinatura estiver ativa.",
  },
  {
    q: "Como funciona o backup?",
    a: "Backup diário automático dos últimos 30 dias, guardado fora do servidor principal. A restauração é feita por você mesmo, em um clique, escolhendo o dia — ou pelo suporte, se preferir.",
  },
  {
    q: "O suporte atende em qual horário?",
    a: "Chat e WhatsApp das 8h às 22h, todos os dias. Fora desse horário, incidentes de indisponibilidade continuam monitorados por plantão e tratados na hora.",
  },
];
