import type { ComponentChildren } from "preact";
import { alvoDosPlanos } from "@/core/navegacao.ts";

type Destaque = { titulo: string; linha2: string };

type Props = {
  h1: ComponentChildren;
  lede: ComponentChildren;
  cta: string;
  /** Destino explícito quando o botão não aponta para os planos. */
  ctaHref?: string;
  /** Caminho da página, para o CTA decidir entre rolar até o trilho de
   *  planos e navegar para /planos. */
  rota?: string;
  /** Os dois destaques abaixo do botão: faísca vermelha e raio menta. */
  destaques: [Destaque, Destaque];
  /** A home reutiliza este bloco como seção, portanto o título vira h2. */
  nivel?: "h1" | "h2";
  tituloId?: string;
  tituloClass?: string;
};

/** O bloco de texto que acompanha a hero nas páginas de serviço e na de
 *  Deploy: H1, lede, botão e dois destaques. */
export function HeroCopy({
  h1,
  lede,
  cta,
  ctaHref,
  rota,
  destaques,
  nivel = "h1",
  tituloId = "hero-title",
  tituloClass,
}: Props) {
  const Titulo = nivel;
  return (
    <div class="deploy-content">
      <Titulo class={tituloClass} id={tituloId}>{h1}</Titulo>
      <div class="deploy-pitch">
        <p>{lede}</p>
        {
          /* Era um <button> sem type de ação, sem popovertarget e sem nada
            em scripts.js escutando por ele: o CTA principal da hero não
            fazia absolutamente nada ao ser clicado. */
        }
        <a class="deploy-cta" href={ctaHref ?? alvoDosPlanos(rota)}>{cta}</a>
        <div class="deploy-features">
          <div class="deploy-feature">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="#e8402a"
              aria-hidden="true"
            >
              <path d="M12 0c1.05 8.2 3.8 10.95 12 12-8.2 1.05-10.95 3.8-12 12-1.05-8.2-3.8-10.95-12-12C8.2 10.95 10.95 8.2 12 0z" />
            </svg>
            <span>
              {destaques[0].titulo}
              <br />
              {destaques[0].linha2}
            </span>
          </div>
          <div class="deploy-feature">
            <svg
              width="16"
              height="17"
              viewBox="0 0 24 24"
              fill="#6fffce"
              aria-hidden="true"
            >
              <path d="M13.6 0 3 13.4h6.2L8.4 24 19 10.2h-6.2L13.6 0z" />
            </svg>
            <span>
              {destaques[1].titulo}
              <br />
              {destaques[1].linha2}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
