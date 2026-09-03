import { define } from "@/utils.ts";
import {
  CHAVE_WEBHOOK,
  criarLead,
  lerConfig,
  registrarEnvio,
} from "@/domain/leads.ts";
import { linkWhatsApp } from "@/components/PopoverPlano.tsx";

/** Tempo máximo esperando o sistema externo antes de seguir sem ele. */
const ESPERA_WEBHOOK_MS = 4000;

/**
 * Recebe o formulário dos planos.
 *
 * A ordem importa: grava no banco primeiro, avisa o sistema externo depois.
 * Se o CRM estiver fora do ar, o lead já está salvo — o contrário perderia
 * o contato justamente no dia em que o outro lado falha.
 *
 * O redirect para o WhatsApp acontece de qualquer jeito. Quem preencheu o
 * formulário não tem nada a ver com a indisponibilidade de um sistema
 * interno, e segurar a pessoa numa tela de erro por isso seria perder a
 * conversa que o formulário existe para começar.
 */
async function avisarSistemaExterno(
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    plan: string | null;
    source: string | null;
    createdAt: Date;
  },
): Promise<string> {
  const url = await lerConfig(CHAVE_WEBHOOK);
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

function limpar(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const name = limpar(form.get("name"), 120);
    const email = limpar(form.get("email"), 160);
    const phone = limpar(form.get("phone"), 40);
    const plan = limpar(form.get("plan"), 60) || null;
    const source = limpar(form.get("source"), 200) || null;

    /* O navegador já valida com `required` e `type`, mas isso é dica de
       interface: quem posta direto no endpoint não passa por ela. */
    const digitos = phone.replace(/\D/g, "").length;
    if (!name || !email.includes("@") || digitos < 10) {
      return new Response(null, {
        status: 303,
        headers: { location: `${source ?? "/planos"}?lead=erro` },
      });
    }

    const lead = await criarLead({ name, email, phone, plan, source });
    const status = await avisarSistemaExterno(lead);
    if (status !== "ok") {
      console.warn(`[lead] webhook: ${status} (lead ${lead.id})`);
    }
    await registrarEnvio(lead.id, status);

    /* Não redirecionamos daqui. `form-action` do CSP vale para cada passo
       da cadeia de redirects, e o wa.me responde 302 para o
       api.whatsapp.com — liberar host por host deixaria a nossa política
       dependente dos redirects internos do WhatsApp. A página abaixo
       navega sozinha, e navegação não é submissão de formulário. */
    return { data: { destino: linkWhatsApp({ name, plan }), nome: name } };
  },
});

export default define.page<typeof handler>(function Enviado({ data }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,nofollow" />
        <meta http-equiv="refresh" content={`0;url=${data.destino}`} />
        <title>Abrindo o WhatsApp | Rockfy</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="enviado">
          <p class="eyebrow">Recebemos seu contato</p>
          <h1 class="title">
            Obrigado, <b>{data.nome.split(" ")[0]}</b>
          </h1>
          <p class="para">
            Estamos abrindo o WhatsApp com a sua mensagem pronta. Se ele não
            abrir sozinho, use o botão abaixo.
          </p>
          <a class="cta" href={data.destino}>
            Abrir o WhatsApp
            <span class="badge">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </a>
          <p class="para enviado__volta">
            <a href="/planos">Voltar para os planos</a>
          </p>
        </main>
      </body>
    </html>
  );
});
