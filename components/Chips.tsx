/** A faixa de chips da home. Cada um troca o hero do slot (ver scripts.js);
 *  `data-hero` casa com o `data-hero-panel` do painel correspondente. */
export function Chips() {
  return (
    <div class="chips-wrap">
      <div class="chips">
        <button
          type="button"
          class="chip"
          data-hero="elementor"
          aria-pressed="false"
          aria-controls="heroSlot"
        >
          Hospedagem de Site
        </button>
        <button
          type="button"
          class="chip"
          data-hero="deploy"
          aria-pressed="false"
          aria-controls="heroSlot"
        >
          Deploy de Apps [I.A]
        </button>
        <button
          type="button"
          class="chip"
          data-hero="wordpress"
          aria-pressed="true"
          aria-controls="heroSlot"
        >
          Hospedagem Wordpress
        </button>
        <button
          type="button"
          class="chip"
          data-hero="loja"
          aria-pressed="false"
          aria-controls="heroSlot"
        >
          Loja digital
        </button>
        <button
          type="button"
          class="chip"
          data-hero="email"
          aria-pressed="false"
          aria-controls="heroSlot"
        >
          Email Comercial
        </button>
      </div>
      <span class="fade l"></span>
      <span class="fade r"></span>
    </div>
  );
}
