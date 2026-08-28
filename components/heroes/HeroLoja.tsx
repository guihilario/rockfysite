/** Hero de loja. `oculto` esconde o painel quando ele está no slot
 *  trocável da home; nas páginas de serviço vem sempre visível. */
export function HeroLoja({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="lj-hero"
      data-hero-panel="loja"
      hidden={oculto}
      aria-label="Loja digital — novo pedido"
    >
      <img
        class="lj-hero__wordmark"
        src="/lj-assets/loja.svg"
        alt=""
        aria-hidden="true"
        width="1280"
        height="337"
        decoding="async"
        fetchpriority="low"
      />
      <p class="lj-hero__binary" aria-hidden="true">
        0101010101010101010101010101010101010101
      </p>
      <img
        class="lj-hero__photo"
        src="/lj-assets/loja.webp"
        alt="Homem trabalhando no notebook"
        width="360"
        height="456"
        decoding="async"
        fetchpriority="low"
      />
      <img
        class="lj-hero__badge"
        src="/lj-assets/cart.svg"
        alt="Carrinho"
        width="78"
        height="75"
        decoding="async"
        fetchpriority="low"
      />
      <img
        class="lj-hero__spark"
        src="/lj-assets/sparkle.svg"
        alt=""
        aria-hidden="true"
        width="49"
        height="68"
        decoding="async"
        fetchpriority="low"
      />
      <span class="lj-hero__pill lj-hero__pill--loja">
        <img
          src="/lj-assets/google.webp"
          alt=""
          aria-hidden="true"
          width="125"
          height="128"
          decoding="async"
          fetchpriority="low"
        />
        boné street
      </span>
      <span class="lj-hero__pill lj-hero__pill--pedido">
        <img
          src="/lj-assets/dollar.svg"
          alt=""
          aria-hidden="true"
          width="16"
          height="26"
          decoding="async"
          fetchpriority="low"
        />
        novo pedido
      </span>
    </section>
  );
}
