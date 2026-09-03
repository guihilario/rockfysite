import {
  TestimonialDeck,
  TestimonialDots,
} from "@/components/TestimonialDeck.tsx";
import { Rede } from "@/components/Rede.tsx";

/**
 * "Há 15 anos construindo parcerias".
 *
 * O carrossel de depoimentos passou para a esquerda, no lugar dos dois
 * parágrafos e do botão: quem fala pelo tempo de casa são os clientes, não
 * um texto sobre eles. À direita entrou a rede de rostos, que era o
 * `network.html` da raiz do projeto.
 */
export function Clients() {
  return (
    <>
      {/* ══════ 3 · INVEST IN YOUR PEOPLE ══════ */}
      <section class="section dotted">
        <div class="conteudo">
          <div class="split">
            <div>
              <p class="eyebrow">Clientes</p>
              <h2 class="title">
                Há <b>15 anos</b> construindo <em>parcerias verdadeiras</em>
              </h2>
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

            <Rede />
          </div>
        </div>
      </section>
    </>
  );
}
