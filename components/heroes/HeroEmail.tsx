/** Hero de email. `oculto` esconde o painel quando ele está no slot
 *  trocável da home; nas páginas de serviço vem sempre visível. */
export function HeroEmail({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="em-hero"
      data-hero-panel="email"
      hidden={oculto}
      aria-label="E-mail profissional — emailPro"
    >
      <img
        class="em-hero__wordmark"
        src="/img/email.svg"
        alt=""
        aria-hidden="true"
        width="1076"
        height="372"
        decoding="async"
        fetchpriority="low"
        loading={oculto ? "lazy" : "eager"}
      />
      <p class="em-hero__binary" aria-hidden="true">
        0101010101010101010101010101010101010101
      </p>
      <img
        class="em-hero__photo"
        src="/img/email.webp"
        alt="Mulher sorrindo ao ar livre"
        width="360"
        height="456"
        decoding="async"
        fetchpriority="low"
        loading={oculto ? "lazy" : "eager"}
      />
      <img
        class="em-hero__badge"
        src="/img/send.svg"
        alt="Enviar"
        width="87"
        height="83"
        decoding="async"
        fetchpriority="low"
        loading={oculto ? "lazy" : "eager"}
      />
      <span class="em-hero__pill em-hero__pill--pro">emailPro</span>
      <span class="em-hero__pill em-hero__pill--mail">
        <img
          src="/img/mail.svg"
          alt=""
          aria-hidden="true"
          width="22"
          height="18"
          decoding="async"
          fetchpriority="low"
          loading={oculto ? "lazy" : "eager"}
        />
        lara@growth.com
      </span>
    </section>
  );
}
