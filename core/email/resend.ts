import { config } from "@/core/config.ts";

/**
 * Envio de e-mail pela API do Resend (api.resend.com).
 *
 * A notificação de pedido é efeito colateral: a ordem já foi gravada antes e
 * o checkout segue sem ela. Por isso nada aqui lança — a função devolve o
 * resultado para o chamador decidir, e o pior caso é um console.warn.
 * Sem chave ou destinatário configurados, o site continua funcionando.
 */

export type ResultadoEnvio = { ok: boolean; detalhe?: string };

/** Envio cru: um e-mail só. `html` é opcional; sem ele vai só texto. */
export async function enviarEmail(
  { to, subject, text, html }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  },
): Promise<ResultadoEnvio> {
  const { apiKey, from } = config.resend;
  if (!apiKey || !from) return { ok: false, detalhe: "resend não configurado" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(
        { from, to, subject, text, ...(html ? { html } : {}) },
      ),
      signal: AbortSignal.timeout(10_000),
    });
    return r.ok ? { ok: true } : { ok: false, detalhe: `HTTP ${r.status}` };
  } catch (e) {
    return {
      ok: false,
      detalhe: e instanceof Error ? e.message.slice(0, 200) : "falhou",
    };
  }
}

const escaparHtml = (t: string): string =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Avisa o dono do site de um pedido novo. O destinatário é fixo (`EMAIL_TO`);
 *  ao cliente a confirmação segue pelo WhatsApp, não por e-mail. */
export function enviarPedidoNovo(
  dados: {
    pedidoId: string;
    plano: string;
    preco: string;
    pagamento: string;
    cliente: string;
    email: string;
    telefone: string;
    documento: string;
    endereco: string;
    linkWhatsapp: string;
  },
): Promise<ResultadoEnvio> {
  const to = config.resend.to;
  if (!to) {
    return Promise.resolve({ ok: false, detalhe: "EMAIL_TO não configurado" });
  }

  const linhas = [
    `Plano: ${dados.plano}`,
    `Valor: ${dados.preco}/mês`,
    `Pagamento: ${dados.pagamento}`,
    "",
    `Cliente: ${dados.cliente}`,
    `E-mail: ${dados.email}`,
    `Telefone/WhatsApp: ${dados.telefone}`,
    `CPF/CNPJ: ${dados.documento}`,
    `Endereço: ${dados.endereco}`,
    "",
    `ID do pedido: ${dados.pedidoId}`,
    "",
    `Falar com o cliente no WhatsApp: ${dados.linkWhatsapp}`,
  ];

  return enviarEmail({
    to,
    subject: `Novo pedido no site — ${dados.plano} (${dados.preco}/mês)`,
    text: `Um pedido novo chegou no site.\n\n${linhas.join("\n")}`,
    html: [
      "<p>Um pedido novo chegou no site!</p>",
      "<ul>",
      ...linhas.filter(Boolean).map((l) => {
        const [rotulo, ...resto] = l.split(":");
        const restante = resto.join(":");
        return restante
          ? `<li><b>${escaparHtml(rotulo)}:</b> ${escaparHtml(restante)}</li>`
          : `<li>${escaparHtml(l)}</li>`;
      }),
      "</ul>",
    ].join("\n"),
  });
}
