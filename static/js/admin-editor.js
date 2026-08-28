// Liga o Quill (vendorizado em /js/vendor/quill.js) ao textarea oculto
// #content. Sem isso (JS desabilitado/falhou), o form ainda funciona: o
// textarea começa preenchido com o HTML atual e é enviado normalmente.
(function () {
  const editorEl = document.getElementById("editor");
  const hidden = document.getElementById("content");
  if (!editorEl || !hidden || typeof Quill === "undefined") return;

  const form = hidden.closest("form");

  const quill = new Quill(editorEl, {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block", "link", "image"],
        ["clean"],
      ],
    },
  });

  if (hidden.value.trim()) {
    quill.clipboard.dangerouslyPasteHTML(hidden.value);
  }
  hidden.classList.add("visually-hidden");

  // Sincroniza a cada mudança, não só no submit: a validação nativa do
  // HTML5 (o `required` do textarea) roda ANTES do evento "submit" — se só
  // sincronizássemos ali, o browser veria o textarea vazio e bloquearia o
  // envio mesmo com conteúdo real digitado no Quill.
  const sync = () => {
    hidden.value = quill.root.innerHTML;
  };
  sync();
  quill.on("text-change", sync);
  form?.addEventListener("submit", sync);
})();
