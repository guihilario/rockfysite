import { db, type Queryable } from "@/core/db/index.ts";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string | null;
  source: string | null;
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
  },
  client: Queryable = db,
): Promise<Lead> {
  const r = await client.queryObject<LinhaLead>({
    text: `INSERT INTO leads (name, email, phone, plan, source)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    args: [
      dados.name,
      dados.email,
      dados.phone,
      dados.plan ?? null,
      dados.source ?? null,
    ],
  });
  return daLinha(r.rows[0]);
}

export async function listarLeads(
  { limite = 100 }: { limite?: number } = {},
  client: Queryable = db,
): Promise<Lead[]> {
  const r = await client.queryObject<LinhaLead>({
    text: `SELECT * FROM leads ORDER BY created_at DESC LIMIT $1`,
    args: [limite],
  });
  return r.rows.map(daLinha);
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
