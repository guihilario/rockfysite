/* ═══════════════════════════════════════════════════════════
   Rockfy — comportamento da página
   ═══════════════════════════════════════════════════════════ */

/* ─────────── tema ─────────── */
(function(){
  const root=document.documentElement;
  const themeBtn=document.getElementById('themeBtn');
  root.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  if(themeBtn)themeBtn.onclick=()=>root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');
})();

/* ─────────── menu mobile ─────────── */
(function(){
  const btn=document.getElementById('menuBtn');
  const menu=document.getElementById('mobileMenu');
  const pill=document.querySelector('.top .nav');
  const label=document.getElementById('menuLabel');
  if(!btn||!menu||!pill)return;

  const setOpen=open=>{
    menu.hidden=!open;
    pill.classList.toggle('is-open',open);
    btn.setAttribute('aria-expanded',String(open));
    btn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    document.body.classList.toggle('is-locked',open);
    if(label)label.textContent=open?'Fechar':'Menu';
  };

  /* o clique vale na pílula inteira (ícone + rótulo) */
  pill.addEventListener('click',()=>setOpen(menu.hidden));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)setOpen(false)});
  addEventListener('resize',()=>{if(innerWidth>=900&&!menu.hidden)setOpen(false)});
})();

/* ─────────── tooltip flutuante (planos) ─────────── */
(function(){
  const tip=document.createElement('div');
  tip.className='tip';
  tip.setAttribute('role','tooltip');
  document.body.appendChild(tip);
  let current=null;

  const show=el=>{
    const text=el.getAttribute('data-tip');
    if(!text)return;
    current=el;
    el.classList.add('is-on');
    tip.textContent=text;
    tip.classList.add('is-on');
    const r=el.getBoundingClientRect(), t=tip.getBoundingClientRect();
    let left=r.left+r.width/2-t.width/2;
    left=Math.max(12,Math.min(left,innerWidth-t.width-12));
    let top=r.top-t.height-10;
    if(top<12)top=r.bottom+10;              // sem espaço acima → abre embaixo
    tip.style.left=left+'px';
    tip.style.top=top+'px';
  };
  const hide=()=>{
    tip.classList.remove('is-on');
    if(current){current.classList.remove('is-on');current=null}
  };

  const hintOf=e=>e.target instanceof Element?e.target.closest('.hint'):null;
  document.addEventListener('pointerover',e=>{const el=hintOf(e);if(el)show(el)});
  document.addEventListener('pointerout', e=>{if(hintOf(e))hide()});
  document.addEventListener('focusin',    e=>{const el=hintOf(e);if(el)show(el)});
  document.addEventListener('focusout',   e=>{if(hintOf(e))hide()});
  addEventListener('scroll',hide,{passive:true,capture:true});
  addEventListener('resize',hide);
})();

/* ─────────── hero Deploy ─────────── */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  /* a cena aparece duas vezes (topo da página e painel do chip):
     cada pilha cicla os próprios cards, senão uma atropela a outra */
  document.querySelectorAll('.deploy-stack').forEach(stack=>{
    const cards=[...stack.querySelectorAll('.deploy-card')];
    if(!cards.length)return;
    let i=0;
    const tick=()=>{
      cards.forEach(c=>c.classList.remove('is-active'));
      cards[i].classList.add('is-active');
      i=(i+1)%cards.length;
    };
    tick();
    setInterval(tick,2000);
  });
})();

/* ─────────── chips → troca o hero ─────────── */
(function(){
  const chips=[...document.querySelectorAll('.chip')];
  const panels=[...document.querySelectorAll('[data-hero-panel]')];
  if(!chips.length)return;

  /* remove e reinsere o nó para a animação de entrada rodar de novo */
  const replay=el=>{
    const parent=el.parentNode, next=el.nextSibling;
    parent.removeChild(el);
    parent.insertBefore(el,next);
  };

  const show=name=>{
    const alvo=panels.find(p=>p.dataset.heroPanel===name);
    if(!alvo)return false;                 /* chip ainda sem hero: mantém o atual */
    panels.forEach(p=>{if(p!==alvo)p.hidden=true});
    alvo.hidden=false;
    replay(alvo);
    return true;
  };

  chips.forEach(c=>c.addEventListener('click',()=>{
    chips.forEach(x=>x.setAttribute('aria-pressed','false'));
    c.setAttribute('aria-pressed','true');
    if(c.dataset.hero)show(c.dataset.hero);
  }));
})();

/* ─────────── públicos: acordeão que gira sozinho ─────────── */
(function(){
  const row=document.getElementById('audienceRow');
  if(!row)return;
  const cards=[...row.querySelectorAll('.audience-card')];
  if(!cards.length)return;

  const DELAY=3400;
  const calm=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 640px)');
  let active=0, onScreen=false, held=false, timer=null;

  const render=()=>{
    cards.forEach((c,i)=>{
      c.classList.toggle('is-active',i===active);
      c.setAttribute('aria-pressed',String(i===active));
    });
    /* no mobile os cards não abrem lado a lado: o ativo entra por scroll */
    if(!mobile.matches)return;
    const first=cards[0].getBoundingClientRect().width;
    const gap=parseFloat(getComputedStyle(row).gap)||0;
    row.scrollTo({left:active*(first+gap),behavior:calm.matches?'auto':'smooth'});
  };

  const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const play=()=>{
    stop();
    if(!onScreen||held||calm.matches)return;
    timer=setInterval(()=>{active=(active+1)%cards.length;render()},DELAY);
  };

  const focar=i=>{
    if(active===i)return;
    active=i;
    held=!mobile.matches;      /* no mobile o dedo rola; segurar atrapalharia */
    render();
    play();
  };

  cards.forEach((c,i)=>{
    c.addEventListener('mouseenter',()=>focar(i));
    c.addEventListener('focus',()=>focar(i));
    c.addEventListener('click',()=>focar(i));
  });
  row.addEventListener('mouseleave',()=>{held=false;play()});
  row.addEventListener('focusout',e=>{
    if(row.contains(e.relatedTarget))return;
    held=false;play();
  });

  render();
  if(!('IntersectionObserver' in window)){onScreen=true;play();return}
  new IntersectionObserver(es=>{
    onScreen=es[0].isIntersecting;
    onScreen?play():stop();
  },{threshold:.25}).observe(row);
})();

/* ─────────── carrossel de depoimentos ─────────── */
(function(){
  const DATA=[
    {name:'Ariel Monteoliva',  role:'Designer · Calavera',   quote:'Trocamos três dias de estúdio por uma tarde. O catálogo inteiro saiu com a mesma luz.'},
    {name:'Kyono Andre',  role:'Fotográfo · Liv Produtora', quote:'Subimos 240 peças e recebemos as campanhas prontas. A taxa de clique subiu 18%.'},
    {name:'Guilherme Lacerda',  role:'Empresário · Soma Impressões',     quote:'Uso para testar direção antes de fotografar. Chego ao set já sabendo o que quero.'},
    {name:'José Rosan', role:'Advogado · Rosan Empresarial',         quote:'O que era orçamento de produção virou orçamento de mídia. Mudou nossa conta.'},
    {name:'Marcelo Celo',  role:'Gestor de Tráego · reobot Digital',       quote:'Nenhum modelo remarcado, nenhuma diária perdida. A coleção nova sai no mesmo dia.'}
  ];
  const id=x=>document.getElementById(x);
  /* qualquer combinação de decks serve: a seção solta saiu, a embutida ficou */
  const decks=[['deck','dots'],['deckClients','dotsClients']]
    .map(([d,p])=>({deck:id(d),dots:id(p)}))
    .filter(x=>x.deck&&x.dots);
  if(!decks.length)return;
  const setas=[['prev','next'],['prevEmbedded','nextEmbedded']]
    .map(([a,b])=>({prev:id(a),next:id(b)}))
    .filter(x=>x.prev&&x.next);
  const cur=id('cur'), tot=id('tot');

  const BOOK='<svg class="slide__mark" viewBox="0 0 24 24"><path d="M12 6.5S10 4.5 4 4.5v13c6 0 8 2 8 2s2-2 8-2v-13c-6 0-8 2-8 2Z" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 6.5v13" stroke-width="1.5"/></svg>';
  const dotsHTML=DATA.map((_,i)=>`<button data-i="${i}" aria-label="Ir para ${i+1}"></button>`).join('');

  const deckHTML=DATA.map((d,i)=>`
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

  decks.forEach(d=>{
    d.deck.innerHTML=deckHTML;
    d.dots.innerHTML=dotsHTML;
    d.slides=[...d.deck.children];
  });
  if(tot)tot.textContent=String(DATA.length).padStart(2,'0');

  let index=0;
  function renderSlides(items,indicators){
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
    if(indicators)[...indicators.children].forEach((d,i)=>d.classList.toggle('is-on',i===index));
  }
  function render(){
    decks.forEach(d=>renderSlides(d.slides,d.dots));
    if(cur)cur.textContent=String(index+1).padStart(2,'0');
  }
  const go=i=>{index=(i+DATA.length)%DATA.length;render()};

  setas.forEach(({prev,next})=>{
    next.onclick=()=>go(index+1);
    prev.onclick=()=>go(index-1);
  });
  decks.forEach(d=>{
    d.slides.forEach(s=>s.onclick=()=>{if(!s.classList.contains('is-active'))go(+s.dataset.i)});
    [...d.dots.children].forEach(x=>x.onclick=()=>go(+x.dataset.i));
  });
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(index+1);if(e.key==='ArrowLeft')go(index-1)});

  let x0=null;
  decks.forEach(d=>d.deck.addEventListener('pointerdown',e=>x0=e.clientX));
  addEventListener('pointerup',e=>{
    if(x0===null)return;
    const dx=e.clientX-x0; x0=null;
    if(Math.abs(dx)>44)go(index+(dx<0?1:-1));
  });
  addEventListener('resize',render);
  render();

  let timer=setInterval(()=>go(index+1),5000);
  document.querySelectorAll('.voices__controls,.deck').forEach(el=>{
    el.addEventListener('mouseenter',()=>clearInterval(timer));
    el.addEventListener('mouseleave',()=>{clearInterval(timer);timer=setInterval(()=>go(index+1),5000)});
  });
})();

/* ─────────── planos ─────────── */
(function(){
  const PLANS=[
    {tag:'Para começar hoje', name:'Start', price:'R$37',
     note:'Pra quem está começando. Perfeito para seu projeto ou negócio pessoal',
     items:[['[1]','Conta Isolada cPanel'],[null,'1 Domínio'],[null,'Elementor Pro Oficial'],['[3]','Emails Profissionais'],['[1]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',false]]},

    {tag:'Para negócios em crescimento', name:'Pro', price:'R$77',
     note:'Tudo o que você precisa para criar e expandir seu negócio sem se preocupar com infraestrutura.',
     items:[['[2]','Contas Isoladas cPanel'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],['[8]','Emails Profissionais'],['[2]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',false,'Painel de receitas, despesas e cobrança recorrente.']]},

    {tag:'Para agências e estúdios', name:'Studio', price:'R$157', featured:true,
     note:'Cobrado mensalmente, sem fidelidade. Cancele quando quiser.',
     items:[['[8]','Contas Isoladas cPanel'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],['[15]','Emails Profissionais'],['[4]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',true,'Inclui repasse para clientes e relatórios por projeto.']]},

    {tag:'Para operações dedicadas', name:'Scale', price:'R$297',
     note:'Cobrado mensalmente, sem fidelidade. Cancele quando quiser.',
     items:[['[15]','Contas Isoladas cPanel'],[null,'Domínios Ilimitados'],[null,'Elementor Pro Oficial'],['[25]','Emails Profissionais'],['[10]','Deploy de Apps & Sites'],[null,'Gestão & Finanças',true,'Multi-tenant, API aberta e suporte com SLA.']]}
  ];

  const rail=document.getElementById('rail');
  const dots=document.getElementById('plansDots');
  const prev=document.getElementById('plansPrev');
  const next=document.getElementById('plansNext');
  if(!rail||!dots||!prev||!next)return;

  const CHECK='<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

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
            ${hint?`<span class="hint" data-tip="${esc(hint)}" tabindex="0" role="button" aria-label="Saiba mais: ${esc(hint)}">?</span>`:''}
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
    if(!card)return 1;
    return card.getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap||0);
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

/* ─────────── acordeão (FAQ) ─────────── */
(function(){
  const items=[...document.querySelectorAll('.acc__item')];
  items.forEach(item=>{
    const btn=item.querySelector('.acc__btn');
    if(!btn)return;
    btn.onclick=()=>{
      const open=item.classList.contains('is-open');
      items.forEach(i=>{
        i.classList.remove('is-open');
        const b=i.querySelector('.acc__btn');
        if(b)b.setAttribute('aria-expanded','false');
      });
      if(!open){
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded','true');
      }
    };
  });
})();

/* ─────────── posts: arrastar e encaixar ─────────── */
(function(){
  const rail=document.querySelector('.posts');
  const dots=document.getElementById('postDots');
  if(!rail||!dots)return;

  const cards=[...rail.children];
  dots.innerHTML=cards.map((_,i)=>`<button data-i="${i}" aria-label="Post ${i+1}"></button>`).join('');

  const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap||0);
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
