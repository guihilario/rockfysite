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
        loading={oculto ? "lazy" : "eager"}
      />
      <p class="em-hero__binary" aria-hidden="true">
        0101010101010101010101010101010101010101
      </p>
      {
        /* Dimensões reais do arquivo: estavam declaradas como 600x400, uma
          proporção que a imagem nunca teve. O CSS depende delas para não
          recortar as laterais. */
      }
      <img
        class="em-hero__photo"
        src="/img/hospedagem-de-site.webp"
        alt="Profissional trabalhando em seu site"
        width="429"
        height="448"
        decoding="async"
        fetchpriority="low"
        loading={oculto ? "lazy" : "eager"}
      />
      <img
        class="em-hero__badge"
        src="/img/elementor-badge.svg"
        alt="Elementor"
        width="79"
        height="79"
        decoding="async"
        fetchpriority="low"
        loading={oculto ? "lazy" : "eager"}
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
          loading={oculto ? "lazy" : "eager"}
        />
        licença oficial
      </span>
    </section>
  );
}
