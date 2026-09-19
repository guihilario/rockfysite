import { db, type Queryable } from "@/core/db/index.ts";

/** Estado de um pedido no banco. `pending` nasce no checkout; `paid` marca a
 *  confirmação manual no painel. */
export type PedidoStatus = "pending" | "paid" | "cancelled";

export type Pedido = {
  id: string;
  plan: string;
  priceCents: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  company: string | null;
  cep: string;
  address: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  paymentMethod: string;
  status: PedidoStatus;
  source: string | null;
  observacao: string;
  createdAt: Date;
};

type LinhaPedido = {
  id: string;
  plan: string;
  price_cents: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  company: string | null;
  cep: string;
  address: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  payment_method: string;
  status: PedidoStatus;
  source: string | null;
  observacao: string;
  created_at: Date;
};

function daLinha(l: LinhaPedido): Pedido {
  return {
    id: l.id,
    plan: l.plan,
    priceCents: l.price_cents,
    name: l.name,
    email: l.email,
    phone: l.phone,
    document: l.document,
    company: l.company,
    cep: l.cep,
    address: l.address,
    number: l.number,
    complement: l.complement,
    city: l.city,
    state: l.state,
    paymentMethod: l.payment_method,
    status: l.status,
    source: l.source,
    observacao: l.observacao,
    createdAt: l.created_at,
  };
}

export async function criarPedido(
  dados: {
    plan: string;
    priceCents: number;
    name: string;
    email: string;
    phone: string;
    document: string;
    company?: string | null;
    cep: string;
    address: string;
    number: string;
    complement?: string | null;
    city: string;
    state: string;
    paymentMethod: string;
    source?: string | null;
  },
  client: Queryable = db,
): Promise<Pedido> {
  const r = await client.queryObject<LinhaPedido>({
    text: `INSERT INTO orders
           (plan, price_cents, name, email, phone, document, company, cep,
            address, number, complement, city, state, payment_method, source)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           RETURNING *`,
    args: [
      dados.plan,
      dados.priceCents,
      dados.name,
      dados.email,
      dados.phone,
      dados.document,
      dados.company ?? null,
      dados.cep,
      dados.address,
      dados.number,
      dados.complement ?? null,
      dados.city,
      dados.state,
      dados.paymentMethod,
      dados.source ?? null,
    ],
  });
  return daLinha(r.rows[0]);
}

export async function listarPedidos(
  { limite = 200 }: { limite?: number } = {},
  client: Queryable = db,
): Promise<Pedido[]> {
  const r = await client.queryObject<LinhaPedido>({
    text: `SELECT * FROM orders ORDER BY created_at DESC LIMIT $1`,
    args: [limite],
  });
  return r.rows.map(daLinha);
}

/** Confirma pagamento manual no painel. Quem paga fora do gateway precisa de
 *  um lugar para virar "pago" — é o único retorno que o checkout offline tem.
 *  Trocar de estado também serve para voltar atrás e cancelar: uma ação só,
 *  com o valor validado na camada seguinte. */
export async function atualizarStatus(
  id: string,
  status: PedidoStatus,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `UPDATE orders SET status = $2, updated_at = now() WHERE id = $1`,
    args: [id, status],
  });
}

/** Preço em centavos para exibição em reais, ex.: 7700 → "R$ 77,00". */
export function formatarPreco(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/** Atualiza só os campos enviados, com allowlist explícita — o mesmo
 *  princípio do `atualizarLead`: a coluna não pode ser escolhida no SQL, só
 *  os campos opinados em código. */
export async function atualizarPedido(
  id: string,
  campos: {
    plan?: string;
    priceCents?: number;
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    company?: string | null;
    cep?: string;
    address?: string;
    number?: string;
    complement?: string | null;
    city?: string;
    state?: string;
    paymentMethod?: string;
    status?: PedidoStatus;
    observacao?: string;
  },
  client: Queryable = db,
): Promise<boolean> {
  const pares: [string, unknown][] = [];
  const define = (coluna: string, valor: unknown): void => {
    if (valor !== undefined) pares.push([coluna, valor ?? null]);
  };
  define("plan", campos.plan);
  define("price_cents", campos.priceCents);
  define("name", campos.name);
  define("email", campos.email);
  define("phone", campos.phone);
  define("document", campos.document);
  define("company", campos.company);
  define("cep", campos.cep);
  define("address", campos.address);
  define("number", campos.number);
  define("complement", campos.complement);
  define("city", campos.city);
  define("state", campos.state);
  define("payment_method", campos.paymentMethod);
  define("status", campos.status);
  define("observacao", campos.observacao);
  if (pares.length === 0) return false;

  const sets = pares.map(([coluna], i) => `${coluna} = $${i + 1}`);
  const r = await client.queryObject({
    text: `UPDATE orders SET ${sets.join(", ")}, updated_at = now()` +
      ` WHERE id = $${pares.length + 1}`,
    args: [...pares.map(([, valor]) => valor), id],
  });
  return (r.rowCount ?? 0) > 0;
}

/** Todos os pedidos de uma pessoa, com o mesmo critério de contato do lead:
 *  e-mail exato ou telefone com dígitos limpos. */
export async function listarPorContato(
  { email, telefone }: { email: string; telefone: string },
  client: Queryable = db,
): Promise<Pedido[]> {
  const r = await client.queryObject<LinhaPedido>({
    text: `SELECT * FROM orders
           WHERE lower(email) = $1
              OR regexp_replace(phone, '\D', '', 'g') = $2
           ORDER BY created_at DESC`,
    args: [email.toLowerCase(), telefone],
  });
  return r.rows.map(daLinha);
}

/** Apaga um pedido (ação deliberada do painel). Zero impacto em leads: a
 *  ficha continua com o contato, só sem a compra. */
export async function removerPedido(
  id: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `DELETE FROM orders WHERE id = $1`,
    args: [id],
  });
}
