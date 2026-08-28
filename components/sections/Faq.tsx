import type { ComponentChildren } from "preact";
import { faq, type FaqItem } from "@/data/faq.ts";

/** Perguntas frequentes. O acordeão abre uma por vez — a primeira já vem
 *  aberta, como no desenho original. */
type PropsFaq = {
  /** As perguntas. O padrão é a lista geral do site. */
  itens?: FaqItem[];
  eyebrow?: string;
  titulo?: ComponentChildren;
  texto?: ComponentChildren;
  cta?: string;
};

export function Faq({
  itens = faq,
  eyebrow = "Dúvidas",
  titulo = (
    <>
      Perguntas <b>frequentes</b>
    </>
  ),
  texto =
    "Se ficar alguma dúvida, o suporte responde no chat e no WhatsApp, das 8h às 22h, todos os dias — gente de verdade, não robô.",
  cta = "Falar com o suporte",
}: PropsFaq = {}) {
  return (
    <>
      {/* ══════ FAQ ══════ */}
      <section class="section faq">
        <div class="conteudo">
          <div>
            <p class="eyebrow">{eyebrow}</p>
            <h2 class="title">{titulo}</h2>
            <p class="para">{texto}</p>
            <button type="button" class="cta">
              {cta}
              <span class="badge">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div class="acc" id="acc">
            {itens.map((item, i) => (
              <div
                key={item.q}
                class={i === 0 ? "acc__item is-open" : "acc__item"}
              >
                <button
                  type="button"
                  class="acc__btn"
                  aria-expanded={i === 0 ? "true" : "false"}
                >
                  <span class="acc__q">{item.q}</span>
                  <span class="acc__ico" aria-hidden="true"></span>
                </button>
                <div class="acc__panel">
                  <div>
                    <p class="acc__a">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
