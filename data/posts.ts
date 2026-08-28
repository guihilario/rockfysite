/** Cards do blog na home e nas páginas de serviço. */
export type Post = {
  href: string;
  tag: string;
  meta: string;
  title: string;
  text: string;
};

export const posts = [
  {
    href: "#",
    tag: "Performance",
    meta: "12 ago · 6 min",
    title: "O que realmente deixa um WordPress lento",
    text:
      "Plugins não são o vilão principal. Medimos 40 sites e o gargalo estava em outro lugar.",
  },
  {
    href: "#",
    tag: "Deploy",
    meta: "28 jul · 4 min",
    title: "Do commit ao ar em menos de um minuto",
    text:
      "Como configurar deploy automático a cada push, com preview em pull request.",
  },
  {
    href: "#",
    tag: "Negócios",
    meta: "03 jul · 8 min",
    title: "Quanto cobrar pela hospedagem do cliente",
    text:
      "Três modelos de repasse que agências usam, com as contas abertas de cada um.",
  },
];
