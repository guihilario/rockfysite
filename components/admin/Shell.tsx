import type { ComponentChildren } from "preact";

type Props = {
  titulo: string;
  usuario: { email: string };
  atual: "posts" | "categorias" | "crm" | "leads" | "pedidos" | "acessos";
  /** Scripts extras (o editor Quill, por exemplo). */
  scripts?: ComponentChildren;
  head?: ComponentChildren;
  children: ComponentChildren;
};

/** Casca das telas de /mydash. Sempre `noindex`: o painel nunca deve ser
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
          <a class="adm-marca" href="/mydash/posts">Rockfy · painel</a>
          <nav class="adm-nav">
            <a
              href="/mydash/posts"
              class={atual === "posts" ? "is-on" : undefined}
            >
              Posts
            </a>
            <a
              href="/mydash/categories"
              class={atual === "categorias" ? "is-on" : undefined}
            >
              Categorias
            </a>
            <a
              href="/mydash/crm"
              class={atual === "crm" ? "is-on" : undefined}
            >
              CRM
            </a>
            <a
              href="/mydash/leads"
              class={atual === "leads" ? "is-on" : undefined}
            >
              Contatos
            </a>
            <a
              href="/mydash/orders"
              class={atual === "pedidos" ? "is-on" : undefined}
            >
              Pedidos
            </a>
            <a
              href="/mydash/acessos"
              class={atual === "acessos" ? "is-on" : undefined}
            >
              Acessos
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
