// Ponto único de leitura de variáveis de ambiente.
// Novas variáveis (R2) entram aqui conforme cada fase as introduz —
// nunca `Deno.env.get()` espalhado pelo resto da aplicação (SPEC §50).

function required(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const port = Number(Deno.env.get("PORT") ?? 8000);
const appUrl = Deno.env.get("APP_URL") ?? `http://localhost:${port}`;
const appEnv = Deno.env.get("APP_ENV") ?? "development";

// Allowlist de quem pode virar admin no primeiro login — sem isso, qualquer
// conta Google que chegue no /auth/callback poderia se auto-cadastrar.
// Decisão do projeto em 2026-08-18: sem sistema de permissões, só uma
// lista de e-mails (SPEC §4, §12).
const adminEmails = required("ADMIN_EMAILS")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (adminEmails.length === 0) {
  throw new Error("ADMIN_EMAILS está vazio — nenhum e-mail pode virar admin");
}

/* Enquanto o site novo roda num endereço de teste (novo.rockfy.com), ele não
   pode ser indexado — senão o Google acha o conteúdo duplicado antes de a
   migração terminar. `SEO_INDEXABLE=true` libera; qualquer outro valor (ou a
   ausência dele) bloqueia. Fail-safe de propósito: esquecer a variável mantém
   o site fora do índice, e não o contrário. */
const indexable = Deno.env.get("SEO_INDEXABLE") === "true";

export const config = {
  port,
  appUrl,
  appEnv,
  indexable,
  isProduction: appEnv === "production",
  /* Uma URL só. Houve uma fase com duas (Neon e Prisma) e uma chave
     `DATABASE_PROVIDER` para escolher entre elas; a migração terminou, o
     Neon saiu, e manter o desvio só deixaria um caminho que ninguém usa
     esperando para confundir alguém. */
  databaseUrl: required("DATABASE_URL"),
  adminEmails,
  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
    /* Só usado como último recurso. Na prática o redirect_uri é derivado do
       host da própria requisição (ver core/auth/origem.ts): amarrá-lo a uma
       variável fazia o deploy de produção mandar o Google devolver o usuário
       em localhost, porque a variável ficou para trás. */
    redirectUri: Deno.env.get("GOOGLE_REDIRECT_URI") ??
      `${appUrl}/auth/callback`,
    /* Hosts em que o login pode acontecer. A lista tem que ser a MESMA dos
       "URIs de redirecionamento autorizados" no Google Cloud — se um
       domínio existir aqui e não lá, o Google recusa com
       `redirect_uri_mismatch`; se existir lá e não aqui, o código cai no
       fallback e manda o domínio errado, com o mesmo resultado.

       Foi o que aconteceu quando o site mudou de endereço: a lista ficou
       com o `rockfysite-capsula`, que saiu do Google, e o login parou em
       `new.rockfy.com`. */
    origensPermitidas: (Deno.env.get("OAUTH_ORIGENS") ??
      [
        appUrl,
        "https://new.rockfy.com",
        "https://site.rockfy.net",
        "https://rockfy.com",
      ].join(","))
      .split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean),
  },
  sessionSecret: required("SESSION_SECRET"),
  r2: {
    accountId: required("R2_ACCOUNT_ID"),
    accessKeyId: required("R2_ACCESS_KEY_ID"),
    secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    bucketName: required("R2_BUCKET_NAME"),
    // URL pública (domínio custom ou dev.r2.dev) na frente do bucket —
    // é o que vira `coverImageUrl`, nunca a URL da API do R2 (SPEC §20).
    publicUrl: required("R2_PUBLIC_URL").replace(/\/$/, ""),
  },
};
