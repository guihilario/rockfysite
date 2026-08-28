/** Hero de elementor. `oculto` esconde o painel quando ele está no slot
 *  trocável da home; nas páginas de serviço vem sempre visível. */
export function HeroElementor({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="em-hero"
      data-hero-panel="elementor"
      hidden={oculto}
      aria-label="Elementor Pro — licença oficial inclusa"
    >
      <img
        class="em-hero__wordmark"
        src="/img/elementor-word.svg"
        alt=""
        aria-hidden="true"
        width="1280"
        height="337"
        decoding="async"
        fetchpriority="low"
      />
      <p class="em-hero__binary" aria-hidden="true">
        0101010101010101010101010101010101010101
      </p>
      <img
        class="em-hero__photo"
        src="/img/image-01.webp"
        alt="Profissional trabalhando em seu site"
        width="600"
        height="400"
        decoding="async"
        fetchpriority="low"
      />
      <img
        class="em-hero__badge"
        src="/img/elementor-badge.svg"
        alt="Elementor"
        width="79"
        height="79"
        decoding="async"
        fetchpriority="low"
      />
      <span class="em-hero__pill em-hero__pill--pro">Elementor Pro</span>
      <span class="em-hero__pill em-hero__pill--mail">
        <img
          src="/img/star.svg"
          alt=""
          aria-hidden="true"
          width="24"
          height="25"
          decoding="async"
          fetchpriority="low"
        />
        licença oficial
      </span>
    </section>
  );
}
