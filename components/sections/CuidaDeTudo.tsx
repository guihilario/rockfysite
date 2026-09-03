import type { ComponentChildren } from "preact";
import { CollageDeploy, CollageElementor } from "@/components/Collages.tsx";

type Props = {
  /** O título da seção, que muda entre a home e a página de Deploy. */
  titulo: ComponentChildren;
  /** "elementor" na home e nas páginas de serviço; "deploy" na de Deploy. */
  colagem?: "elementor" | "deploy";
  /** Os três passos, só na página de Deploy. */
  passos?: boolean;
};

/** Seção da colagem + copy. É a mesma peça em todas as páginas; o que muda
 *  é o título, qual colagem entra e se a faixa de passos aparece. */
export function CuidaDeTudo(
  { titulo, colagem = "elementor", passos = false }: Props,
) {
  return (
    <>
      {/* ══════ A GENTE CUIDA DE TUDO ══════ */}
      <section class="section dotted">
        <div class="conteudo">
          <div class="split split--rev">
            <div>
              <span class="tagline">Atendimento humanizado</span>
              <h2 class="title">{titulo}</h2>
              <p class="para">
                Configuramos e deixamos tudo pronto pra você operar, sem custo
                extra, ativação de licenças oficiais e suporte humanizado que
                resolve. Você foca em gerar valor para o seu cliente, e a gente
                da sua infra.
              </p>
              <a class="cta" href="#planos">
                Ver planos
                <span class="badge">
                  <svg viewBox="0 0 40 40">
                    <circle cx="20" cy="8" r="2.8" />
                    <circle cx="32" cy="20" r="2.8" />
                    <circle cx="20" cy="32" r="2.8" />
                    <circle cx="8" cy="20" r="2.8" />
                  </svg>
                </span>
              </a>
            </div>

            {colagem === "deploy" ? <CollageDeploy /> : <CollageElementor />}
          </div>
          {passos && (
            <ol class="steps">
              <li class="step">
                <span class="step__n">[ 01 ]</span>
                <h3 class="step__t">
                  Conecte o repositório ou envie o projeto
                </h3>
                <p class="step__d">
                  Páginas em HTML, aplicações em React, Next.js, Vite ou Astro.
                </p>
              </li>
              <li class="step">
                <span class="step__n">[ 02 ]</span>
                <h3 class="step__t">A gente detecta o build e publica</h3>
                <p class="step__d">
                  Sem arquivo de configuração, sem YAML, sem DevOps.
                </p>
              </li>
              <li class="step">
                <span class="step__n">[ 03 ]</span>
                <h3 class="step__t">Domínio próprio e SSL configurados</h3>
                <p class="step__d">
                  Seu projeto no ar, com endereço definitivo.
                </p>
              </li>
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
