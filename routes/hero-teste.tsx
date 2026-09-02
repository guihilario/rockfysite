import { Layout } from "@/components/Layout.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { site } from "@/data/site.ts";

const NAV = [
  ["Hospedagem WordPress", "/hospedagem-wordpress"],
  ["E-mail", "/email-profissional"],
  ["Loja digital", "/loja-digital"],
  ["Modelos Elementor", "/hospedagem-elementor-pro"],
];

/**
 * Versão alternativa do topo, para comparar com a que está no ar.
 *
 * Diferenças em relação à hero atual: foto sangrando a tela inteira com o
 * cabeçalho por cima dela, todo o texto numa coluna à esquerda — sobre a
 * área desfocada da foto, que foi enquadrada para isso — e o divisor curvo
 * emendando com a primeira seção, com a forma que veio em `img/divisor.svg`.
 *
 * A diagramação é só duas peças: a seção é uma grade de duas linhas
 * (cabeçalho / corpo) e o resto é flex onde há itens lado a lado.
 *
 * É página de teste: entra com `noindex` e fora do sitemap. Some quando a
 * decisão for tomada, para os dois caminhos não conviverem indefinidamente.
 */
export default function HeroTeste() {
  return (
    <Layout
      rota="/hero-teste"
      titulo="Teste de hero | Rockfy"
      descricao="Versão alternativa do topo da home, para comparação."
      cabecalhoProprio
      naoIndexar
      fluido
    >
      <section class="heroB">
        <img
          class="heroB__foto"
          src="/img/nova-hero.webp"
          alt=""
          aria-hidden="true"
          width="1456"
          height="816"
          fetchpriority="high"
        />
        {
          /* Véu escuro só onde o texto assenta: sem ele o branco some no céu
            claro do lado direito da foto. */
        }
        <div class="heroB__veu" aria-hidden="true"></div>

        <header class="heroB__topo">
          <a class="heroB__logo" href="/" aria-label="Rockfy — página inicial">
            <img
              src="/img/rockfy-logo-w.svg"
              alt="Rockfy"
              width="120"
              height="44"
            />
          </a>
          <nav class="heroB__nav" aria-label="Principal">
            {NAV.map(([rotulo, href]) => <a key={href} href={href}>{rotulo}
            </a>)}
          </nav>
          <a class="heroB__login" href="/admin">[ Login ]</a>
        </header>

        <div class="heroB__corpo">
          <h1 class="heroB__titulo">Bem-vindo a sua nova nuvem</h1>
          <p class="heroB__texto">
            Sites, loja digital, e-mail profissional, WordPress, Elementor
            oficial e deploy de apps feitos com I.A. Rodando no Brasil e com
            atendimento humano para te apoiar nos seus projetos.
          </p>
          <div class="heroB__acoes">
            <a class="heroB__cta" href="/planos">Ver planos</a>
            <a class="heroB__link" href={site.whatsapp}>
              [ Falar com uma pessoa ]
            </a>
          </div>
        </div>

        {
          /* O divisor é o `img/divisor.svg`, inline para o preenchimento poder
            ser o mesmo token de fundo da página — como arquivo ele traria o
            #FFFFFD fixo e deixaria um fio visível na emenda. */
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

      <div class="conteudo heroB__abaixo">
        <span class="heroB__marcas" aria-hidden="true"></span>
      </div>

      <Clients />
    </Layout>
  );
}
