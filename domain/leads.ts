import { db, type Queryable } from "@/core/db/index.ts";
import { planoPorSlug, slugPlano } from "@/data/plans.ts";

/**
 * Etapas do funil de vendas do painel. A ordem aqui é a ordem visual do
 * kanban. Somar etapa nova não pede migração — é só acrescentar ao array —,
 * mas remover uma usada no banco deixaria filhotes órfãos, então só cresce.
 */
export const ETAPAS_CRM: { chave: string; rotulo: string; cor: string }[] = [
  { chave: "novo", rotulo: "Novo", cor: "#2563eb" },
  { chave: "contatado", rotulo: "Em contato", cor: "#b45f06" },
  { chave: "proposta", rotulo: "Proposta", cor: "#7c3aed" },
  { chave: "ganho", rotulo: "Ganho", cor: "#1f9e4c" },
  { chave: "perdido", rotulo: "Perdido", cor: "#8d8d8d" },
];

export const CHAVES_ETAPA = new Set(ETAPAS_CRM.map((e) => e.chave));

/** O "valor em potencial" de um lead: quanto ele representa por mês se fechar
 *  o plano que ele escolheu. Vem do preço do plano (via slug), ou R$0 quando
 *  não há plano ou o nome não casa com a tabela. */
export function valorPotencialCents(plan: string | null | undefined): number {
  if (!plan) return 0;
  return planoPorSlug(slugPlano(plan))?.priceCents ?? 0;
}

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string | null;
  source: string | null;
  etapa: string;
  observacao: string;
  proximoContato: string | null;
  createdAt: Date;
  webhookStatus: string | null;
  webhookAt: Date | null;
};

type LinhaLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string | null;
  source: string | null;
  etapa: string;
  observacao: string;
  proximo_contato: string | null;
  created_at: Date;
  webhook_status: string | null;
  webhook_at: Date | null;
};

function daLinha(l: LinhaLead): Lead {
  return {
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    plan: l.plan,
    source: l.source,
    etapa: l.etapa,
    observacao: l.observacao,
    proximoContato: l.proximo_contato,
    createdAt: l.created_at,
    webhookStatus: l.webhook_status,
    webhookAt: l.webhook_at,
  };
}

export async function criarLead(
  dados: {
    name: string;
    email: string;
    phone: string;
    plan?: string | null;
    source?: string | null;
    /** Etapa inicial no funil do CRM; o padrão do banco é "novo". */
    etapa?: string;
  },
  client: Queryable = db,
): Promise<Lead> {
  const r = await client.queryObject<LinhaLead>({
    text: `INSERT INTO leads (name, email, phone, plan, source, etapa)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    args: [
      dados.name,
      dados.email,
      dados.phone,
      dados.plan ?? null,
      dados.source ?? null,
      dados.etapa && CHAVES_ETAPA.has(dados.etapa) ? dados.etapa : "novo",
    ],
  });
  return daLinha(r.rows[0]);
}

export async function listarLeads(
  { limite = 100, busca, etapa }: {
    limite?: number;
    busca?: string;
    etapa?: string;
  } = {},
  client: Queryable = db,
): Promise<Lead[]> {
  const clausulas: string[] = [];
  const args: unknown[] = [];
  if (etapa && CHAVES_ETAPA.has(etapa)) {
    clausulas.push(`etapa = $${args.length + 1}`);
    args.push(etapa);
  }
  if (busca) {
    /* Um índice por campo: o Postgres exige os parâmetros consecutivos —
       reutilizar o mesmo `$n` três vezes deixava $2/$3 "sem uso" e sem tipo
       inferível no prepare da statement. */
    const i = args.length + 1;
    clausulas.push(
      `(name ILIKE $${i}::text OR email ILIKE $${i + 1}::text` +
        ` OR phone ILIKE $${i + 2}::text)`,
    );
    args.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }
  const where = clausulas.length > 0 ? `WHERE ${clausulas.join(" AND ")}` : "";
  args.push(limite);
  const r = await client.queryObject<LinhaLead>({
    text:
      `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT $${args.length}`,
    args,
  });
  return r.rows.map(daLinha);
}

/** Quantos leads tem em cada etapa do funil — o "cadinho" que mostra se a
 *  gestão está andando. Etapa sem nenhum lead entra com `0` para a coluna
 *  não sumir do kanban. */
export async function contarPorEtapa(
  client: Queryable = db,
): Promise<Record<string, number>> {
  const r = await client.queryObject<{ etapa: string; total: number }>({
    text: `SELECT etapa, count(*) AS total FROM leads GROUP BY etapa`,
  });
  const contagem: Record<string, number> = {};
  for (const e of ETAPAS_CRM) contagem[e.chave] = 0;
  for (const l of r.rows) contagem[l.etapa] = Number(l.total);
  return contagem;
}

/** Atualiza só os campos enviados. A lista de campos permitidos é explícita
 *  para nada que a rota não sonha em editar vazar para o SQL (injeção na
 *  coluna é impossível quando a coluna não pode nem ser escolhida). */
export async function atualizarLead(
  id: string,
  campos: {
    name?: string;
    email?: string;
    phone?: string;
    plan?: string | null;
    source?: string | null;
    etapa?: string;
    observacao?: string;
    proximoContato?: string | null;
  },
  client: Queryable = db,
): Promise<boolean> {
  const pares: [string, unknown][] = [];
  const define = (coluna: string, valor: unknown): void => {
    if (valor !== undefined) pares.push([coluna, valor ?? null]);
  };
  define("name", campos.name);
  define("email", campos.email);
  define("phone", campos.phone);
  define("plan", campos.plan);
  define("source", campos.source);
  define("etapa", campos.etapa);
  define("observacao", campos.observacao);
  define("proximo_contato", campos.proximoContato);
  if (pares.length === 0) return false;

  const sets = pares.map(([coluna], i) => `${coluna} = $${i + 1}`);
  const r = await client.queryObject({
    text: `UPDATE leads SET ${sets.join(", ")} WHERE id = $${pares.length + 1}`,
    args: [...pares.map(([, valor]) => valor), id],
  });
  return (r.rowCount ?? 0) > 0;
}

/** Todos os contatos de uma pessoa, casando por e-mail exato OU pelo número
 *  com dígitos limpos — quem digitou o telefone com espaço ou sem DDD deve
 *  cair na mesma ficha. */
export async function listarPorContato(
  { email, telefone }: { email: string; telefone: string },
  client: Queryable = db,
): Promise<Lead[]> {
  const r = await client.queryObject<LinhaLead>({
    text: `SELECT * FROM leads
           WHERE lower(email) = $1
              OR regexp_replace(phone, '\D', '', 'g') = $2
           ORDER BY created_at DESC`,
    args: [email.toLowerCase(), telefone],
  });
  return r.rows.map(daLinha);
}

/** Remove um lead (ação deliberada do painel). Não apaga pedidos: a ficha
 *  de quem já "virou" pedido continua mostrando o pedido. */
export async function removerLead(
  id: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `DELETE FROM leads WHERE id = $1`,
    args: [id],
  });
}

export async function registrarEnvio(
  id: string,
  status: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text:
      `UPDATE leads SET webhook_status = $2, webhook_at = now() WHERE id = $1`,
    args: [id, status],
  });
}

/* ── aviso ao sistema externo ───────────────────────────────────────── */

/** Tempo máximo esperando o sistema externo antes de seguir sem ele. */
const ESPERA_WEBHOOK_MS = 4000;

/**
 * Avisa o CRM/webhook de novo lead. A ordem importa: grava no banco
 * primeiro, avisa o sistema externo depois. Se o CRM estiver fora do ar, o
 * lead já está salvo — o contrário perderia o contato justamente no dia em
 * que o outro lado falha.
 */
export async function avisarSistemaExterno(
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    plan: string | null;
    source: string | null;
    createdAt: Date;
  },
  client: Queryable = db,
): Promise<string> {
  const url = await lerConfig(CHAVE_WEBHOOK, client);
  if (!url) return "sem webhook";
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: lead.id,
        nome: lead.name,
        email: lead.email,
        telefone: lead.phone,
        plano: lead.plan,
        origem: lead.source,
        criado_em: lead.createdAt.toISOString(),
      }),
      signal: AbortSignal.timeout(ESPERA_WEBHOOK_MS),
    });
    return r.ok ? "ok" : `HTTP ${r.status}`;
  } catch (e) {
    return e instanceof Error ? e.message.slice(0, 200) : "falhou";
  }
}

/* ── configuração do painel ─────────────────────────────────────────── */

export async function lerConfig(
  nome: string,
  client: Queryable = db,
): Promise<string | null> {
  const r = await client.queryObject<{ value: string }>({
    text: `SELECT value FROM settings WHERE name = $1`,
    args: [nome],
  });
  return r.rows[0]?.value ?? null;
}

export async function gravarConfig(
  nome: string,
  valor: string,
  client: Queryable = db,
): Promise<void> {
  await client.queryObject({
    text: `INSERT INTO settings (name, value) VALUES ($1, $2)
           ON CONFLICT (name) DO UPDATE
           SET value = EXCLUDED.value, updated_at = now()`,
    args: [nome, valor],
  });
}

export const CHAVE_WEBHOOK = "leads_webhook_url";
