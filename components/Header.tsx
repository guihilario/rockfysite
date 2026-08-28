import type { ComponentChildren } from "preact";

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
        <nav class="topnav">
          <NavLink href="/hospedagem-elementor-pro" atual={atual}>
            Hospedagem de Site
          </NavLink>
          <NavLink href="/deploy" atual={atual}>Deploy [I.A]</NavLink>
          <NavLink href="#" atual={atual}>Aplicativos</NavLink>
          <NavLink href="/loja-digital" atual={atual}>Loja digital</NavLink>
          <NavLink href="/email-profissional" atual={atual}>
            Email Profissional
          </NavLink>
        </nav>
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
        <button
          type="button"
          class="moon"
          id="themeBtn"
          aria-label="Alternar tema"
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* ══════ MENU MOBILE ══════ */}
      <div class="mmenu" id="mobileMenu" hidden>
        <nav class="mmenu__nav" aria-label="Menu principal">
          <NavLink href="/hospedagem-elementor-pro" atual={atual}>
            Hospedagem de Site
          </NavLink>
          <NavLink href="/deploy" atual={atual}>Deploy [I.A]</NavLink>
          <NavLink href="#" atual={atual}>Aplicativos</NavLink>
          <NavLink href="/loja-digital" atual={atual}>Loja digital</NavLink>
          <NavLink href="/email-profissional" atual={atual}>
            Email Profissional
          </NavLink>
        </nav>
      </div>
    </>
  );
}
