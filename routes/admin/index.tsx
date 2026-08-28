import { define } from "@/utils.ts";

/** O painel entra direto na lista de posts. */
export const handler = define.handlers({
  GET: () =>
    new Response(null, { status: 302, headers: { location: "/admin/posts" } }),
});
