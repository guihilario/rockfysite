/** Hero de wordpress. `oculto` esconde o painel quando ele está no slot
 *  trocável da home; nas páginas de serviço vem sempre visível. */
export function HeroWordpress({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="wp-hero"
      data-hero-panel="wordpress"
      hidden={oculto}
      aria-label="WordPress — modelos e recursos isolados"
    >
      <img
        class="wp-hero__wordmark"
        src="/img/wordpress.svg"
        alt=""
        aria-hidden="true"
        width="1280"
        height="337"
        decoding="async"
        loading={oculto ? "lazy" : "eager"}
      />
      <p class="wp-hero__binary" aria-hidden="true">
        0101010101010101010101010101010101010101
      </p>
      <img
        class="wp-hero__photo"
        src="/img/wordpress.webp"
        alt="Homem sorrindo trabalhando em um café"
        width="360"
        height="456"
        loading="lazy"
        decoding="async"
      />
      <img
        class="wp-hero__elementor"
        src="/img/elementor.svg"
        alt="Elementor"
        width="79"
        height="79"
        loading="lazy"
        decoding="async"
      />
      <span class="wp-hero__pill wp-hero__pill--modelos">
        <img
          src="/img/star.svg"
          alt=""
          aria-hidden="true"
          width="24"
          height="25"
          loading="lazy"
        />
        liberdade
      </span>
      <span class="wp-hero__pill wp-hero__pill--recursos">
        <img
          src="/img/bolt.svg"
          alt=""
          aria-hidden="true"
          width="23"
          height="40"
          loading="lazy"
        />
        recursos isolados
      </span>
    </section>
  );
}
