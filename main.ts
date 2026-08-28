import { App, csp, staticFiles } from "fresh";
import { compressao, seguranca } from "@/core/http/seguranca.ts";

export const app = new App();

app.use(seguranca());
app.use(compressao());

/* `useNonce` troca o `'unsafe-inline'` do padrão pelo nonce que o Fresh já
   coloca em cada <script> — inclusive nos blocos de JSON-LD. O único desvio
   do padrão é o `img-src`: as capas dos posts vêm do R2 e, nos artigos
   herdados do site antigo, de outros domínios. */
app.use(csp({
  useNonce: true,
  csp: ["img-src 'self' data: https:"],
}));

app.use(staticFiles());
app.fsRoutes();
