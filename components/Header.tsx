import type { ComponentChildren } from "preact";
import { menus } from "@/data/menu.ts";
import { Icone } from "@/components/Icone.tsx";

/** Cabeçalho e menu mobile. `atual` recebe o caminho da página para marcar
 *  o item correspondente no menu. */
function NavLink(
  { href, atual, children }: {
    href: string;
    atual?: string;
    children: ComponentChildren;
  },
) {
  const aqui = href !== "#" && href === atual;
  return (
    <a
      href={href}
      class={aqui ? "is-on" : undefined}
      aria-current={aqui ? "page" : undefined}
    >
      {children}
    </a>
  );
}

export function Header({ atual }: { atual?: string }) {
  return (
    <>
      <header class="top">
        <a class="logo" href="/" aria-label="Rockfy — página inicial">
          <img
            src="/img/rockfy-logo.svg"
            width="120"
            height="44"
            decoding="async"
            alt="Rockfy"
          />
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path class="fg" d="M6 6h58v18H30v13h30v18H30v18H6V6Z" />
            <rect class="fg" x="6" y="66" width="20" height="20" />
            <circle class="bg" cx="24" cy="17" r="4.6" />
            <circle class="bg" cx="40" cy="13" r="4" />
            <circle class="bg" cx="52" cy="22" r="3.4" />
            <circle class="bg" cx="20" cy="34" r="3.6" />
            <circle class="bg" cx="42" cy="45" r="3.2" />
            <circle class="bg" cx="20" cy="55" r="3" />
            <text
              class="fg"
              x="72"
              y="88"
              font-family="Helvetica,Arial"
              font-size="15"
            >
              ®
            </text>
          </svg>
        </a>
        <nav class="topnav" aria-label="Principal">
          {menus.map((m) => {
            const dentro = m.colunas.some((c) =>
              c.itens.some((i) => i.href === atual)
            );
            return (
              <div class="dd" key={m.chave}>
                <button
                  type="button"
                  class={dentro ? "dd__btn is-on" : "dd__btn"}
                  aria-expanded="false"
                  aria-controls={`dd-${m.chave}`}
                  data-dd={m.chave}
                >
                  {m.rotulo}
                  <svg class="dd__seta" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="m6 9 6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <div class="dd__painel" id={`dd-${m.chave}`} hidden>
                  <div class="dd__colunas">
                    {m.colunas.map((col) => (
                      <div class="dd__col" key={col.titulo}>
                        <p class="dd__col-t">{col.titulo}</p>
                        {col.itens.map((i) => (
                          <a
                            class={i.href === atual
                              ? "dd__item is-on"
                              : "dd__item"}
                            href={i.href}
                            key={i.href}
                          >
                            <span class="dd__ico">
                              <Icone nome={i.icone} />
                            </span>
                            <span>
                              <b>{i.titulo}</b>
                              <span class="dd__desc">{i.descricao}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                  {m.rodape && (
                    <a class="dd__rodape" href={m.rodape.href}>
                      <span>
                        <b>{m.rodape.titulo}</b>
                        <span class="dd__desc">{m.rodape.descricao}</span>
                      </span>
                      <span class="dd__cta">{m.rodape.cta} →</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
        <div class="top__acoes">
          <a class="top__entrar" href="https://area.rockfy.com">Entrar</a>
          <a class="top__cta" href="/planos">Ver planos</a>
        </div>

        <nav class="nav">
          <button
            type="button"
            class="burger"
            id="menuBtn"
            aria-label="Abrir menu"
            aria-expanded="false"
            aria-controls="mobileMenu"
          >
            <span></span>
            <span></span>
          </button>
          <span class="label" id="menuLabel">Menu</span>
        </nav>
      </header>

      {/* ══════ MENU MOBILE ══════ */}
      <div class="mmenu" id="mobileMenu" hidden>
        <nav class="mmenu__nav" aria-label="Menu principal">
          {menus.map((m) =>
            m.colunas.map((col) => (
              <div class="mmenu__grupo" key={m.chave + col.titulo}>
                <p class="mmenu__grupo-t">{col.titulo}</p>
                {col.itens.map((i) => (
                  <NavLink href={i.href} atual={atual} key={i.href}>
                    {i.titulo}
                  </NavLink>
                ))}
              </div>
            ))
          )}
          <div class="mmenu__acoes">
            <a class="top__entrar" href="https://area.rockfy.com">Entrar</a>
            <a class="top__cta" href="/planos">Ver planos</a>
          </div>
        </nav>
      </div>
    </>
  );
}
