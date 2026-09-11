import type { ComponentChildren } from "preact";
import { site } from "@/data/site.ts";
import { alvoDosPlanos } from "@/core/navegacao.ts";

/**
 * A faixa de abertura com foto sangrando e o divisor curvo.
 *
 * O cabeçalho entra por `cabecalho` quando a página quer um sobreposto à
 * foto. Na home o slot fica vazio: lá quem manda é o `Header` do site.
 *
 * A foto foi enquadrada para este uso — sujeito à direita, fundo desfocado
 * à esquerda, que é onde o texto assenta.
 */
export function HeroFoto(
  { cabecalho, rota }: { cabecalho?: ComponentChildren; rota?: string },
) {
  return (
    <section class={cabecalho ? "heroB heroB--com-topo" : "heroB"}>
      <img
        class="heroB__foto"
        src="/img/bg-hero.webp"
        alt=""
        aria-hidden="true"
        width="1456"
        height="816"
        fetchpriority="high"
      />
      <div class="heroB__veu" aria-hidden="true"></div>

      {cabecalho}

      {
        /* Mesmo arranjo do `HeroCopy` das outras páginas: o h1 numa coluna e
          o texto com as ações na outra, à direita. A diferença é o
          alinhamento — aqui as duas colunas assentam na parte baixa da foto,
          acima do divisor. No estreito volta a ser uma coluna só. */
      }
      <div class="heroB__corpo">
        <h1 class="heroB__titulo">
          Sua nova nuvem para a era da IA
        </h1>
        <div class="heroB__pitch">
          <p class="heroB__texto">
            Hospede seus sites e apps gerados por I.A em uma única plataforma
            pronta para criar e expandir o seu negócio.
          </p>
          <div class="heroB__acoes">
            <a class="heroB__cta" href={alvoDosPlanos(rota)}>Ver planos</a>
            <a class="heroB__link" href={site.whatsapp}>
              [ Falar com a gente ]
            </a>
          </div>
        </div>
      </div>

      {
        /* O `img/divisor.svg` inline, para o preenchimento ser o mesmo token
          de fundo da página — como arquivo ele traria o #FFFFFD fixo e
          deixaria um fio visível na emenda. */
      }
      <svg
        class="heroB__divisor"
        viewBox="0 0 1280 201"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M625.573 0H-0.999798L-1 200.5H1282L1282 117.506H826.028C799.537 117.506 774.129 106.995 755.38 88.2801L696.221 29.2262C677.472 10.5112 652.064 0 625.573 0Z"
          fill="var(--surface)"
        />
      </svg>
    </section>
  );
}
