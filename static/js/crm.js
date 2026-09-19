// Interações do CRM do painel.
// Com o script desligado as duas visões continuam funcionando: na lista o
// campo de etapa é um form normal que precisa só do botão "Mover" (escondido
// aqui quando o JS assina embaixo), e o kanban simplesmente não move card —
// o passo delas é o mesmo POST do funil, o código só encurta o caminho.
(()=>{
  document.documentElement.classList.add("js");

  /* Lista: mudou a etapa, dispara o POST do próprio form. A resposta é o
     clique normal do navegador (303 para a mesma visão), então o funil nunca
     dessincroniza. */
  document.addEventListener("change",e=>{
    if(!(e.target instanceof HTMLSelectElement))return;
    const f=e.target.closest("form[data-crm-etapa]");
    if(f&&f.elements.namedItem("etapa")===e.target)f.submit();
  });

  const kanban=document.querySelector("[data-crm-kanban]");
  if(!kanban)return;

  /* Habilita o arrasto dos cards. O SSR não consegue emitir um atributo
     `draggable="true"` utilizável (o Preact serializa o boolean como
     `draggable=""`, que o browser interpreta como "não arrastável") — então
     quem liga o drag é a propriedade do elemento, aqui no cliente. */
  for(const c of kanban.querySelectorAll(".crm-card"))c.draggable=true;

  /* Popover com native popover quando o browser suporta; sem suporte, o
     botão de "Novo lead" vira o link da página de cadastro. */
  const suportaPopover="showPopover" in HTMLElement.prototype;
  if(!suportaPopover){
    const btn=document.querySelector("[popovertarget='popover-novo-lead']");
    if(btn){
      const a=document.createElement("a");
      a.href="/mydash/crm/novo-lead";
      a.className=btn.className;
      a.textContent="Novo lead";
      btn.replaceWith(a);
    }
  }

  /* Card clicado (fora dos links) abre a ficha no popover: o conteúdo vem do
     servidor. Para o popover abrir sem "tela de carregar", a ficha é buscada
     já no roçar o card (250ms) e guardada em cache — o clique então só injeta
     o HTML pronto. Sem hover (touch) e sem cache, a promessa da busca é
     deduplicada e o conteúdo chega na mesma quando pronto. */
  const popFicha=document.querySelector("#popover-ficha");
  const cacheFichas=new Map();
  const baixando=new Map();
  let abrindo="";
  let timerHover=0;

  const erroFicha="<p class='adm-nota crm-pop-carregando'>Não deu para carregar a ficha.</p>";

  function buscarFicha(email){
    let p=baixando.get(email);
    if(!p){
      p=fetch("/mydash/crm/popover?e="+encodeURIComponent(email))
        .then(r=>{
          if(!r.ok)throw new Error("HTTP "+r.status);
          return r.text();
        })
        .then(html=>{
          const corpo=new DOMParser()
            .parseFromString(html,"text/html")
            .querySelector(".crm-popover-corpo");
          if(!corpo)throw new Error("fragmento sem corpo");
          const pronto=corpo.outerHTML;
          cacheFichas.set(email,pronto);
          return pronto;
        })
        .finally(()=>baixando.delete(email));
      baixando.set(email,p);
    }
    return p;
  }

  kanban.addEventListener("pointerenter",e=>{
    const card=e.target instanceof Element?e.target.closest(".crm-card"):null;
    if(!card){clearTimeout(timerHover);return;}
    const email=card.dataset.email;
    if(!email||cacheFichas.has(email)||baixando.has(email))return;
    clearTimeout(timerHover);
    timerHover=setTimeout(()=>{buscarFicha(email).catch(()=>{});},250);
  },true);

  kanban.addEventListener("click",e=>{
    if(e.target instanceof Element&&e.target.closest("a,button"))return;
    const card=e.target instanceof Element?e.target.closest(".crm-card"):null;
    if(!card||!popFicha)return;
    const email=card.dataset.email;
    if(!email)return;
    abrindo=email;
    if(popFicha.showPopover)popFicha.showPopover();
    const pronto=cacheFichas.get(email);
    popFicha.innerHTML=pronto
      ??"<p class='adm-nota crm-pop-carregando'>Carregando…</p>";
    buscarFicha(email)
      .then(corpo=>{
        if(abrindo===email&&popFicha.matches(":popover-open")){
          popFicha.innerHTML=corpo;
        }
      })
      .catch(()=>{
        if(abrindo===email)popFicha.innerHTML=erroFicha;
      });
  });

  const perto=(e,sel)=>e.target instanceof Element?e.target.closest(sel):null;
  let card=null;
  let colOrigem=null;

  const zera=()=>{
    if(card)card.classList.remove("is-arrastando");
    for(const c of kanban.querySelectorAll(".crm-coluna"))c.classList.remove("is-sobre");
    card=null;
    colOrigem=null;
  };

  /* Mostra/esconde o "Solte aqui um lead" conforme a coluna enche. */
  const vazios=()=>{
    for(const col of kanban.querySelectorAll(".crm-coluna")){
      const p=col.querySelector(".crm-coluna-vazia");
      if(p)p.hidden=col.querySelectorAll(".crm-card").length>0;
    }
  };

  const conta=(col)=>{
    const alvo=col&&col.querySelector("[data-conta-etapa]");
    if(alvo)alvo.textContent=String(col.querySelectorAll(".crm-card").length);
  };

  kanban.addEventListener("dragstart",e=>{
    const c=perto(e,".crm-card");
    if(!c)return;
    card=c;
    colOrigem=c.parentElement;
    c.classList.add("is-arrastando");
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("text/plain",c.dataset.id||"");
  });

  kanban.addEventListener("dragover",e=>{
    if(!card)return;
    e.preventDefault();
    const col=perto(e,".crm-coluna");
    if(col)col.classList.add("is-sobre");
  });

  kanban.addEventListener("dragleave",e=>{
    const col=perto(e,".crm-coluna");
    if(col)col.classList.remove("is-sobre");
  });

  kanban.addEventListener("drop",async e=>{
    e.preventDefault();
    /* Congela card/origem agora: o dragend dispara logo depois do drop e o
       zera() dele limparia a variável global antes de a promessa do fetch
       resolver. Com o card capturado no início o movimento nunca trava. */
    const c=card;
    const origem=colOrigem;
    const col=perto(e,".crm-coluna");
    if(!col||!c||!c.dataset.id)return zera();
    const etapa=col.dataset.etapaColuna;
    if(!etapa)return zera();
    const alvo=col.querySelector(".crm-coluna-cartoes");
    if(alvo)alvo.appendChild(c);
    c.dataset.etapa=etapa;
    col.classList.remove("is-sobre");
    vazios();
    conta(origem);
    conta(col);
    const devolve=()=>{
      const volta=origem&&origem.querySelector(".crm-coluna-cartoes");
      if(volta)volta.appendChild(c);
      vazios();
      conta(col);
      conta(origem);
    };
    const email=c.dataset.email;
    const refrescaFicha=()=>{
      /* A etapa mudou: a ficha em cache ficou velha. Descarta e baixa de
         novo em segundo plano — se o popover estiver aberto para esse
         contato, ele é reposto assim que a resposta chegar. */
      if(!email)return;
      cacheFichas.delete(email);
      buscarFicha(email)
        .then(corpo=>{
          if(abrindo===email&&popFicha.matches(":popover-open")){
            popFicha.innerHTML=corpo;
          }
        })
        .catch(()=>{});
    };
    try{
      const r=await fetch("/mydash/crm/etapa",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({id:c.dataset.id,etapa}),
      });
      if(!r.ok){ console.warn("[crm] etapa não salva: HTTP "+r.status); devolve(); }
      else refrescaFicha();
    }catch(err){
      console.warn("[crm] etapa não salva",err);
      devolve();
    }
    zera();
  });

  kanban.addEventListener("dragend",zera);
})();