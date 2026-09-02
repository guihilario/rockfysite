/**
 * Gera as imagens de compartilhamento (og:image) em static/og/.
 *
 * O card é renderizado no próprio Chrome, com o CSS e a fonte do site, e
 * capturado a 1200×630 — em vez de desenhado à mão num editor. Assim a
 * arte não sai do lugar quando a marca mudar: roda de novo e pronto.
 *
 *   deno run -A tools/og/gerar.js
 *
 * Requer o site em http://localhost:8000 (deno task start) e um Chrome com
 * porta de depuração em 9333. O gabarito é copiado para static/ durante a
 * geração e removido no fim, para não virar uma URL pública.
 */
import {session} from './cdp.js';
const CARDS = [
  ["home",        "Rockfy",              "Bem-vindo <em>à sua nova nuvem</em>"],
  ["planos",      "Planos",              "A partir de <b>R$37</b> por mês"],
  ["deploy",      "Deploy [I.A]",        "Do código ao ar <em>em segundos</em>"],
  ["wordpress",   "Hospedagem",          "WordPress puro, <em>sem trava de construtor</em>"],
  ["elementor",   "Hospedagem de site",  "Elementor Pro <em>original incluso</em>"],
  ["loja",        "Loja digital",        "Pedido no WhatsApp, <em>PIX sem taxa</em>"],
  ["email",       "E-mail profissional", "Seu domínio <em>no endereço</em>"],
  ["blog",        "Blog",                "O que aprendemos <em>cuidando de infraestrutura</em>"],
  ["ajuda",       "Central de ajuda",    "Guias curtos <em>para resolver agora</em>"],
  ["sobre",       "Sobre a Rockfy",      "A nuvem brasileira <em>de quem constrói</em>"],
  ["contato",     "Contato",             "Do outro lado <em>tem gente</em>"],
  ["politicas",   "Transparência",       "Políticas <em>e termos</em>"],
  ["padrao",      "Rockfy",              "Hospedagem, deploy, loja <em>e e-mail</em>"],
];
await Deno.copyFile('tools/og/card.html', 'static/_og-card.html');
const s = await session(1200, 630, false);
await s.goto('http://localhost:8000/_og-card.html');
await new Promise(r=>setTimeout(r,2500));   // deixa a fonte carregar
for (const [arq, eyebrow, titulo] of CARDS) {
  await s.ev(`(()=>{document.getElementById('eyebrow').textContent=${JSON.stringify(eyebrow)};
    document.getElementById('titulo').innerHTML=${JSON.stringify(titulo)};
    return document.fonts.ready.then(()=>1)})()`);
  await new Promise(r=>setTimeout(r,320));
  const p = await s.send('Page.captureScreenshot',{format:'png',
    clip:{x:0,y:0,width:1200,height:630,scale:1}});
  const bytes = Uint8Array.from(atob(p.result.data),c=>c.charCodeAt(0));
  await Deno.writeFile(`static/og/${arq}.png`, bytes);
  console.log(`  ${arq.padEnd(12)} ${(bytes.length/1024).toFixed(0)}KB`);
}
await s.close();
await Deno.remove('static/_og-card.html');
console.log('  gabarito removido de static/');
