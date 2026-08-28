import { audiences } from "@/data/audiences.ts";

/** "Feito pra quem faz acontecer" — acordeão horizontal que gira sozinho. */
export function Audience() {
  return (
    <>
      {/* ══════ PÚBLICOS ══════ */}
      <section class="section" aria-labelledby="audience-title">
        <div class="conteudo">
          <div class="voices__head">
            <div>
              <p class="eyebrow">Infraestrutura no Brasil</p>
              <h2 class="voices__title" id="audience-title">
                Feito pra quem <br />
                <b>faz acontecer</b>
              </h2>
            </div>
          </div>
          <div class="audience-row" id="audienceRow">
            {audiences.map((a) => (
              <button
                type="button"
                key={a.title}
                class="audience-card"
                aria-pressed="false"
              >
                <img
                  class="audience-card__media"
                  src={`/${a.img}`}
                  alt={a.title}
                  width="600"
                  height="360"
                  decoding="async"
                  loading="lazy"
                />
                <span class="audience-card__veil"></span>
                <span class="audience-card__text">
                  <span class="audience-card__title">{a.title}</span>
                  <span class="audience-card__desc">{a.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
