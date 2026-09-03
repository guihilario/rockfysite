import { testimonials } from "@/data/testimonials.ts";

/**
 * A faixa de depoimentos.
 *
 * A estrutura vem do site anterior: cada depoimento é um `figure` com foto
 * pequena, citação e assinatura, e a faixa rola na horizontal com
 * `scroll-snap`. É mais sóbria que o carrossel de cards sobrepostos que
 * estava aqui — e bem mais barata: aquele posicionava cada slide por
 * JavaScript a cada quadro; este é rolagem nativa, e o script só empurra o
 * trilho quando a seta é clicada.
 *
 * O estilo é o nosso: fundo claro, tokens do site, mesma tipografia. O
 * original era uma seção escura, que não existe no nosso desenho.
 *
 * `id` distingue instâncias — a seção de clientes tem a sua, e o contrato
 * com o `scripts.js` é `<id>` no trilho e `<id>Prev` / `<id>Next` nas setas.
 */
export function TestimonialDeck({ id }: { id: string }) {
  return (
    <div
      class="depo"
      id={id}
      tabIndex={0}
      role="region"
      aria-label="Depoimentos de clientes"
    >
      <div class="depo__trilho">
        {testimonials.map((d) => (
          <figure class="depo__item" key={d.name}>
            <div class="depo__foto">
              <img
                src={d.foto}
                alt={`Foto de ${d.name}`}
                width="540"
                height="521"
                loading="lazy"
                decoding="async"
              />
            </div>
            <blockquote class="depo__texto">“{d.quote}”</blockquote>
            <figcaption class="depo__autor">
              <b>{d.name}</b>
              {d.role ? ` — ${d.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/**
 * Os pontos de posição.
 *
 * Continuam existindo porque a faixa rola e nem todo mundo percebe que há
 * mais depoimentos à direita — mas agora só indicam, sem controlar: quem
 * controla é a rolagem e as setas.
 */
export function TestimonialDots({ id }: { id: string }) {
  return (
    <div class="dots depo__pontos" id={id} aria-hidden="true">
      {testimonials.map((d) => <span key={d.name}></span>)}
    </div>
  );
}
