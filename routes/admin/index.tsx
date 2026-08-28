import { define } from "@/utils.ts";
import { listAllPosts } from "@/domain/posts.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const { posts } = await listAllPosts({ page: 1, perPage: 20 });
    return { data: { posts, usuario: ctx.state.usuario! } };
  },
});

export default define.page<typeof handler>(function Admin({ data }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Painel | Rockfy</title>
        <link rel="stylesheet" href="/admin.css" />
      </head>
      <body class="adm">
        <header class="adm-top">
          <b>Rockfy · painel</b>
          <span>
            {data.usuario.email} · <a href="/auth/logout">sair</a>
          </span>
        </header>
        <main class="adm-main">
          <h1>Posts</h1>
          <p class="adm-meta">{data.posts.length} mais recentes</p>
          <table class="adm-tabela">
            <thead>
              <tr>
                <th>Título</th>
                <th>Seção</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.categoryName ?? "—"}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </body>
    </html>
  );
});
