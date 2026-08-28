/** Chamada dos planos, logo antes do trilho. */
export function PlanosChamada() {
  return (
    <>
      {/* ══════ 7 · COLAGEM VERTICAL ══════ */}
      <section class="section">
        <div class="conteudo">
          <div class="split split--rev">
            <div>
              <span class="tagline">Planos simplificados</span>
              <h2 class="title">
                <b>Plano simples</b>, infinitas <em>possibilidades</em>
              </h2>
              <p class="para">
                Escolha um plano que se adapte às suas necessidades. Economize e
                simplifique seus custos
              </p>
              <button type="button" class="cta">
                Ver planos
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

            <div class="collage col-c">
              <div class="c-back"></div>
              <div class="c-photo"></div>
              <span class="c-lime">
                <svg viewBox="0 0 40 40">
                  <circle cx="20" cy="9" r="1.9" />
                  <circle cx="27.8" cy="12.2" r="1.9" />
                  <circle cx="31" cy="20" r="1.9" />
                  <circle cx="27.8" cy="27.8" r="1.9" />
                  <circle cx="20" cy="31" r="1.9" />
                  <circle cx="12.2" cy="27.8" r="1.9" />
                  <circle cx="9" cy="20" r="1.9" />
                  <circle cx="12.2" cy="12.2" r="1.9" />
                  <circle cx="20" cy="20" r="1.9" />
                </svg>
              </span>
              <div class="c-product">
                <span class="disc"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
