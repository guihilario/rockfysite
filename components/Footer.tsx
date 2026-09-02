/** Rodapé — idêntico em todas as páginas. */
export function Footer() {
  return (
    <footer class="footer">
      <div class="conteudo">
        <div class="footer__grid">
          <div class="footer__brand">
            <div class="logo" aria-label="Logo">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path class="fg" d="M6 6h58v18H30v13h30v18H30v18H6V6Z" />
                <rect class="fg" x="6" y="66" width="20" height="20" />
                <circle class="bg" cx="24" cy="17" r="4.6" />
                <circle class="bg" cx="40" cy="13" r="4" />
                <circle class="bg" cx="52" cy="22" r="3.4" />
                <circle class="bg" cx="20" cy="34" r="3.6" />
                <circle class="bg" cx="42" cy="45" r="3.2" />
                <circle class="bg" cx="20" cy="55" r="3" />
              </svg>
            </div>
            <p class="footer__pitch">
              Hospedagem, deploy e gestão em um só painel. Feito para quem cuida
              de vários projetos ao mesmo tempo.
            </p>
            <div class="footer__social">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3.5"
                    y="3.5"
                    width="17"
                    height="17"
                    rx="5"
                    stroke-width="1.6"
                  />
                  <circle cx="12" cy="12" r="4" stroke-width="1.6" />
                  <circle
                    cx="17"
                    cy="7"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3.5"
                    y="3.5"
                    width="17"
                    height="17"
                    rx="4"
                    stroke-width="1.6"
                  />
                  <path
                    d="M8 10.5v6M8 7.6v.1M12 16.5v-3.4a2.1 2.1 0 0 1 4.2 0v3.4"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M9 19c-4 1.2-4-2.2-5.5-2.8M15 21v-3.3c0-.9.3-1.5.7-1.9-2.6-.3-5.2-1.3-5.2-5.6 0-1.3.4-2.3 1.1-3.1-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a9.7 9.7 0 0 1 5 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3.1 0 4.3-2.6 5.3-5.2 5.6.4.4.8 1.1.8 2.2V21"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div class="footer__col">
            <h2 class="footer__col-t">Produto</h2>
            <ul>
              <li>
                <a href="/hospedagem-wordpress">Hospedagem</a>
              </li>
              <li>
                <a href="/deploy">Deploy</a>
              </li>
              <li>
                <a href="#">Domínios</a>
              </li>
              <li>
                <a href="/email-profissional">E-mails</a>
              </li>
              <li>
                <a href="#">Preços</a>
              </li>
            </ul>
          </div>

          <div class="footer__col">
            <h2 class="footer__col-t">Empresa</h2>
            <ul>
              <li>
                <a href="/sobre">Sobre</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="#">Clientes</a>
              </li>
              <li>
                <a href="#">Trabalhe conosco</a>
              </li>
            </ul>
          </div>

          <div class="footer__col">
            <h2 class="footer__col-t">Suporte</h2>
            <ul>
              <li>
                <a href="/ajuda">Central de ajuda</a>
              </li>
              <li>
                <a href="#">Status</a>
              </li>
              <li>
                <a href="#">Documentação</a>
              </li>
              <li>
                <a href="/contato">Contato</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer__news">
          <div>
            <p class="t">Uma vez por mês, nada mais</p>
            <p class="s">Novidades da plataforma e um artigo bom. Sem spam.</p>
          </div>
          <div class="subscribe">
            <input
              type="email"
              placeholder="seu@email.com"
              aria-label="E-mail"
            />
            <button type="button" aria-label="Assinar">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="footer__base">
          <span>Rockfy</span>
          <nav>
            <a href="/politicas#termos">Termos</a>
            <a href="/politicas#privacidade">Privacidade</a>
            <a href="/politicas#privacidade">Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
