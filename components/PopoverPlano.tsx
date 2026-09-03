import { site } from "@/data/site.ts";

/**
 * O formulário que abre ao clicar no botão de um plano.
 *
 * Usa o popover nativo do HTML: `popovertarget` no botão e o atributo
 * `popover` aqui. Abrir, fechar, fechar no Esc e fechar clicando fora são
 * do navegador — nada disso precisa de script.
 *
 * O envio também não. É um `form` com `method="POST"`: o servidor grava, e
 * responde com um redirect para o WhatsApp. Com o JavaScript bloqueado o
 * fluxo funciona igual, o que importa numa peça que é a porta de entrada
 * comercial do site.
 *
 * Um popover por plano, em vez de um só compartilhado: assim o campo com o
 * nome do plano já vem preenchido no HTML, sem script para trocá-lo.
 */
export function PopoverPlano(
  { id, plano, rota }: { id: string; plano: string; rota: string },
) {
  return (
    <div id={id} popover="auto" class="lead">
      <form class="lead__forma" method="POST" action="/lead">
        <input type="hidden" name="plan" value={plano} />
        <input type="hidden" name="source" value={rota} />

        <p class="lead__chapeu">Plano {plano}</p>
        <h2 class="lead__titulo">Falta pouco</h2>
        <p class="lead__lede">
          Deixe seu contato e a conversa continua no WhatsApp, com uma pessoa do
          outro lado.
        </p>

        <label class="lead__campo">
          <span>Nome</span>
          <input
            name="name"
            type="text"
            required
            autocomplete="name"
            maxLength={120}
          />
        </label>
        <label class="lead__campo">
          <span>E-mail</span>
          <input
            name="email"
            type="email"
            required
            autocomplete="email"
            maxLength={160}
          />
        </label>
        <label class="lead__campo">
          <span>Telefone</span>
          <input
            name="phone"
            type="tel"
            required
            autocomplete="tel"
            inputMode="tel"
            maxLength={40}
            placeholder="(11) 90000-0000"
          />
        </label>

        <button type="submit" class="lead__enviar">Continuar</button>

        {
          /* Dado pessoal coletado pede finalidade declarada — é o mínimo que
            a LGPD espera, e a política já está publicada. */
        }
        <p class="lead__aviso">
          Usamos seus dados só para falar com você sobre este plano. Veja a{" "}
          <a href="/politicas#privacidade">Política de Privacidade</a>.
        </p>

        <button
          type="button"
          class="lead__fechar"
          popovertarget={id}
          popovertargetaction="hide"
          aria-label="Fechar"
        >
          ×
        </button>
      </form>
    </div>
  );
}

/** O link do WhatsApp com a mensagem já montada. */
export function linkWhatsApp(
  { name, plan }: { name: string; plan?: string | null },
): string {
  const texto = plan
    ? `Olá! Sou ${name} e quero saber mais sobre o plano ${plan} da Rockfy.`
    : `Olá! Sou ${name} e quero saber mais sobre os planos da Rockfy.`;
  const numero = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
