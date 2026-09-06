import type { Plan } from "@/data/plans.ts";

/**
 * Planos do Rockfy Deploy (spec §5).
 *
 * Deploy não compartilha régua com hospedagem: aqui se cobra por aplicação,
 * domínio e retenção de log, não por conta cPanel. Por isso arquivo próprio.
 *
 * Os itens de banco entram com `on: false` de propósito. O spec é explícito
 * (§5, "Rockfy Database"): a interface fica preparada, mas o recurso não pode
 * aparecer como ativo, incluso ou contratável antes de a integração entrar em
 * produção. Riscado com o rótulo "em breve" é o que diz a verdade hoje —
 * quando a flag virar, some o sufixo e o `on: false`, sem mexer na página.
 *
 * "Prisma" não aparece: é fornecedor interno, não produto comercial (§18).
 */
const emBreve = (n: string | null, label: string) => ({
  n,
  label: `${label} — em breve`,
  on: false,
  hint: "PostgreSQL gerenciado entra em produção em breve.",
});

export const planosDeploy: Plan[] = [
  {
    tag: "Para o primeiro projeto",
    name: "Launch",
    price: "R$47",
    note:
      "Pra tirar do ar local o app que você criou e botar num link de verdade.",
    items: [
      { n: "[1]", label: "Aplicação" },
      { n: "[1]", label: "Domínio próprio" },
      { n: null, label: "SSL configurado" },
      { n: null, label: "Deploy por Git ou upload" },
      { n: null, label: "Variáveis e secrets" },
      { n: null, label: "Logs por 24 horas" },
      { n: null, label: "Rollback básico" },
      emBreve("[1]", "Banco Postgres"),
    ],
    cta: "Publicar meu projeto",
  },
  {
    tag: "Para quem já tem clientes",
    name: "Pro",
    price: "R$97",
    featured: true,
    note:
      "Pra quem mantém mais de um projeto no ar e precisa de suporte que responde antes.",
    items: [
      { n: "[3]", label: "Aplicações" },
      { n: "[3]", label: "Domínios próprios" },
      { n: null, label: "SSL configurado" },
      { n: null, label: "Deploy por Git ou upload" },
      { n: null, label: "Variáveis e secrets" },
      { n: null, label: "Logs por 7 dias" },
      { n: null, label: "Rollback" },
      { n: null, label: "Suporte prioritário" },
      emBreve("[3]", "Bancos Postgres"),
    ],
    cta: "Publicar meus projetos",
  },
  {
    tag: "Para estúdios",
    name: "Studio",
    price: "R$197",
    note:
      "Pra quem organiza projeto por cliente e não quer tudo misturado num painel só.",
    items: [
      { n: "[10]", label: "Aplicações" },
      { n: "[10]", label: "Domínios próprios" },
      { n: null, label: "Organização por cliente" },
      { n: null, label: "Logs por 15 dias" },
      { n: null, label: "Rollback" },
      { n: null, label: "Variáveis e secrets" },
      { n: null, label: "Suporte prioritário" },
      emBreve("[10]", "Bancos Postgres"),
    ],
    cta: "Montar meu estúdio",
  },
  {
    tag: "Para operação recorrente",
    name: "Scale",
    price: "R$397",
    note:
      "Pra quem tem carteira de clientes e precisa de retenção de log e backup mais longos.",
    items: [
      { n: "[25]", label: "Aplicações" },
      { n: "[25]", label: "Domínios próprios" },
      { n: null, label: "Organização por cliente" },
      { n: null, label: "Logs por 30 dias" },
      { n: null, label: "Rollback" },
      { n: null, label: "Suporte prioritário" },
      emBreve("[25]", "Bancos Postgres"),
      emBreve(null, "Backup de banco por 30 dias"),
    ],
    cta: "Falar sobre Scale",
  },
];
