(function(){

/* tema */
const root=document.documentElement;
root.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
themeBtn.onclick=()=>root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');

/* hero Deploy */
const deployCards=[...document.querySelectorAll('.deploy-card')];
if(deployCards.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let deployIndex=0;
  const deployTick=()=>{deployCards.forEach(card=>card.classList.remove('is-active'));deployCards[deployIndex].classList.add('is-active');deployIndex=(deployIndex+1)%deployCards.length};
  deployTick();
  setInterval(deployTick,2000);
}

/* chips */
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{
  const on=c.getAttribute('aria-pressed')==='true';
  document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));
  c.setAttribute('aria-pressed',on?'false':'true');
});

/* ─────────── carrossel de depoimentos ─────────── */
const DATA=[
  {name:'Marina Alves',  role:'Diretora de arte · Cápsula',   quote:'Trocamos três dias de estúdio por uma tarde. O catálogo inteiro saiu com a mesma luz.'},
  {name:'Rafael Costa',  role:'Head de e-commerce · Marévia', quote:'Subimos 240 peças e recebemos as campanhas prontas. A taxa de clique subiu 18%.'},
  {name:'Helena Prado',  role:'Fotógrafa · Ateliê Norte',     quote:'Uso para testar direção antes de fotografar. Chego ao set já sabendo o que quero.'},
  {name:'Bruno Tavares', role:'Produtor · Pixelaria',         quote:'O que era orçamento de produção virou orçamento de mídia. Mudou nossa conta.'},
  {name:'Lucas Ferraz',  role:'Fundador · Lab Interno',       quote:'Nenhum modelo remarcado, nenhuma diária perdida. A coleção nova sai no mesmo dia.'}
];
const deck=document.getElementById('deck'), dots=document.getElementById('dots');
const BOOK='<svg class="slide__mark" viewBox="0 0 24 24"><path d="M12 6.5S10 4.5 4 4.5v13c6 0 8 2 8 2s2-2 8-2v-13c-6 0-8 2-8 2Z" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 6.5v13" stroke-width="1.5"/></svg>';

deck.innerHTML=DATA.map((d,i)=>`
  <article class="slide" data-i="${i}" aria-label="Depoimento ${i+1} de ${DATA.length}">
    <div class="slide__photo">
      <div class="slide__box">
        ${BOOK}
        <div class="slide__name">${d.name}</div>
        <div class="slide__role">${d.role}</div>
        <div class="slide__rule"></div>
        <div class="slide__grid">
          <span class="slide__idx">[ ${String(i+1).padStart(2,'0')} ]</span>
          <p class="slide__quote">${d.quote}</p>
        </div>
      </div>
    </div>
  </article>`).join('');
dots.innerHTML=DATA.map((_,i)=>`<button data-i="${i}" aria-label="Ir para ${i+1}"></button>`).join('');
document.getElementById('tot').textContent=String(DATA.length).padStart(2,'0');

const slides=[...deck.children];
const clientDeck=document.getElementById('deckClients'), clientDots=document.getElementById('dotsClients');
clientDeck.innerHTML=deck.innerHTML;
clientDots.innerHTML=DATA.map((_,i)=>`<button data-i="${i}" aria-label="Ir para ${i+1}"></button>`).join('');
const clientSlides=[...clientDeck.children];
let index=0;
function renderSlides(items, indicators){
  const w=innerWidth, wide=w>=900, xtra=w>=1280?62:(wide?58:52), n=DATA.length;
  items.forEach((s,i)=>{
    let o=i-index;
    if(o>n/2)o-=n; if(o<-n/2)o+=n;
    const a=Math.abs(o);
    s.style.transform=`translate(-50%,-50%) translateX(${o*xtra}%) translateY(${a*(wide?26:18)}px) scale(${a===0?1:(a===1?.8:.66)})`;
    s.style.opacity=a===0?1:(a===1?.5:0);
    s.style.zIndex=10-a;
    s.style.pointerEvents=a>1?'none':'auto';
    s.classList.toggle('is-active',a===0);
  });
  [...indicators.children].forEach((d,i)=>d.classList.toggle('is-on',i===index));
}
function render(){
  renderSlides(slides,dots);
  renderSlides(clientSlides,clientDots);
  document.getElementById('cur').textContent=String(index+1).padStart(2,'0');
}
const go=i=>{index=(i+DATA.length)%DATA.length;render()};
next.onclick=()=>go(index+1);
prev.onclick=()=>go(index-1);
nextEmbedded.onclick=()=>go(index+1);
prevEmbedded.onclick=()=>go(index-1);
slides.forEach(s=>s.onclick=()=>{if(!s.classList.contains('is-active'))go(+s.dataset.i)});
[...dots.children].forEach(d=>d.onclick=()=>go(+d.dataset.i));
 [...clientDots.children].forEach(d=>d.onclick=()=>go(+d.dataset.i));
addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(index+1);if(e.key==='ArrowLeft')go(index-1)});
let x0=null;
deck.addEventListener('pointerdown',e=>x0=e.clientX);
addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>44)go(index+(dx<0?1:-1))});
addEventListener('resize',render);
render();
let voicesTimer=setInterval(()=>go(index+1),5000);
document.querySelectorAll('.voices__controls,.deck').forEach(element=>{
  element.addEventListener('mouseenter',()=>clearInterval(voicesTimer));
  element.addEventListener('mouseleave',()=>{clearInterval(voicesTimer);voicesTimer=setInterval(()=>go(index+1),5000)});
});

})();
(function(){

const root=document.documentElement;
root.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
themeBtn.onclick=()=>root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');

/* ─────────── planos ─────────── */
const PLANS=[
  {tag:'Para começar hoje', name:'Start', price:'R$57',
   note:'Pra quem está começando. Perfeito para seu projeto ou negócio pessoal',
   items:[['[1]','Conta Isolada cPanel'],[null,'1 Domínio'],[null,'Elementor Pro Oficial'],[null,'2GB SSD / conta'],[null,'1GB Ram / conta'],['[3]','Emails Profissionais'],['[1]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',false]]},

  {tag:'Para negócios em crescimento', name:'Pro', price:'R$157', featured:true,
   note:'Tudo o que você precisa para criar e expandir seu negócio sem se preocupar com infraestrutura.',
   items:[['[5]','Contas Isoladas cPanel'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],[null,'5GB SSD / conta'],[null,'4GB Ram / conta'],['[15]','Emails Profissionais'],['[5]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',true,'Painel de receitas, despesas e cobrança recorrente.']]},

  {tag:'Para agências e estúdios', name:'Studio', price:'R$349',
   note:'Cobrado mensalmente, sem fidelidade. Cancele quando quiser.',
   items:[['[15]','Contas Isoladas cPanel'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],[null,'20GB SSD / conta'],[null,'8GB Ram / conta'],['[50]','Emails Profissionais'],['[20]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',true,'Inclui repasse para clientes e relatórios por projeto.']]},

  {tag:'Para operações dedicadas', name:'Scale', price:'R$899',
   note:'Cobrado mensalmente, sem fidelidade. Cancele quando quiser.',
   items:[[null,'Contas Isoladas Ilimitadas'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],[null,'100GB SSD / conta'],[null,'16GB Ram / conta'],[null,'Emails Ilimitados'],[null,'Deploy Ilimitado'],[null,'Gestão & Finanças',true,'Multi-tenant, API aberta e suporte com SLA.']]}
];

const CHECK='<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const rail=document.getElementById('rail'), dots=document.getElementById('dots');
const prevButton=document.getElementById('prev'), nextButton=document.getElementById('next');

rail.innerHTML=PLANS.map(p=>`
  <article class="plan${p.featured?' plan--featured':''}">
    <span class="plan__tag">${p.tag}</span>
    <h3 class="plan__name">${p.name}</h3>
    <div class="plan__price"><b>${p.price}</b><span>/ mês</span></div>
    <p class="plan__note">${p.note}</p>
    <div class="plan__rule"></div>
    <ul class="plan__list">
      ${p.items.map(([n,label,on,hint])=>`
        <li class="plan__item${on===false?' is-off':''}">
          ${CHECK}
          <span>${n?`<span class="num">${n}</span> `:''}${label}</span>
          ${hint?`<span class="hint" title="${hint}">?</span>`:''}
        </li>`).join('')}
    </ul>
    <button class="plan__cta">
      Começar
      <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </article>`).join('');

dots.innerHTML=PLANS.map((_,i)=>`<button data-i="${i}" aria-label="Plano ${i+1}"></button>`).join('');

/* ─── navegação ─── */
const step=()=>{
  const card=rail.querySelector('.plan');
  return card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap);
};
const maxScroll=()=>rail.scrollWidth-rail.clientWidth;

function sync(){
  const i=Math.round(rail.scrollLeft/step());
  [...dots.children].forEach((d,k)=>d.classList.toggle('is-on',k===i));
  prev.disabled=rail.scrollLeft<=2;
  next.disabled=rail.scrollLeft>=maxScroll()-2;
}
const goTo=i=>rail.scrollTo({left:i*step(),behavior:'smooth'});
next.onclick=()=>rail.scrollBy({left:step(),behavior:'smooth'});
prev.onclick=()=>rail.scrollBy({left:-step(),behavior:'smooth'});
[...dots.children].forEach(d=>d.onclick=()=>goTo(+d.dataset.i));
rail.addEventListener('scroll',sync,{passive:true});
addEventListener('resize',sync);

/* ─── arrastar ─── */
let down=false,startX=0,startLeft=0,moved=false;
rail.addEventListener('pointerdown',e=>{
  down=true;moved=false;startX=e.clientX;startLeft=rail.scrollLeft;
  rail.setPointerCapture(e.pointerId);
});
rail.addEventListener('pointermove',e=>{
  if(!down)return;
  const dx=e.clientX-startX;
  if(!moved&&Math.abs(dx)>5){moved=true;rail.classList.add('is-dragging')}
  if(moved)rail.scrollLeft=startLeft-dx;
});
const release=()=>{
  if(!down)return; down=false;
  if(moved){
    rail.classList.remove('is-dragging');
    goTo(Math.round(rail.scrollLeft/step()));   // encaixa no card mais próximo
  }
};
rail.addEventListener('pointerup',release);
rail.addEventListener('pointercancel',release);

sync();

})();
(function(){

const root=document.documentElement;
root.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
themeBtn.onclick=()=>root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');

/* acordeão — abrir um fecha os outros */
const items=[...document.querySelectorAll('.acc__item')];
items.forEach(item=>{
  const btn=item.querySelector('.acc__btn');
  btn.onclick=()=>{
    const open=item.classList.contains('is-open');
    items.forEach(i=>{
      i.classList.remove('is-open');
      i.querySelector('.acc__btn').setAttribute('aria-expanded','false');
    });
    if(!open){
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded','true');
    }
  };
});

/* ─── posts: arrastar e encaixar ─── */
(function(){
  const rail=document.querySelector('.posts');
  const dots=document.getElementById('postDots');
  if(!rail||!dots)return;

  const cards=[...rail.children];
  dots.innerHTML=cards.map((_,i)=>`<button data-i="${i}" aria-label="Post ${i+1}"></button>`).join('');

  const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap);
  const sync=()=>{
    const i=Math.round(rail.scrollLeft/step());
    [...dots.children].forEach((d,k)=>d.classList.toggle('is-on',k===i));
  };
  const goTo=i=>rail.scrollTo({left:i*step(),behavior:'smooth'});
  [...dots.children].forEach(d=>d.onclick=()=>goTo(+d.dataset.i));
  rail.addEventListener('scroll',sync,{passive:true});
  addEventListener('resize',sync);

  let down=false,startX=0,startLeft=0,moved=false;
  rail.addEventListener('pointerdown',e=>{
    if(innerWidth>=900)return;
    down=true;moved=false;startX=e.clientX;startLeft=rail.scrollLeft;
    rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-startX;
    if(!moved&&Math.abs(dx)>5){moved=true;rail.classList.add('is-dragging')}
    if(moved)rail.scrollLeft=startLeft-dx;
  });
  const release=()=>{
    if(!down)return; down=false;
    if(moved){rail.classList.remove('is-dragging');goTo(Math.round(rail.scrollLeft/step()))}
  };
  rail.addEventListener('pointerup',release);
  rail.addEventListener('pointercancel',release);
  /* impede que o arrasto vire clique no link */
  cards.forEach(c=>c.addEventListener('click',e=>{if(moved)e.preventDefault()}));

  sync();
})();

})();