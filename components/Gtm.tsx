/**
 * Container do Google Tag Manager.
 *
 * O snippet não é o padrão que o GTM entrega: aquele funciona em site sem
 * CSP — era o caso da versão anterior deste site — e aqui seria bloqueado.
 * Duas coisas o tornam compatível:
 *
 * 1. O Fresh já injeta `nonce` em todo <script> que renderiza, então o
 *    inline abaixo passa sozinho.
 * 2. O próprio inline cria um segundo <script> para baixar o `gtm.js`, e
 *    esse nasceria sem nonce. A linha que lê `[nonce]` do documento e o
 *    copia para o elemento novo é a variante documentada pelo Google para
 *    CSP — sem ela o container carrega no navegador do desenvolvedor (que
 *    costuma ignorar CSP em localhost) e falha em produção, calado.
 *
 * O `noscript` fica fora daqui, no fim do body: iframe não é script e
 * depende de `frame-src`, não de `script-src`.
 */
export const GTM_ID = "GTM-NMPCPGD4";

export function Gtm() {
  const snippet =
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
    `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';` +
    `var n=d.querySelector('script[nonce]');if(n){j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'))}` +
    `j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
    `f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${GTM_ID}');`;
  return <script dangerouslySetInnerHTML={{ __html: snippet }} />;
}

/** O par sem JavaScript. Precisa de `frame-src` liberado na CSP. */
export function GtmNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style="display:none;visibility:hidden"
        title="Google Tag Manager"
      >
      </iframe>
    </noscript>
  );
}
