import type { ComponentChildren } from "preact";

type Props = {
  titulo: string;
  usuario: { email: string };
  atual: "posts" | "categorias" | "leads";
  /** Scripts extras (o editor Quill, por exemplo). */
  scripts?: ComponentChildren;
  head?: ComponentChildren;
  children: ComponentChildren;
};

/** Casca das telas de /admin. Sempre `noindex`: o painel nunca deve ser
 *  indexado, e isso não pode depender de lembrar em cada página. */
export function Shell(
  { titulo, usuario, atual, scripts, head, children }: Props,
) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,nofollow" />
        <title>{titulo} · painel Rockfy</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/css/admin.css" />
        {head}
      </head>
      <body class="adm">
        <header class="adm-top">
          <a class="adm-marca" href="/admin/posts">Rockfy · painel</a>
          <nav class="adm-nav">
            <a
              href="/admin/posts"
              class={atual === "posts" ? "is-on" : undefined}
            >
              Posts
            </a>
            <a
              href="/admin/categories"
              class={atual === "categorias" ? "is-on" : undefined}
            >
              Categorias
            </a>
            <a
              href="/admin/leads"
              class={atual === "leads" ? "is-on" : undefined}
            >
              Contatos
            </a>
          </nav>
          <span class="adm-user">
            {usuario.email} · <a href="/auth/logout">sair</a>
          </span>
        </header>
        <main class="adm-main">{children}</main>
        <script src="/js/admin.js" defer></script>
        {scripts}
      </body>
    </html>
  );
}
