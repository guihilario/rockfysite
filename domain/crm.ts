import {
  type Lead,
  listarPorContato as leadsDoContato,
} from "@/domain/leads.ts";
import {
  listarPorContato as pedidosDoContato,
  type Pedido,
} from "@/domain/orders.ts";

/**
 * Ficha de um cliente no CRM: une tudo o que alcança a mesma pessoa —
 * leads e pedidos casados por e-mail ou telefone. Lead vira "ganho" sem
 * pedido e pedido nasce para alguém que nunca "leadou" formalmente; a ficha
 * é o único lugar em que os dois lados se veem.
 */

export type FichaCliente = {
  email: string;
  telefone: string;
  nome: string;
  documento: string | null;
  endereco: string | null;
  valorTotalCents: number;
  leads: Lead[];
  pedidos: Pedido[];
  pedidosPagos: number;
};

/** O número com só dígitos, para comparar telefones que chegaram formatados
 *  diferente ((11) 98765-4321 vs 11987654321). */
export function digitosTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

export async function fichaCliente(
  email: string,
  telefone: string,
): Promise<FichaCliente> {
  const [leads, pedidos] = await Promise.all([
    leadsDoContato({ email, telefone: digitosTelefone(telefone) }),
    pedidosDoContato({ email, telefone: digitosTelefone(telefone) }),
  ]);

  /* Os dados de exibição vêm do item mais recente — um mesmo e-mail pode
     digitar nome diferente em cada formulário, e o último vence. */
  const leadTopo = leads[0];
  const pedidoTopo = pedidos[0];
  const nome = pedidoTopo?.name ?? leadTopo?.name ?? "Cliente sem nome";
  const documento = pedidoTopo?.document ?? null;
  const endereco = pedidoTopo
    ? [
      pedidoTopo.address,
      pedidoTopo.number,
      pedidoTopo.complement,
      `${pedidoTopo.cep} · ${pedidoTopo.city}/${pedidoTopo.state}`,
    ].filter(Boolean).join(", ")
    : null;

  return {
    email,
    telefone: telefone || (leads[0]?.phone ?? pedidoTopo?.phone ?? ""),
    nome,
    documento,
    endereco,
    valorTotalCents: pedidos
      .filter((p) => p.status !== "cancelled")
      .reduce((soma, p) => soma + p.priceCents, 0),
    leads,
    pedidos,
    pedidosPagos: pedidos.filter((p) => p.status === "paid").length,
  };
}

/** Link para abrir conversa no WhatsApp com o número do cliente, já com o
 *  DDI 55 e uma saudação pronta para o atendimento. */
export function linkWhatsAppCliente(
  telefone: string,
  texto: string,
): string {
  return `https://wa.me/55${digitosTelefone(telefone)}?text=${
    encodeURIComponent(texto)
  }`;
}
