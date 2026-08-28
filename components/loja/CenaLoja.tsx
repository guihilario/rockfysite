/**
 * As cenas ilustradas da página de loja digital.
 *
 * Cada uma empilha até três camadas — aparelho ao fundo, domo colorido no
 * meio, ilustração na frente. No projeto de origem as posições eram pixels
 * fixos, com um bloco de media query reescrevendo tudo no mobile; aqui elas
 * viraram porcentagem da própria cena, então uma `aspect-ratio` só resolve
 * todos os tamanhos e as posições vivem em um lugar só (ver `.cena` no
 * styles.css).
 *
 * São decorativas: entram com `aria-hidden` e `alt` vazio, porque quem
 * conta a história é o texto ao lado.
 */
type Camada = { src: string; w: number; h: number };

type Cena = {
  /** O aparelho, atrás de tudo. Nem toda cena tem. */
  fundo?: Camada;
  /** O domo colorido. Puramente decorativo. */
  domo?: Camada;
  /** A ilustração, na frente. */
  frente: Camada;
};

const CENAS: Record<string, Cena> = {
  atendimento: {
    fundo: { src: "/img/tiker/s4-phone.webp", w: 1232, h: 1302 },
    domo: { src: "/img/tiker/circle-purple.webp", w: 1851, h: 603 },
    frente: { src: "/img/tiker/s4-ilustra.webp", w: 1400, h: 1065 },
  },
  catalogo: {
    fundo: { src: "/img/tiker/s3-phone.webp", w: 1232, h: 1302 },
    domo: { src: "/img/tiker/circle-pink.webp", w: 1922, h: 636 },
    frente: { src: "/img/tiker/s3-ilustra.webp", w: 1400, h: 1180 },
  },
  taxa: {
    fundo: { src: "/img/tiker/s2-phone.webp", w: 1376, h: 1302 },
    frente: { src: "/img/tiker/s2-ilustra.webp", w: 1400, h: 1356 },
  },
  atualize: {
    fundo: { src: "/img/tiker/s5-phone.webp", w: 1516, h: 1306 },
    domo: { src: "/img/tiker/circle-blue.webp", w: 1943, h: 644 },
    frente: { src: "/img/tiker/s5-ilustra.webp", w: 1400, h: 1185 },
  },
  planos: {
    domo: { src: "/img/tiker/circle-green.webp", w: 1943, h: 644 },
    frente: { src: "/img/tiker/s-planos.webp", w: 1400, h: 1030 },
  },
  /* Reaproveita a maquete de celular do hero do projeto de origem. */
  montagem: {
    fundo: { src: "/img/tiker/hero-phone.webp", w: 1148, h: 1302 },
    frente: { src: "/img/tiker/ilustra6.webp", w: 1400, h: 1111 },
  },
};

export function CenaLoja({ nome }: { nome: keyof typeof CENAS }) {
  const cena = CENAS[nome];
  return (
    <div class={`cena cena--${nome}`} aria-hidden="true">
      {cena.fundo && (
        <img
          class="cena__fundo"
          src={cena.fundo.src}
          alt=""
          width={cena.fundo.w}
          height={cena.fundo.h}
          loading="lazy"
          decoding="async"
        />
      )}
      {cena.domo && (
        <img
          class="cena__domo"
          src={cena.domo.src}
          alt=""
          width={cena.domo.w}
          height={cena.domo.h}
          loading="lazy"
          decoding="async"
        />
      )}
      <img
        class="cena__frente"
        src={cena.frente.src}
        alt=""
        width={cena.frente.w}
        height={cena.frente.h}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
