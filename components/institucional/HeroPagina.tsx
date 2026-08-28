import type { ComponentChildren } from "preact";

/**
 * O topo das páginas institucionais.
 *
 * As páginas de produto abrem com a arte do hero e o `HeroCopy`; estas não
 * têm arte, então abrem só com o texto. Mesmo vocabulário do resto do site
 * — `.tagline`, `.title`, `.para`, `.cta` — para não inventar um segundo
 * jeito de escrever um cabeçalho.
 */
export function HeroPagina(
  { tagline, h1, lede, acoes }: {
    tagline: string;
    h1: ComponentChildren;
    lede: ComponentChildren;
    acoes?: ComponentChildren;
  },
) {
  return (
    <section class="section pagina-topo" aria-labelledby="titulo-pagina">
      <div class="conteudo">
        <span class="tagline">{tagline}</span>
        <h1 class="title" id="titulo-pagina">{h1}</h1>
        <p class="para pagina-topo__lede">{lede}</p>
        {acoes && <div class="pagina-topo__acoes">{acoes}</div>}
      </div>
    </section>
  );
}

/**
 * Uma lista de blocos curtos (título + descrição), reaproveitando o
 * `.steps` das outras páginas. `colunas` só muda a grade: 3 é o padrão do
 * site, 2 serve para listas de 2 ou 4 itens, que em 3 colunas ficariam
 * com uma sobra torta na última linha.
 */
export function Blocos(
  { titulo, itens, colunas = 3 }: {
    titulo?: ComponentChildren;
    itens: { titulo: string; texto: string; href?: string }[];
    colunas?: 2 | 3;
  },
) {
  return (
    <>
      {titulo && <h2 class="title">{titulo}</h2>}
      <ol class={colunas === 2 ? "steps steps--duas" : "steps"}>
        {itens.map((i) => (
          <li class="step" key={i.titulo}>
            <h3 class="step__t">{i.titulo}</h3>
            <p class="step__d">{i.texto}</p>
            {i.href && <a class="step__link" href={i.href}>Conhecer</a>}
          </li>
        ))}
      </ol>
    </>
  );
}
