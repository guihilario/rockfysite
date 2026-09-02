// Mini-driver CDP: abre uma aba, aplica viewport, executa expressões JS.
export async function session(width,height,mobile=false){
  const t=await (await fetch('http://localhost:9333/json/new?about:blank',{method:'PUT'})).json();
  const ws=new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r=>ws.onopen=r);
  let id=0; const pend=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}};
  const send=(method,params={})=>new Promise(res=>{const i=++id;pend.set(i,res);ws.send(JSON.stringify({id:i,method,params}))});
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  const goto=async url=>{
    await send('Page.navigate',{url});
    for(let i=0;i<60;i++){
      const r=await send('Runtime.evaluate',{expression:'document.readyState'});
      if(r.result?.result?.value==='complete')break;
      await new Promise(r=>setTimeout(r,120));
    }
    await new Promise(r=>setTimeout(r,450));
  };
  const ev=async expr=>{
    const r=await send('Runtime.evaluate',{expression:`(()=>{try{return JSON.stringify(${expr})}catch(e){return JSON.stringify('ERRO: '+e.message)}})()`,awaitPromise:true});
    const v=r.result?.result?.value;
    return v===undefined?undefined:JSON.parse(v);
  };
  const close=async()=>{ws.close();await fetch(`http://localhost:9333/json/close/${t.id}`)};
  return {goto,ev,close,send};
}
