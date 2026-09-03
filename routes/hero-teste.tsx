import { Layout } from "@/components/Layout.tsx";
import { HeroFoto } from "@/components/heroes/HeroFoto.tsx";
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
      {
        /* O cabeçalho entra dentro da faixa, sobreposto à foto — é o que
          distingue esta página da home, onde vale o `Header` do site. */
      }
      <HeroFoto
        cabecalho={
          <header class="heroB__topo">
            <a
              class="heroB__logo"
              href="/"
              aria-label="Rockfy — página inicial"
            >
              <img
                src="/img/rockfy-logo-w.svg"
                alt="Rockfy"
                width="120"
                height="44"
              />
            </a>
            <nav class="heroB__nav" aria-label="Principal">
              {NAV.map(([rotulo, href]) => (
                <a key={href} href={href}>{rotulo}</a>
              ))}
            </nav>
            <a class="heroB__login" href="/admin">[ Login ]</a>
          </header>
        }
      />

      <div class="conteudo heroB__abaixo">
        <span class="heroB__marcas" aria-hidden="true"></span>
      </div>

      <Clients />
    </Layout>
  );
}
