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
