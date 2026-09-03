import { config } from "@/core/config.ts";

/**
 * A origem em que o login está acontecendo, tirada da própria requisição.
 *
 * Amarrar o `redirect_uri` a uma variável de ambiente foi o que quebrou o
 * login em produção: o deploy subiu com a variável apontando para
 * `localhost`, então o Google devolvia o usuário na máquina dele. Derivar
 * do host resolve isso sem depender de lembrar de configurar cada ambiente.
 *
 * O host chega do cliente, então não dá para confiar nele cegamente — só
 * origens da allowlist passam. (O Google também recusaria qualquer URI não
 * registrada, mas conferir aqui evita mandar tráfego para fora.)
 */
export function origemDaRequisicao(req: Request): string {
  const url = new URL(req.url);
  // Atrás de proxy/CDN o protocolo real vem no cabeçalho.
  const proto = req.headers.get("x-forwarded-proto") ??
    url.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ??
    url.host;
  const origem = `${proto}://${host}`;

  if (config.google.origensPermitidas.includes(origem)) return origem;

  /* Host desconhecido: cai para a origem configurada, em vez de refletir
     de volta algo que o cliente escolheu. Avisa alto, porque daqui o
     sintoma é um `redirect_uri_mismatch` genérico do Google, que não diz
     qual domínio faltou — e essa linha diz. */
  console.warn(
    `[auth] origem "${origem}" não está em OAUTH_ORIGENS; usando ` +
      `"${config.google.origensPermitidas[0]}". Se o login falhar com ` +
      `redirect_uri_mismatch, é isto.`,
  );
  return config.google.origensPermitidas[0];
}

export function redirectUriDe(req: Request): string {
  return `${origemDaRequisicao(req)}/auth/callback`;
}
