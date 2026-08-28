/** "Hospede seus clientes" — colagem de renda recorrente. */
export function Parceiros() {
  return (
    <>
      {/* ══════ 6 · AGENDAMENTO / COLAGEM B ══════ */}
      <section class="section dotted">
        <div class="split split--rev">
          <div>
            <span class="tagline">Parceiros</span>
            <h2 class="title">
              Hospede seus clientes <b>ganhe</b> todo <em>mês</em>
            </h2>
            <p class="para">
              Migre seus clientes para uma infraestrutura pensada para o seu
              modelo de negócio e crie uma fonte de renda recorrente. A gente
              cuida da infraestrutura e você do relacionamento direto com ele.
            </p>
            <button type="button" class="cta">
              Seja um parceiro
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

          <div class="rc-collage" aria-hidden="true">
            <img
              class="rc-arc"
              src="/img/r-arc.svg"
              alt=""
              width="318"
              height="378"
              loading="lazy"
              decoding="async"
            />
            <img
              class="rc-arrow"
              src="/img/r-arrow.svg"
              alt=""
              width="86"
              height="141"
              loading="lazy"
              decoding="async"
            />

            <div class="rc-shot rc-shot--a">
              <img
                class="rc-media"
                src="/img/hospedagem-para-agencia1.webp"
                alt=""
                width="600"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <img
                class="rc-dotmark"
                src="/img/r-dot.svg"
                alt=""
                width="17"
                height="17"
                loading="lazy"
              />
            </div>
            <div class="rc-shot rc-shot--b">
              <img
                class="rc-media"
                src="/img/hospedagem-para-agencia2.webp"
                alt=""
                width="600"
                height="360"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="rc-shot rc-shot--c">
              <img
                class="rc-media"
                src="/img/hospedagem-para-agencia3.webp"
                alt=""
                width="600"
                height="360"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="rc-shot rc-shot--d">
              <img
                class="rc-media"
                src="/img/hospedagem-para-agencia4.webp"
                alt=""
                width="600"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <img
                class="rc-dotmark"
                src="/img/r-dot.svg"
                alt=""
                width="17"
                height="17"
                loading="lazy"
              />
            </div>

            <img
              class="rc-rocket"
              src="/img/r-rocket.svg"
              alt=""
              width="54"
              height="54"
              loading="lazy"
              decoding="async"
            />
            <img
              class="rc-dashes"
              src="/img/r-dashes.svg"
              alt=""
              width="49"
              height="68"
              loading="lazy"
              decoding="async"
            />

            <div class="rc-gains">
              <img
                class="rc-ico"
                src="/img/r-money.svg"
                alt=""
                width="16"
                height="26"
                loading="lazy"
              />
              <p>
                Ganhos<br />recorrentes
              </p>
            </div>

            <div class="rc-dash">
              <img
                class="rc-chart"
                src="/img/r-chart.svg"
                alt=""
                width="213"
                height="233"
                loading="lazy"
                decoding="async"
              />
              <div class="rc-info">
                <p class="rc-lbl">Lucro Líquido</p>
                <p class="rc-val" data-counter="1571" data-counter-prefix="R$ ">
                  R$ 1.571
                </p>
                <p class="rc-dlt">+9,8%</p>
              </div>
              <span class="rc-tag">20 sites</span>
            </div>

            <div class="rc-wallet">
              <img
                class="rc-ic"
                src="/img/r-clients.svg"
                alt=""
                width="43"
                height="43"
                loading="lazy"
              />
              <p>
                <b>Crie sua carteira</b>
                <br />de clientes
              </p>
            </div>

            <div class="rc-ticket">
              <p>
                Clientes Fixos =<br />Aumento de ticket
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
