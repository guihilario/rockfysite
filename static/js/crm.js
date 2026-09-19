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
    const col=perto(e,".crm-coluna");
    if(!col||!card)return zera();
    const etapa=col.dataset.etapaColuna;
    if(!etapa||!card.dataset.id)return zera();
    try{
      const r=await fetch("/mydash/crm/etapa",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({id:card.dataset.id,etapa}),
      });
      if(!r.ok){ console.warn("[crm] etapa não salva: HTTP "+r.status); return zera(); }
      card.dataset.etapa=etapa;
      const alvo=col.querySelector(".crm-coluna-cartoes");
      if(alvo)alvo.appendChild(card);
      col.classList.remove("is-sobre");
      vazios();
      conta(colOrigem);
      conta(col);
    }catch(err){
      console.warn("[crm] etapa não salva",err);
    }
    zera();
  });

  kanban.addEventListener("dragend",zera);
})();