/** "Uma conta, todos os seus projetos" — o fluxo do painel. */
export function AreaCliente() {
  return (
    <>
      {/* ══════ 5 · DATA GRID ══════ */}
      <section class="section dotted">
        <div class="conteudo">
          <div class="split split--cta-last">
            <div>
              <span class="tagline">Área do Cliente</span>
              <h2 class="title">
                Uma <b>conta,</b> todos <em>os seus projetos</em>
              </h2>
              <p class="para">
                Projetamos um painel pensando em você, que tem clientes e
                projetos diversos. Serviços, finanças e suporte. Integre o seu
                gateway de pagamento e gerencie num só lugar.
              </p>
              <button type="button" class="cta">
                Ver como funciona
                <span class="badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="8" r="2.8" />
                    <circle cx="32" cy="20" r="2.8" />
                    <circle cx="20" cy="32" r="2.8" />
                    <circle cx="8" cy="20" r="2.8" />
                  </svg>
                </span>
              </button>
            </div>

            <div
              class="flow"
              role="img"
              aria-label="Sua conta distribui para Faturas, Serviços e Suporte, que atendem os clientes Acme Corp e Larius Capital"
            >
              <svg
                class="flow__wires"
                viewBox="0 0 560 400"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M280 68 V152" />
                <path d="M158 180 H186" />
                <path d="M374 180 H402" />
                <path d="M280 208 V270" />
                <path d="M280 270 L170 302" />
                <path d="M280 270 L400 302" />
              </svg>
              <div class="node node--accent n-tags">
                <span class="node__badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="4" />
                    <circle cx="20" cy="7" r="2" />
                    <circle cx="33" cy="20" r="2" />
                    <circle cx="20" cy="33" r="2" />
                    <circle cx="7" cy="20" r="2" />
                  </svg>
                </span>
                <span>Sua conta</span>
              </div>
              <div class="node n-sms">
                <span class="node__badge">1</span>
                <span>Faturas</span>
              </div>
              <div class="node n-insta">
                <span class="node__badge">2</span>
                <span>Serviços</span>
              </div>
              <div class="node n-mail">
                <span class="node__badge">3</span>
                <span>Suporte</span>
              </div>
              <div class="node n-u1">
                <span class="node__badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="12" r="2.4" />
                    <circle cx="12" cy="26" r="2.4" />
                    <circle cx="28" cy="26" r="2.4" />
                    <circle cx="20" cy="24" r="2" />
                  </svg>
                </span>
                <span>Acme Corp</span>
              </div>
              <div class="node node--accent n-u2">
                <span class="node__badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="12" r="2.4" />
                    <circle cx="12" cy="26" r="2.4" />
                    <circle cx="28" cy="26" r="2.4" />
                    <circle cx="20" cy="24" r="2" />
                  </svg>
                </span>
                <span>Larius Capital</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
