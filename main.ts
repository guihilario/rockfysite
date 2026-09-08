import { App, csp, staticFiles } from "fresh";
import { compressao, seguranca } from "@/core/http/seguranca.ts";
import { legado } from "@/core/http/legado.ts";

export const app = new App();

app.use(seguranca());
app.use(compressao());

/* Antes da CSP e dos arquivos estáticos: um 301 não tem corpo, e não há
   motivo para montar política nem procurar arquivo para uma resposta vazia. */
app.use(legado());

/* `useNonce` troca o `'unsafe-inline'` do padrão pelo nonce que o Fresh já
   coloca em cada <script> — inclusive nos blocos de JSON-LD. O único desvio
   do padrão é o `img-src`: as capas dos posts vêm do R2 e, nos artigos
   herdados do site antigo, de outros domínios. */
app.use(csp({
  useNonce: true,
  csp: [
    "img-src 'self' data: https:",
    /* O GTM baixa o `gtm.js` do domínio abaixo; sem isto o container é
       bloqueado e nada dispara — sem erro visível na página. O nonce cobre
       os scripts que ele injeta depois (ver components/Gtm.tsx). */
    /* Duas coisas acontecem aqui, e nenhuma é óbvia:

       `'unsafe-inline'` NÃO afrouxa a política. O middleware do Fresh troca
       esse literal pelo nonce da requisição em toda diretiva que o contém;
       escrever o nonce à mão é impossível, porque ele muda a cada resposta,
       e omitir o literal derruba o nonce junto — bloqueando todo script
       inline do site.

       `'strict-dynamic'` é o que faz o GTM funcionar. Ele carrega o gtm.js,
       que por sua vez injeta um script inline por tag configurada — e esses
       nascem sem nonce. Liberar o host do Google não resolve, porque o
       problema é inline, não origem. Com `strict-dynamic` a confiança passa
       por herança: o que um script confiável carrega também é confiável.
       Navegador que o entende passa a IGNORAR `'self'` e a lista de hosts,
       o que é mais restritivo, não menos — só o nonce e a cadeia a partir
       dele valem. O `'self'` e o host do Google ficam como reserva para
       navegador antigo, que ignora `strict-dynamic`. */
    "script-src 'self' 'unsafe-inline' 'strict-dynamic' https://www.googletagmanager.com",
    /* Os beacons saem por fetch/beacon para estes domínios. Com o
       `connect-src 'self'` de antes, a tag carregava e a medição sumia —
       falha silenciosa, do tipo que só aparece semanas depois num relatório
       vazio. O `clarity.ms` está aqui porque o container também dispara o
       Microsoft Clarity; se você adicionar outra ferramenta no GTM, o
       domínio dela precisa entrar nesta linha. */
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
    /* O `noscript` do GTM e o modo de pré-visualização usam iframe. */
    "frame-src https://www.googletagmanager.com",
  ],
}));

app.use(staticFiles());
app.fsRoutes();
