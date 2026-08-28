// Confirmação antes de ações destrutivas. Fica aqui em vez de `onsubmit`
// inline: sem JS o form ainda envia, e não há script embutido no HTML.
document.addEventListener("submit", (e) => {
  const form = e.target;
  const msg = form instanceof HTMLFormElement &&
    form.getAttribute("data-confirmar");
  if (msg && !confirm(msg)) e.preventDefault();
});
