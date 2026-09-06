/** As duas variantes da colagem da seção "a gente cuida de tudo".
 *  A do Deploy troca o slot do Elementor pela marca do parceiro e não
 *  traz o badge "Modelos de seções" — são 5 peças em vez de 6. */
export function CollageElementor() {
  return (
    <div class="wp-collage">
      <div class="wp-collage__photo">
        <img
          src="/img/hospedagem-gerenciada.webp"
          alt=""
          aria-hidden="true"
          width="464"
          height="600"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="wp-fl wp-fl--ssl">
        <div class="wp-fl-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6fffce"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2.2 4.4 5.3v6c0 4.6 3.2 8.8 7.6 10.5 4.4-1.7 7.6-5.9 7.6-10.5v-6L12 2.2z" />
            <path d="M8.6 12.1l2.3 2.3 4.5-4.5" />
          </svg>
          <p>SSL Grátis</p>
        </div>
      </div>

      <div class="wp-fl wp-fl--models">
        <div class="wp-fl-box">
          <p class="wp-fl-box__label">Licença Oficial</p>
        </div>
      </div>

      <div class="wp-fl wp-fl--logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="#a99ee0">
          <rect x="3" y="3" width="3.6" height="18" rx="1" />
          <rect x="9.6" y="3" width="11.4" height="3.6" rx="1" />
          <rect x="9.6" y="10.2" width="11.4" height="3.6" rx="1" />
          <rect x="9.6" y="17.4" width="11.4" height="3.6" rx="1" />
        </svg>
      </div>

      <div class="wp-fl wp-fl--perf">
        <div class="wp-fl-box">
          <p class="wp-fl-box__label">Performance</p>
          {
            /* Era a bandeira do Brasil: o servidor daqui era a promessa. A
              infraestrutura agora é global e o que se promete é desempenho,
              então o selo virou um ponteiro de medidor. */
          }
          <svg class="wp-flag" viewBox="0 0 42 30" aria-hidden="true">
            <rect width="42" height="30" rx="2" fill="#f2f1ee" />
            <path
              d="M10 22a11 11 0 0 1 22 0"
              fill="none"
              stroke="#c9c9c9"
              stroke-width="2.8"
              stroke-linecap="round"
            />
            <path
              d="M10 22A11 11 0 0 1 17.8 11.5"
              fill="none"
              stroke="#1f9e4c"
              stroke-width="2.8"
              stroke-linecap="round"
            />
            <path
              d="M21 22 27 13.5"
              stroke="#0a0a0a"
              stroke-width="2.2"
              stroke-linecap="round"
            />
          </svg>
          <p class="wp-fl-box__value">
            Servidor<br />otimizado
          </p>
        </div>
      </div>

      <div class="wp-fl wp-fl--resources">
        <div class="wp-fl-icon">
          <svg viewBox="0 0 24 24" fill="#6fffce" aria-hidden="true">
            <path d="M13.6 0 3 13.4h6.2L8.4 24 19 10.2h-6.2L13.6 0z" />
          </svg>
          <p>
            Recursos<br />Dedicados
          </p>
        </div>
      </div>

      <div class="wp-fl wp-fl--builder">
        <div class="wp-fl-box">
          <p class="wp-fl-box__label">Construa na IA</p>
          <p class="wp-fl-box__value">
            A gente publica
          </p>
        </div>
      </div>
    </div>
  );
}

export function CollageDeploy() {
  return (
    <div class="wp-collage">
      <div class="wp-collage__photo">
        <img
          src="/img/deploy.webp"
          alt=""
          aria-hidden="true"
          width="630"
          height="821"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="wp-fl wp-fl--ssl">
        <div class="wp-fl-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6fffce"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2.2 4.4 5.3v6c0 4.6 3.2 8.8 7.6 10.5 4.4-1.7 7.6-5.9 7.6-10.5v-6L12 2.2z" />
            <path d="M8.6 12.1l2.3 2.3 4.5-4.5" />
          </svg>
          <p>SSL Grátis</p>
        </div>
      </div>

      <div class="wp-fl wp-fl--logo is-light" aria-hidden="true">
        <img
          src="/img/cloudflare.webp"
          alt=""
          width="64"
          height="64"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="wp-fl wp-fl--perf">
        <div class="wp-fl-box">
          {
            /* Aqui o selo é sobre cobrança, não sobre servidor: um "R$" diz o
              que a caixa afirma. Antes era a bandeira do Brasil, que
              prometia a máquina daqui. */
          }
          <svg class="wp-flag" viewBox="0 0 42 30" aria-hidden="true">
            <rect width="42" height="30" rx="2" fill="#f2f1ee" />
            <text
              x="21"
              y="21"
              text-anchor="middle"
              font-family="Instrument Sans, Helvetica, Arial, sans-serif"
              font-size="15"
              font-weight="600"
              fill="#0a0a0a"
            >
              R$
            </text>
          </svg>
          <p class="wp-fl-box__value">
            Preços<br />em reais
          </p>
        </div>
      </div>

      <div class="wp-fl wp-fl--resources">
        <div class="wp-fl-icon">
          <svg viewBox="0 0 24 24" fill="#6fffce" aria-hidden="true">
            <path d="M13.6 0 3 13.4h6.2L8.4 24 19 10.2h-6.2L13.6 0z" />
          </svg>
          <p>
            Alta<br />performance
          </p>
        </div>
      </div>

      <div class="wp-fl wp-fl--builder">
        <div class="wp-fl-box">
          <p class="wp-fl-box__label">Deploy</p>
          <p class="wp-fl-box__value">
            Publique em<br />segundos
          </p>
        </div>
      </div>
    </div>
  );
}
