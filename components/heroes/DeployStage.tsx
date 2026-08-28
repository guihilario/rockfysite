/** A cena do Deploy: wordmark, string binária e a pilha de quatro cartões.
 *  Aparece no topo da página de Deploy e como painel do chip na home. */
export function DeployStage() {
  return (
    <div class="deploy-stage">
      <div class="deploy-stage__word">
        <img
          src="/img/deploy.svg"
          width="1118"
          height="363"
          decoding="async"
          alt=""
          aria-hidden="true"
        />
      </div>
      <p class="deploy-binary" aria-hidden="true">
        01010101010101010101010101010101010101
      </p>
      <div class="deploy-stack-wrap">
        <div
          class="deploy-stack"
          role="img"
          aria-label="Composição de quatro camadas sobrepostas"
        >
          <div class="deploy-card">
            <img
              src="/img/6.webp"
              width="700"
              height="467"
              decoding="async"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="deploy-card">
            <img
              src="/img/5.webp"
              width="700"
              height="394"
              decoding="async"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="deploy-card">
            <img
              src="/img/freelancer.webp"
              width="600"
              height="360"
              decoding="async"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="deploy-card">
            <img
              src="/img/designer.webp"
              width="600"
              height="401"
              decoding="async"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="deploy-pill" aria-hidden="true">
            <svg viewBox="0 0 158 44" preserveAspectRatio="xMidYMid meet">
              <rect width="157.3" height="43.3" rx="21.6" fill="var(--accent)">
              </rect>
              <text
                x="50%"
                y="50%"
                text-anchor="middle"
                dominant-baseline="central"
                font-family="var(--font)"
                font-size="13"
                font-weight="600"
                fill="var(--on-accent)"
              >
                em construção
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A mesma cena embrulhada como painel do slot de heros. */
export function HeroDeploy({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="deploy-panel"
      data-hero-panel="deploy"
      aria-label="Deploy — seu app no ar"
      hidden={oculto}
    >
      <DeployStage />
    </section>
  );
}
