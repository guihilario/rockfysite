import { type Plan, plans } from "@/data/plans.ts";

/**
 * O trilho de planos.
 *
 * Antes era montado por `innerHTML` no cliente: preço, nome e itens não
 * existiam no HTML servido. Agora vem pronto do servidor, e o `scripts.js`
 * só cuida da rolagem, dos pontos e do arrasto.
 */
function Check() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function Card({ plano }: { plano: Plan }) {
  return (
    <article class={plano.featured ? "plan plan--featured" : "plan"}>
      <span class="plan__tag">{plano.tag}</span>
      <h3 class="plan__name">{plano.name}</h3>
      <div class="plan__price">
        <b>{plano.price}</b>
        <span>/ mês</span>
      </div>
      <p class="plan__note">{plano.note}</p>
      <div class="plan__rule"></div>
      <ul class="plan__list">
        {plano.items.map((item) => (
          <li
            key={item.label}
            class={item.on === false ? "plan__item is-off" : "plan__item"}
          >
            <Check />
            <span>
              {item.n && <span class="num">{item.n}</span>}
              {item.n ? " " : ""}
              {item.label}
            </span>
            {item.hint && (
              <span
                class="hint"
                data-tip={item.hint}
                tabindex={0}
                role="button"
                aria-label={`Saiba mais: ${item.hint}`}
              >
                ?
              </span>
            )}
          </li>
        ))}
      </ul>
      <button type="button" class="plan__cta">
        Começar
        <svg viewBox="0 0 24 24">
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </article>
  );
}

export function Planos() {
  return (
    <>
      {/* ══════ PLANOS (trilho) ══════ */}
      <section class="section">
        <div class="head">
          <div>
            <p class="eyebrow">Let's Rock!</p>
            <h2 class="title">
              Escale seu negócio{" "}
              <em>
                <br />e simplifique seus custos
              </em>
            </h2>
          </div>
          <div class="nav-arrows">
            <button
              type="button"
              class="arrowbtn"
              id="plansPrev"
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
              id="plansNext"
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

        <div class="rail" id="rail">
          {plans.map((plano) => <Card key={plano.name} plano={plano} />)}
        </div>
        <div class="dots" id="plansDots">
          {plans.map((_, i) => (
            <button
              type="button"
              key={i}
              data-i={i}
              aria-label={`Plano ${i + 1}`}
            >
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
