/**
 * Os dados da empresa e os canais de atendimento.
 *
 * Ficam num lugar só porque aparecem no rodapé, nas páginas institucionais
 * e nos Termos — e o dia em que o telefone mudar, mudaria em um arquivo e
 * ficaria velho nos outros três.
 *
 * A razão social, o CNPJ e o endereço são os mesmos declarados nos Termos
 * (ver `data/legal.ts`): se divergirem, quem está errado é esta lista.
 */
export const site = {
  nome: "Rockfy",
  razaoSocial: "Capsula Tecnologia e Serviços Ltda.",
  cnpj: "31.786.423/0001-02",
  endereco:
    "Ed. Maxime, Av. Nove de Julho, 3575, 5º andar — Jundiaí, São Paulo",
  cidade: "Jundiaí, São Paulo",
  whatsapp: "https://wa.me/5511937464053",
  whatsappRotulo: "(11) 93746-4053",
  email: "suporte@rockfy.com",
  /** Sistema fora deste site. */
  areaCliente: "https://area.rockfy.com",
  areaClienteRotulo: "area.rockfy.com",
} as const;
