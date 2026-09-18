/* ═══════════════════════════════════════════════════════════
   Rockfy — máscaras e validação de telefone, CPF/CNPJ e CEP
   ═══════════════════════════════════════════════════════════
   Console do core/formata.ts: a regra é a mesma dos dois lados, só que aqui
   ela roda enquanto o usuário digita. O servidor continua validando tudo de
   novo no POST (quem posta direto não passa pela UI) — este arquivo existe
   para o formulário não aceitar lixo antes de enviar.

   O que ele faz por conta própria:
   - `data-mascara="telefone|documento|cep"` formata na hora de digitar;
   - `data-cep` busca o endereço na ViaCEP e preenche logradouro, cidade e
     UF (e o cursor para no campo indicado em `data-cep-foco`);
   - a validação corre no "blur" e usa a API de `setCustomValidity`, então o
     passo fecha pelo mesmo `checkValidity` do wizard do checkout.

   Para reusar em outro formulário basta expor os métodos em
   `window.RockfyFormata` — atrelar no seu elemento com `.atrelar(raiz)`. */

(function(){
  const digitos=v=>String(v??'').replace(/\D/g,'');

  /* ─────────── formatação ─────────── */
  const mascaraTelefone=v=>{
    const d=digitos(v).slice(0,11);
    if(d.length<=2)return d.length?`(${d}`:'';
    if(d.length<=6)return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if(d.length<=10)return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const mascaraDocumento=v=>{
    const d=digitos(v).slice(0,14);
    if(d.length<=11)return d
      .replace(/^(\d{3})(\d)/,'$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/,'$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3-$4');
    return d
      .replace(/^(\d{2})(\d)/,'$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/,'$1.$2.$3/$4')
      .replace(/(\d{4})(\d)/,'$1-$2');
  };

  const mascaraCep=v=>{
    const d=digitos(v).slice(0,8);
    return d.length<=5?d:`${d.slice(0,5)}-${d.slice(5)}`;
  };

  /* ─────────── validação (espelho do core/formata.ts) ─────────── */
  const telefoneValido=v=>{
    const d=digitos(v);
    return d.length===10||d.length===11;
  };

  const cepValido=v=>digitos(v).length===8;

  const todosIguais=d=>/^(\d)\1+$/.test(d);

  const digitoVerificador=(base,pesos)=>{
    const soma=pesos.reduce((acc,peso,i)=>acc+peso*Number(base[i]),0);
    const resto=soma%11;
    return resto<2?0:11-resto;
  };

  const cpfValido=v=>{
    const d=digitos(v);
    if(d.length!==11||todosIguais(d))return false;
    return digitoVerificador(d.slice(0,9),[10,9,8,7,6,5,4,3,2])===Number(d[9])&&
      digitoVerificador(d.slice(0,10),[11,10,9,8,7,6,5,4,3,2])===Number(d[10]);
  };

  const cnpjValido=v=>{
    const d=digitos(v);
    if(d.length!==14||todosIguais(d))return false;
    return digitoVerificador(d.slice(0,12),[5,4,3,2,9,8,7,6,5,4,3,2])===Number(d[12])&&
      digitoVerificador(d.slice(0,13),[6,5,4,3,2,9,8,7,6,5,4,3,2])===Number(d[13]);
  };

  const documentoValido=v=>{
    const d=digitos(v);
    if(d.length===11)return cpfValido(d);
    if(d.length===14)return cnpjValido(d);
    return false;
  };

  /* ─────────── ViaCEP ─────────── */
  const buscarCep=async cep=>{
    try{
      const r=await fetch(`https://viacep.com.br/ws/${digitos(cep)}/json/`);
      if(!r.ok)return null;
      const js=await r.json();
      return js.erro?null:js;
    }catch{ return null; }
  };

  /* ─────────── amarrar nos campos ─────────── */
  /* São duas coisas amarradas num input: máscara/validação (`data-mascara`)
     e preenchimento por CEP (`data-cep`). O mesmo elemento pode ter as duas
     (o campo de CEP usa). A Set evita atrelar de novo ao chamar `.atrelar`
     duas vezes sobre o mesmo nó. */
  const atrelados=new Set();

  /* Mantém o cursor no lugar certo depois da máscara: conta quantos dígitos
     havia antes do cursor e posiciona o novo cursor após o mesmo nº de
     dígito no texto formatado. */
  const posDigito=(txt,n)=>{
    let vistos=0;
    for(let i=0;i<txt.length;i++){
      if(/\d/.test(txt[i])&&++vistos===n)return i+1;
    }
    return txt.length;
  };

  const atrelarMascara=inp=>{
    const tipo=inp.getAttribute('data-mascara');
    const aplica=tipo==='telefone'?mascaraTelefone:tipo==='documento'?mascaraDocumento:mascaraCep;
    const ok=tipo==='telefone'?telefoneValido:tipo==='documento'?documentoValido:cepValido;
    const msg=tipo==='telefone'
      ?'Informe o telefone completo, com DDD.'
      :tipo==='documento'
        ?'CPF ou CNPJ incompleto ou inválido.'
        :'CEP incompleto.';

    inp.addEventListener('input',()=>{
      const novA=aplica(inp.value);
      if(novA===inp.value){ inp.setCustomValidity(''); return; }
      const antes=digitos(inp.value.slice(0,inp.selectionStart)).length;
      inp.value=novA;
      const p=posDigito(novA,antes+1);
      inp.setSelectionRange(p,p);
    });
    /* Valida no blur para não atazanar enquanto digita. `setCustomValidity`
       segura o `checkValidity` do passo: campo errado não deixa avançar. */
    inp.addEventListener('blur',()=>{
      if(digitos(inp.value).length===0)inp.setCustomValidity('');
      else if(!ok(inp.value))inp.setCustomValidity(msg);
      else inp.setCustomValidity('');
    });
  };

  const atrelarCep=inp=>{
    const forma=inp.form;
    if(!forma)return;
    const campo=nome=>forma.elements.namedItem(nome);

    let timer;
    inp.addEventListener('input',()=>{
      if(digitos(inp.value).length!==8)return;
      clearTimeout(timer);
      timer=setTimeout(async()=>{
        const cep=await buscarCep(inp.value);
        if(!cep)return;
        const endereco=campo(inp.getAttribute('data-cep-preenche'));
        const cidade=campo(inp.getAttribute('data-cep-cidade'));
        const uf=campo(inp.getAttribute('data-cep-uf'));
        const foco=campo(inp.getAttribute('data-cep-foco'));
        if(endereco)endereco.value=cep.logradouro;
        if(cidade)cidade.value=cep.localidade;
        if(uf)uf.value=cep.uf;
        /* Cursor para onde o preenchimento passou o bastão: o número. */
        if(foco)foco.focus();
      },300);
    });
  };

  const atrelar=raiz=>{
    raiz.querySelectorAll('input[data-mascara]').forEach(inp=>{
      if(atrelados.has(inp))return;
      atrelados.add(inp);
      atrelarMascara(inp);
    });
    raiz.querySelectorAll('input[data-cep]').forEach(inp=>{
      if(atrelados.has(inp))return;
      atrelados.add(inp);
      atrelarCep(inp);
    });
  };

  /* API pública para reuso em outros formulários. */
  globalThis.RockfyFormata={
    mascaraTelefone, mascaraDocumento, mascaraCep,
    telefoneValido, cpfValido, cnpjValido, documentoValido, cepValido,
    atrelar,
  };

  /* Auto-atrela a página atual. Com `defer` o DOM já está pronto para
     perguntar; o arquivo só é carregado onde há formulário com máscara. */
  atrelar(document);
})();