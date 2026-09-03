import type { ComponentChildren } from "preact";

/**
 * Chamada dos planos.
 *
 * Em duas formas. A padrão traz a colagem ao lado do texto e serve de
 * abertura para o trilho de planos. A `centralizada` tira a colagem, alinha
 * o texto ao centro e recebe conteúdo abaixo — usada quando a chamada
 * apresenta o carrossel de heros em vez do trilho de preços.
 *
 * Na forma centralizada o botão "Ver planos" sai: ali embaixo vem o
 * carrossel, e um botão que leva para outra página no meio do caminho
 * disputaria com ele.
 */
export function PlanosChamada(
  { centralizada = false, children }: {
    centralizada?: boolean;
    children?: ComponentChildren;
  } = {},
) {
  const texto = (
    <>
      <span class="tagline">Planos simplificados</span>
      <h2 class="title">
        <b>Plano simples</b>, infinitas <em>possibilidades</em>
      </h2>
      <p class="para">
        Escolha um plano que se adapte às suas necessidades. Economize e
        simplifique seus custos
      </p>
    </>
  );

  if (centralizada) {
    return (
      <section class="section">
        <div class="conteudo">
          <div class="chamada-centro">{texto}</div>
        </div>
        {children}
      </section>
    );
  }

  return (
    <>
      {/* ══════ 7 · COLAGEM VERTICAL ══════ */}
      <section class="section">
        <div class="conteudo">
          <div class="split split--rev">
            <div>
              {texto}
              <a class="cta" href="#planos">
                Ver planos
                <span class="badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="8" r="2.8" />
                    <circle cx="32" cy="20" r="2.8" />
                    <circle cx="20" cy="32" r="2.8" />
                    <circle cx="8" cy="20" r="2.8" />
                  </svg>
                </span>
              </a>
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
