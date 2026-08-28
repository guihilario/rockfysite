import {
  TestimonialDeck,
  TestimonialDots,
} from "@/components/TestimonialDeck.tsx";

/** "Há 15 anos construindo parcerias" — com o carrossel de depoimentos
 *  embutido, agora servido pronto em vez de montado no cliente. */
export function Clients() {
  return (
    <>
      {/* ══════ 3 · INVEST IN YOUR PEOPLE ══════ */}
      <section class="section dotted">
        <div class="split">
          <div>
            <p class="eyebrow">Clientes</p>
            <h2 class="title">
              Há <b>15 anos</b> construindo <em>parcerias verdadeiras</em>
            </h2>
            <p class="para">
              Nascemos da necessidade de ter uma infraestrutura de ponta no
              Brasil e com suporte que realmente entende do assunto.
            </p>
            <p class="para">
              Trouxemos para nossos clientes a melhor experiência em
              infraestrutura digital.
            </p>
            <button type="button" class="cta">
              Nossa História
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
            class="voices-embedded"
            aria-roledescription="carrossel"
            aria-label="Depoimentos de clientes"
          >
            <TestimonialDeck id="deckClients" />
            <TestimonialDots id="dotsClients" />
            <div class="voices__controls">
              <button
                type="button"
                class="arrowbtn"
                id="prevEmbedded"
                aria-label="Anterior"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M15 5.5 8 12l7 6.5"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="arrowbtn"
                id="nextEmbedded"
                aria-label="Próximo"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="m9 5.5 7 6.5-7 6.5"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
