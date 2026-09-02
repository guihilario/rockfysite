import { testimonials } from "@/data/testimonials.ts";

/**
 * Os slides dos depoimentos, servidos prontos.
 *
 * Antes o `scripts.js` montava tudo por `innerHTML` — nenhum depoimento
 * existia no HTML. Agora o servidor entrega os slides e o JS só posiciona,
 * anima e responde às setas.
 *
 * `id` distingue o carrossel solto do embutido na seção de clientes, porque
 * os dois aparecem na mesma página e precisam de ids únicos.
 */
function Marca() {
  return (
    <svg class="slide__mark" viewBox="0 0 24 24">
      <path
        d="M12 6.5S10 4.5 4 4.5v13c6 0 8 2 8 2s2-2 8-2v-13c-6 0-8 2-8 2Z"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path d="M12 6.5v13" stroke-width="1.5" />
    </svg>
  );
}

export function TestimonialDeck({ id }: { id: string }) {
  return (
    <div class="deck" id={id}>
      {testimonials.map((d, i) => (
        <article
          key={i}
          class="slide"
          data-i={i}
          aria-label={`Depoimento ${i + 1} de ${testimonials.length}`}
        >
          <div class="slide__photo">
            <img
              class="slide__img"
              src={d.foto}
              alt={`Foto de ${d.name}`}
              width="540"
              height="521"
              loading="lazy"
              decoding="async"
            />
            <div class="slide__box">
              <Marca />
              <div class="slide__name">{d.name}</div>
              {d.role && <div class="slide__role">{d.role}</div>}
              <div class="slide__rule"></div>
              <div class="slide__grid">
                <span class="slide__idx">
                  [ {String(i + 1).padStart(2, "0")} ]
                </span>
                <p class="slide__quote">{d.quote}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function TestimonialDots({ id }: { id: string }) {
  return (
    <div class="dots" id={id}>
      {testimonials.map((_, i) => (
        <button
          type="button"
          key={i}
          data-i={i}
          aria-label={`Ir para ${i + 1}`}
        >
        </button>
      ))}
    </div>
  );
}
