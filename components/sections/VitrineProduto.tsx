import type { ComponentChildren } from "preact";

/**
 * Faixa de vitrine de um produto: texto à esquerda, a colagem animada da
 * hero daquele produto à direita, e um botão que leva para a página.
 *
 * A colagem entra como `children` em vez de ser escolhida por uma chave aqui
 * dentro: as heros já são componentes prontos, e passá-las de fora evita que
 * esta faixa precise conhecer todas elas para renderizar uma.
 *
 * O `.split` sem modificador já põe o texto na coluna estreita (.92fr) e a
 * arte na larga (1.08fr) — que é a proporção certa, porque a colagem precisa
 * de área e o texto não. No estreito ele empilha sozinho.
 *
 * `invertido` espelha o par: a arte vai para a esquerda e o texto para a
 * direita. Quem faz isso é o `.split--rev`, que já existe no site e cuida
 * também de inverter a proporção das colunas — no estreito as duas formas
 * empilham igual, com o texto primeiro.
 */
export function VitrineProduto(
  { tagline, titulo, texto, cta, href, invertido, children }: {
    tagline: string;
    titulo: ComponentChildren;
    texto: string;
    cta: string;
    href: string;
    /** Arte à esquerda e texto à direita. */
    invertido?: boolean;
    children: ComponentChildren;
  },
) {
  return (
    <section class="section" aria-labelledby={`vitrine-${href.slice(1)}`}>
      <div class="conteudo">
        <div class={invertido ? "split split--rev" : "split"}>
          <div>
            <span class="tagline">{tagline}</span>
            <h2 class="title" id={`vitrine-${href.slice(1)}`}>{titulo}</h2>
            <p class="para">{texto}</p>
            <a class="cta" href={href}>
              {cta}
              <span class="badge">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
          <div class="vitrine__arte">{children}</div>
        </div>
      </div>
    </section>
  );
}
