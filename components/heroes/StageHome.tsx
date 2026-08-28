/**
 * O palco da home: um marquee horizontal de fotos que roda sozinho.
 *
 * Trazido do site antigo (`.stage` / `.marquee-track` do `_local`). Fica
 * isolado de propósito — classes próprias com prefixo `stage-`, CSS num
 * bloco só e nenhum outro componente dependendo dele: se o teste de
 * performance disser que não compensa, sai daqui e do `HeroSlot` sem
 * deixar rastro.
 *
 * As seis fotos aparecem três vezes: a animação desloca exatamente 1/3 da
 * faixa, o que recoloca o conjunto no início e fecha o loop sem emenda.
 * Só o primeiro conjunto carrega de imediato; as cópias são `lazy`.
 */
export function StageHome({ oculto }: { oculto?: boolean }) {
  return (
    <section
      class="stage-hero"
      data-hero-panel="stage"
      aria-label="Projetos hospedados na Rockfy"
      hidden={oculto}
    >
      <div class="stage-palco">
        <div class="stage-word">
          <img
            class="stage-word__svg"
            src="/img/cloud.svg"
            alt=""
            aria-hidden="true"
            width="1280"
            height="337"
            fetchpriority="high"
          />
        </div>
        <p class="stage-binary" aria-hidden="true">
          01010101010101010101010101010101010101
        </p>

        <div class="stage-cards">
          <ul class="stage-track">
            <li class="stage-card stage-card--c1" key="0-1">
              <img
                src="/img/1.webp"
                srcset="/img/1-420.webp 420w, /img/1.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt="Cliente Rockfy"
                width="245"
                height="250"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c2" key="0-2">
              <img
                src="/img/2.webp"
                srcset="/img/2-420.webp 420w, /img/2.webp 483w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="192"
                height="270"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c3" key="0-3">
              <img
                src="/img/3.webp"
                srcset="/img/3-420.webp 420w, /img/3.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="248"
                height="400"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c4" key="0-4">
              <img
                src="/img/4.webp"
                srcset="/img/4-420.webp 420w, /img/4.webp 533w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="254"
                height="385"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c5" key="0-5">
              <img
                src="/img/5.webp"
                srcset="/img/5-420.webp 420w, /img/5.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="210"
                height="310"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c6" key="0-6">
              <img
                src="/img/6.webp"
                srcset="/img/6-420.webp 420w, /img/6.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="220"
                height="325"
                decoding="async"
              />
            </li>
            <li class="stage-card stage-card--c1" key="1-1">
              <img
                src="/img/1.webp"
                srcset="/img/1-420.webp 420w, /img/1.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="245"
                height="250"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c2" key="1-2">
              <img
                src="/img/2.webp"
                srcset="/img/2-420.webp 420w, /img/2.webp 483w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="192"
                height="270"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c3" key="1-3">
              <img
                src="/img/3.webp"
                srcset="/img/3-420.webp 420w, /img/3.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="248"
                height="400"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c4" key="1-4">
              <img
                src="/img/4.webp"
                srcset="/img/4-420.webp 420w, /img/4.webp 533w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="254"
                height="385"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c5" key="1-5">
              <img
                src="/img/5.webp"
                srcset="/img/5-420.webp 420w, /img/5.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="210"
                height="310"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c6" key="1-6">
              <img
                src="/img/6.webp"
                srcset="/img/6-420.webp 420w, /img/6.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="220"
                height="325"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c1" key="2-1">
              <img
                src="/img/1.webp"
                srcset="/img/1-420.webp 420w, /img/1.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="245"
                height="250"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c2" key="2-2">
              <img
                src="/img/2.webp"
                srcset="/img/2-420.webp 420w, /img/2.webp 483w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="192"
                height="270"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c3" key="2-3">
              <img
                src="/img/3.webp"
                srcset="/img/3-420.webp 420w, /img/3.webp 800w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="248"
                height="400"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c4" key="2-4">
              <img
                src="/img/4.webp"
                srcset="/img/4-420.webp 420w, /img/4.webp 533w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="254"
                height="385"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c5" key="2-5">
              <img
                src="/img/5.webp"
                srcset="/img/5-420.webp 420w, /img/5.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="210"
                height="310"
                decoding="async"
                loading="lazy"
              />
            </li>
            <li class="stage-card stage-card--c6" key="2-6">
              <img
                src="/img/6.webp"
                srcset="/img/6-420.webp 420w, /img/6.webp 700w"
                sizes="(max-width: 760px) 52vw, 254px"
                alt=""
                width="220"
                height="325"
                decoding="async"
                loading="lazy"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
