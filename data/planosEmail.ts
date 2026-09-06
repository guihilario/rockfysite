import type { Plan } from "@/data/plans.ts";

/**
 * Planos do Rockfy E-mail (spec §7).
 *
 * A régua aqui é armazenamento total, não quantidade de caixa — é isso que
 * sustenta o "sem custo por endereço". O asterisco não é enfeite: o spec
 * proíbe vender "ilimitado" sem a ressalva, e proíbe "armazenamento
 * ilimitado" em qualquer hipótese.
 *
 * Sem cPanel, Elementor, Deploy ou banco nos cards (§7, Regras).
 */
export const planosEmail: Plan[] = [
  {
    tag: "Para quem está começando",
    name: "Essencial",
    price: "R$19,90",
    note: "Pra sair do e-mail pessoal e atender com o endereço da sua empresa.",
    items: [
      { n: "[1]", label: "Domínio" },
      {
        n: null,
        label: "Caixas ilimitadas*",
        hint:
          "Dentro do armazenamento contratado e sujeito à política de uso legítimo.",
      },
      { n: null, label: "10 GB de armazenamento total" },
      { n: null, label: "Webmail" },
      { n: null, label: "Antispam" },
      { n: null, label: "Configuração assistida" },
      { n: "[3]", label: "Caixas migradas" },
    ],
    cta: "Criar meus e-mails",
  },
  {
    tag: "Para equipes",
    name: "Business",
    price: "R$39,90",
    featured: true,
    note:
      "Pra equipe que cresce sem querer pagar mais a cada pessoa que entra.",
    items: [
      { n: "[3]", label: "Domínios" },
      {
        n: null,
        label: "Caixas ilimitadas*",
        hint:
          "Dentro do armazenamento contratado e sujeito à política de uso legítimo.",
      },
      { n: null, label: "30 GB de armazenamento total" },
      { n: null, label: "Webmail" },
      { n: null, label: "Antispam" },
      { n: "[10]", label: "Caixas migradas" },
      { n: null, label: "Suporte prioritário" },
    ],
    cta: "Criar os e-mails da equipe",
  },
  {
    tag: "Para operações maiores",
    name: "Studio",
    price: "R$79,90",
    note: "Pra quem administra vários domínios e precisa de espaço para todos.",
    items: [
      { n: "[10]", label: "Domínios" },
      {
        n: null,
        label: "Caixas ilimitadas*",
        hint:
          "Dentro do armazenamento contratado e sujeito à política de uso legítimo.",
      },
      { n: null, label: "100 GB de armazenamento total" },
      { n: null, label: "Webmail" },
      { n: null, label: "Antispam" },
      { n: "[30]", label: "Caixas migradas" },
      { n: null, label: "Suporte prioritário" },
    ],
    cta: "Falar sobre Studio",
  },
];
