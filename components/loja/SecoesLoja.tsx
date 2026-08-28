import type { ComponentChildren } from "preact";
import { CenaLoja } from "@/components/loja/CenaLoja.tsx";

/**
 * As faixas de conteúdo da página de loja digital.
 *
 * Todas usam o mesmo `.split` das outras páginas — o que muda entre elas é
 * o lado da imagem, a cena e se a faixa tem a malha de pontos. O texto veio
 * do projeto Tiker; o desenho é o do site.
 */
function Faixa(
  { eyebrow, titulo, texto, cena, invertida, cta, pontilhada, id }: {
    eyebrow: string;
    titulo: ComponentChildren;
    texto: ComponentChildren;
    cena: "atendimento" | "catalogo" | "taxa" | "atualize" | "montagem";
    /** Imagem à esquerda em vez de à direita. */
    invertida?: boolean;
    cta?: string;
    pontilhada?: boolean;
    id?: string;
  },
) {
  const titleId = `${id ?? cena}-titulo`;
  return (
    <section
      class={pontilhada ? "section dotted" : "section"}
      id={id}
      aria-labelledby={titleId}
    >
      <div class="conteudo">
        <div class={invertida ? "split split--rev" : "split"}>
          <div>
            <span class="tagline">{eyebrow}</span>
            <h2 class="title" id={titleId}>{titulo}</h2>
            <p class="para">{texto}</p>
            {cta && (
              <a class="cta" href="#planos">
                {cta}
                <span class="badge">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke-width="1.9"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </a>
            )}
          </div>
          <CenaLoja nome={cena} />
        </div>
      </div>
    </section>
  );
}

export function Atendimento() {
  return (
    <Faixa
      id="atendimento"
      eyebrow="Atendimento"
      cena="atendimento"
      titulo={
        <>
          Facilita o <b>atendimento</b> e os pedidos
        </>
      }
      texto="O cliente escolhe direto pelo seu catálogo digital, o pedido chega no WhatsApp pronto, e você perde menos tempo com atendimento."
    />
  );
}

export function Catalogo() {
  return (
    <Faixa
      id="catalogo"
      eyebrow="Catálogo"
      cena="catalogo"
      invertida
      pontilhada
      titulo={
        <>
          Seu catálogo <em>prontinho pra bombar</em>
        </>
      }
      texto="Em vez de passar um tempão explicando, o link da sua loja digital já fica personalizado com seus produtos, para o seu cliente escolher e pagar."
    />
  );
}

export function TaxaZero() {
  return (
    <Faixa
      id="taxa-zero"
      eyebrow="Taxa zero"
      cena="taxa"
      titulo={
        <>
          Chega de <b>pagar taxa</b>
        </>
      }
      texto="Receba PIX direto na sua conta, sem taxa por pedido."
      cta="Quero parar de pagar taxa"
    />
  );
}

export function Atualize() {
  return (
    <Faixa
      id="atualize"
      eyebrow="No celular"
      cena="atualize"
      pontilhada
      titulo={
        <>
          Atualize fácil <em>e pelo celular</em>
        </>
      }
      texto="Mais simples que postar no Instagram, tão rápido quanto responder um WhatsApp. E a nossa I.A te ajuda."
    />
  );
}

export function Montagem() {
  return (
    <Faixa
      id="montagem"
      eyebrow="A gente monta"
      cena="montagem"
      invertida
      titulo={
        <>
          Configuramos a sua loja a <b>custo zero</b>
        </>
      }
      texto="A gente configura sua loja, define cores, coloca o logo e cadastra até 5 produtos de exemplo pra você seguir o modelo. Você só assiste."
      cta="Montar minha loja"
    />
  );
}
