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
        src="/img/loja.svg"
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
        src="/img/loja.webp"
        alt="Homem trabalhando no notebook"
        width="360"
        height="456"
        decoding="async"
        fetchpriority="low"
      />
      <img
        class="lj-hero__badge"
        src="/img/cart.svg"
        alt="Carrinho"
        width="78"
        height="75"
        decoding="async"
        fetchpriority="low"
      />
      <img
        class="lj-hero__spark"
        src="/img/sparkle.svg"
        alt=""
        aria-hidden="true"
        width="49"
        height="68"
        decoding="async"
        fetchpriority="low"
      />
      <span class="lj-hero__pill lj-hero__pill--loja">
        <img
          src="/img/google.webp"
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
          src="/img/dollar.svg"
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
