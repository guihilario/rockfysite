// Scroll infinito da lista de posts.
//
// A sentinela no fim da tabela é, sem JavaScript, um link normal para a
// próxima página — este script só o transforma em carregamento automático.
// Cada lote vem pronto do servidor (/admin/posts/lote), então o cliente não
// remonta HTML: só move as linhas para dentro do <tbody>.
(function () {
  const tabela = document.getElementById("tabelaPosts");
  const corpo = document.getElementById("corpoPosts");
  const sentinela = document.getElementById("sentinela");
  if (!tabela || !corpo || !sentinela) return;
  if (!("IntersectionObserver" in window)) return; // fica o link

  const q = tabela.dataset.q || "";
  let pagina = 1;
  let temMais = tabela.dataset.temMais === "1";
  let carregando = false;

  const link = sentinela.querySelector("a");
  const rotulo = () => link && (link.textContent = carregando ? "Carregando…" : "Carregar mais");

  async function carregar() {
    if (carregando || !temMais) return;
    carregando = true;
    rotulo();
    try {
      const url = `/admin/posts/lote?page=${pagina + 1}` +
        (q ? `&q=${encodeURIComponent(q)}` : "");
      const r = await fetch(url, { headers: { accept: "text/html" } });
      if (!r.ok) throw new Error(String(r.status));
      const doc = new DOMParser().parseFromString(await r.text(), "text/html");
      const novas = doc.querySelectorAll("tbody tr");
      novas.forEach((tr) => corpo.appendChild(document.importNode(tr, true)));
      pagina += 1;
      temMais = doc.querySelector("table")?.dataset.temMais === "1";
      if (!temMais) sentinela.hidden = true;
    } catch {
      // deixa o link visível: dá pra tentar de novo na mão
      temMais = true;
    } finally {
      carregando = false;
      rotulo();
    }
  }

  link?.addEventListener("click", (e) => {
    e.preventDefault();
    carregar();
  });

  new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) carregar();
  }, { rootMargin: "400px" }).observe(sentinela);
})();
