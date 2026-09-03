/* ═══════════════════════════════════════════════════════════
   Rockfy — comportamento da página
   ═══════════════════════════════════════════════════════════ */

/* ─────────── palco da home: solta o marquee ─────────── */
(function(){
  const faixa=document.querySelector('.stage-track');
  if(!faixa)return;
  /* só começa depois do load: durante o carregamento inicial a animação
     disputaria com a decodificação das imagens */
  const soltar=()=>faixa.classList.add('is-running');
  if(document.readyState==='complete')soltar();
  else addEventListener('load',soltar,{once:true});
})();

/* ─────────── menus suspensos do cabeçalho ─────────── */
(function(){
  const gatilhos=[...document.querySelectorAll('.dd__btn')];
  if(!gatilhos.length)return;

  const painel=b=>document.getElementById(b.getAttribute('aria-controls'));

  const fechar=b=>{
    b.setAttribute('aria-expanded','false');
    const p=painel(b); if(p)p.hidden=true;
  };
  const fecharTodos=exceto=>gatilhos.forEach(b=>{if(b!==exceto)fechar(b)});

  /* Centraliza o painel no gatilho, mas sem deixar vazar da tela: o
     "Recursos" fica à direita e o painel é largo, então centralizar puro
     jogava a borda pra fora da viewport. */
  const posicionar=(b,p)=>{
    p.style.left='0px';
    p.style.transform='none';
    const g=b.getBoundingClientRect();
    const largura=p.offsetWidth;
    const margem=16;
    /* alinha a borda esquerda do painel com a do gatilho; centralizar
       fazia o painel parecer solto, longe do item que o abriu */
    let x=g.left;
    /* nunca passa da margem do conteúdo (a mesma do resto da página) */
    const conteudo=document.querySelector('.screen').getBoundingClientRect();
    const limiteDir=Math.min(innerWidth-margem,conteudo.right);
    x=Math.max(Math.max(margem,conteudo.left),Math.min(x,limiteDir-largura));
    p.style.left=`${x-b.closest('.dd').getBoundingClientRect().left}px`;
  };

  const abrir=b=>{
    fecharTodos(b);
    b.setAttribute('aria-expanded','true');
    const p=painel(b);
    if(p){p.hidden=false;posicionar(b,p)}
  };

  gatilhos.forEach(b=>{
    b.addEventListener('click',e=>{
      e.stopPropagation();
      b.getAttribute('aria-expanded')==='true' ? fechar(b) : abrir(b);
    });
    /* no ponteiro fino o hover abre; no toque, só o clique — senão o
       primeiro toque abriria e o segundo navegaria sem querer */
    if(matchMedia('(hover: hover) and (pointer: fine)').matches){
      const grupo=b.closest('.dd');
      grupo.addEventListener('mouseenter',()=>abrir(b));
      grupo.addEventListener('mouseleave',()=>fechar(b));
    }
  });

  /* clique fora e Esc fecham; Esc devolve o foco ao gatilho */
  document.addEventListener('click',e=>{
    if(!e.target.closest('.dd'))fecharTodos(null);
  });
  addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    const aberto=gatilhos.find(b=>b.getAttribute('aria-expanded')==='true');
    if(aberto){fechar(aberto);aberto.focus()}
  });
  /* sair do painel pelo Tab fecha */
  document.addEventListener('focusin',e=>{
    if(!e.target.closest('.dd'))fecharTodos(null);
  });
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

  const marcar=c=>{
    chips.forEach(x=>x.setAttribute('aria-pressed','false'));
    c.setAttribute('aria-pressed','true');
  };

  chips.forEach(c=>c.addEventListener('click',()=>{
    parar(); pausado=true;          /* clicou: a partir daqui quem manda é a pessoa */
    marcar(c);
    if(c.dataset.hero)show(c.dataset.hero);
  }));

  /* Autoplay dos chips. Mesmos cuidados da faixa de depoimentos: só roda
     com a seção na tela, para no ponteiro e no foco, e não roda se o
     sistema pede menos movimento. Um clique encerra de vez — depois de a
     pessoa escolher um hero, trocar sozinho seria atrapalhar. */
  let atual=chips.findIndex(c=>c.getAttribute('aria-pressed')==='true');
  let pausado=false, visivel=false, relogio=null;
  const semMovimento=matchMedia('(prefers-reduced-motion: reduce)');
  const faixa=chips[0].closest('.chips-wrap')||chips[0].parentElement;

  function passo(){
    for(let i=1;i<=chips.length;i++){
      const c=chips[(atual+i+chips.length)%chips.length];
      if(c.dataset.hero&&show(c.dataset.hero)){
        atual=chips.indexOf(c); marcar(c); return;
      }
    }
  }
  function tocar(){
    parar();
    if(pausado||!visivel||semMovimento.matches)return;
    relogio=setInterval(passo,4500);
  }
  function parar(){ if(relogio){clearInterval(relogio);relogio=null;} }

  if(faixa){
    ['mouseenter','focusin'].forEach(ev=>faixa.addEventListener(ev,()=>{pausado=true;parar()}));
    faixa.addEventListener('mouseleave',()=>{ if(!chips.some(c=>c.dataset.tocado)){pausado=false;tocar()} });
  }
  semMovimento.addEventListener('change',tocar);

  if('IntersectionObserver' in globalThis){
    new IntersectionObserver(e=>{visivel=e[0].isIntersecting;tocar()},{threshold:.35})
      .observe(faixa||chips[0]);
  } else { visivel=true; tocar(); }
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

/* ─────────── faixa de depoimentos ─────────── */
(function(){
  /* O carrossel antigo posicionava cada slide por JavaScript — transform,
     opacity e z-index recalculados a cada troca e a cada resize. A faixa
     nova é rolagem nativa com scroll-snap: aqui só sobra empurrar o trilho
     quando a seta é clicada e acender o ponto certo ao rolar. */
  var faixa=document.getElementById('deckClients');
  if(!faixa)return;
  var trilho=faixa.firstElementChild;
  var pontos=document.getElementById('dotsClients');
  var prev=document.getElementById('prevEmbedded');
  var next=document.getElementById('nextEmbedded');

  function passo(){
    var item=trilho.firstElementChild;
    if(!item)return faixa.clientWidth;
    var gap=parseFloat(getComputedStyle(trilho).columnGap||'0')||0;
    return item.getBoundingClientRect().width+gap;
  }
  function marcar(){
    if(!pontos)return;
    var i=Math.round(faixa.scrollLeft/passo());
    [].forEach.call(pontos.children,function(p,n){p.classList.toggle('is-on',n===i)});
  }
  function anda(dir){faixa.scrollBy({left:dir*passo(),behavior:'smooth'})}

  if(next)next.onclick=function(){anda(1)};
  if(prev)prev.onclick=function(){anda(-1)};
  faixa.addEventListener('scroll',marcar,{passive:true});
  addEventListener('resize',marcar,{passive:true});
  marcar();

  /* Autoplay. Três cuidados que a faixa antiga não tinha:

     • Só roda enquanto a seção está na tela (IntersectionObserver). Girar
       um carrossel que ninguém está vendo é trabalho jogado fora, e no
       celular custa bateria.
     • Para quando o ponteiro entra, quando algo ali recebe foco pelo
       teclado, ou quando a pessoa rola a faixa na mão.
     • Não roda se o sistema pede menos movimento. */
  var pausado=false, visivel=false, relogio=null;
  var semMovimento=matchMedia('(prefers-reduced-motion: reduce)');

  function fim(){
    return faixa.scrollLeft >= faixa.scrollWidth - faixa.clientWidth - 2;
  }
  function tique(){
    if(fim()) faixa.scrollTo({left:0,behavior:'smooth'});
    else anda(1);
  }
  function toca(){
    para();
    if(pausado||!visivel||semMovimento.matches)return;
    relogio=setInterval(tique,5000);
  }
  function para(){ if(relogio){clearInterval(relogio);relogio=null;} }

  ['mouseenter','focusin','pointerdown'].forEach(function(ev){
    faixa.addEventListener(ev,function(){pausado=true;para()});
  });
  ['mouseleave','focusout'].forEach(function(ev){
    faixa.addEventListener(ev,function(){pausado=false;toca()});
  });
  var controles=document.querySelector('.voices__controls');
  if(controles){
    controles.addEventListener('mouseenter',function(){pausado=true;para()});
    controles.addEventListener('mouseleave',function(){pausado=false;toca()});
  }
  semMovimento.addEventListener('change',toca);

  if('IntersectionObserver' in globalThis){
    new IntersectionObserver(function(e){
      visivel=e[0].isIntersecting;
      toca();
    },{threshold:.3}).observe(faixa);
  } else { visivel=true; toca(); }
})();

/* ─────────── planos ─────────── */
(function(){
  const rail=document.getElementById('rail');
  const dots=document.getElementById('plansDots');
  const prev=document.getElementById('plansPrev');
  const next=document.getElementById('plansNext');
  if(!rail||!dots||!prev||!next)return;


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
    /* A captura NÃO acontece aqui. Capturar no `pointerdown` manda todos
       os eventos seguintes para o trilho, e o navegador deixa de entregar
       o `click` ao botão de dentro do card — era isso que impedia o
       popover dos planos de abrir. Ela entra no `pointermove`, quando o
       arrasto começa de verdade. */
  });
  rail.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-startX;
    if(!moved&&Math.abs(dx)>5){
      moved=true;rail.classList.add('is-dragging');
      rail.setPointerCapture(e.pointerId);   /* agora sim: é arrasto */
    }
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

/* ─────────── colagem de renda: número conta de 0 até o valor ─────────── */
(function(){
  const colagens=[...document.querySelectorAll('.rc-collage')];
  if(!colagens.length)return;
  const calmo=matchMedia('(prefers-reduced-motion: reduce)');

  colagens.forEach(c=>{
    const alvo=c.querySelector('[data-counter]');
    if(!alvo)return;
    const valor=Number(alvo.dataset.counter||0);
    const prefixo=alvo.dataset.counterPrefix||'';
    const sufixo=alvo.dataset.counterSuffix||'';
    const casas=Number(alvo.dataset.counterDecimals||0);
    const fmt=n=>prefixo+n.toLocaleString('pt-BR',{minimumFractionDigits:casas,maximumFractionDigits:casas})+sufixo;

    /* sem JS ou com "reduzir movimento" o HTML já traz o valor final */
    if(calmo.matches||!('IntersectionObserver' in window))return;
    c.classList.add('is-ready');

    let rodou=false;
    new IntersectionObserver((es,obs)=>{
      if(!es[0].isIntersecting||rodou)return;
      rodou=true; obs.disconnect();
      c.classList.add('is-animating');
      const dur=1100, t0=performance.now();
      const passo=t=>{
        const p=Math.min((t-t0)/dur,1);
        const eased=1-Math.pow(1-p,3);
        alvo.textContent=fmt(Math.round(valor*eased*Math.pow(10,casas))/Math.pow(10,casas));
        if(p<1)requestAnimationFrame(passo);
        else alvo.textContent=fmt(valor);
      };
      requestAnimationFrame(passo);
    },{threshold:.35}).observe(c);
  });
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
    /* A captura NÃO acontece aqui. Capturar no `pointerdown` manda todos
       os eventos seguintes para o trilho, e o navegador deixa de entregar
       o `click` ao botão de dentro do card — era isso que impedia o
       popover dos planos de abrir. Ela entra no `pointermove`, quando o
       arrasto começa de verdade. */
  });
  rail.addEventListener('pointermove',e=>{
    if(!down)return;
    const dx=e.clientX-startX;
    if(!moved&&Math.abs(dx)>5){
      moved=true;rail.classList.add('is-dragging');
      rail.setPointerCapture(e.pointerId);   /* agora sim: é arrasto */
    }
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

/* Estado de rolagem do cabeçalho (v2). A casca flutuante encolhe o respiro
   de cima; a de vidro ganha fundo desfocado e inverte as cores. As duas
   dependem da mesma classe, então um listener só serve às duas — e nas
   páginas com cabeçalho no fluxo ele nem se registra. */
(function () {
  var topo = document.querySelector(".top--flutuante, .top--vidro");
  if (!topo) return;
  var rolado = false;
  addEventListener("scroll", function () {
    var agora = scrollY > 18;
    if (agora === rolado) return;
    rolado = agora;
    topo.classList.toggle("is-scrolled", agora);
  }, { passive: true });
})();
