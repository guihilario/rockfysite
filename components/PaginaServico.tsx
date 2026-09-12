import type { ComponentChildren } from "preact";
import { Layout } from "@/components/Layout.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import { Audience } from "@/components/sections/Audience.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { CuidaDeTudo } from "@/components/sections/CuidaDeTudo.tsx";
import { AreaCliente } from "@/components/sections/AreaCliente.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { type Plan, plans } from "@/data/plans.ts";
import { planosSchema } from "@/core/seo/meta.ts";
import { Parceiros } from "@/components/sections/Parceiros.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import type { Post } from "@/domain/posts.ts";

type Props = {
  rota: string;
  /** Os planos desta rota. O padrão é a tabela única do site; só passe algo
   *  aqui se a página precisar de uma oferta diferente das outras. */
  planos?: Plan[];
  /** Nome comercial do produto no dado estruturado. Sem ele a página não
   *  declara `Product`/`AggregateOffer` — é o que decide se o preço pode
   *  aparecer como rich result e se um agente consegue lê-lo. */
  produtoSchema?: string;
  /** Chapéu e título do trilho, quando o padrão não serve à página. */
  planosEyebrow?: string;
  planosTitulo?: ComponentChildren;
  /** Os cards da faixa antes do rodapé, carregados pela rota. */
  posts: Post[];
  titulo: string;
  descricao: string;
  /** O painel de hero da página — um só, sempre visível. */
  hero: ComponentChildren;
  h1: ComponentChildren;
  lede: ComponentChildren;
  cta: string;
  destaques: [
    { titulo: string; linha2: string },
    { titulo: string; linha2: string },
  ];
};

/**
 * O corpo comum das páginas de serviço.
 *
 * As quatro (WordPress, Loja, E-mail, Elementor Pro) só diferem na hero e
 * na copy — o resto da página é idêntico. Antes isso eram quatro arquivos
 * HTML com ~97% de conteúdo repetido.
 */
export function PaginaServico(
  {
    rota,
    titulo,
    descricao,
    hero,
    h1,
    lede,
    cta,
    destaques,
    posts,
    planos = plans,
    produtoSchema,
    planosEyebrow,
    planosTitulo,
  }: Props,
) {
  return (
    <Layout
      rota={rota}
      titulo={titulo}
      descricao={descricao}
      fluido
      jsonLd={produtoSchema
        ? [planosSchema({
          nome: produtoSchema,
          descricao,
          url: rota,
          planos,
        })].filter(Boolean)
        : undefined}
    >
      {
        /* hero-slot--page compensa a folga que cada arte deixa na moldura,
          para o vão até o texto ficar igual ao da página de Deploy */
      }
      <div class="hero-slot hero-slot--page">{hero}</div>
      <div class="conteudo">
        <HeroCopy
          h1={h1}
          lede={lede}
          cta={cta}
          rota={rota}
          destaques={destaques}
        />
      </div>

      <Audience />
      <CuidaDeTudo
        titulo={
          <>
            Pode deixar <b>a gente cuida de tudo</b> <em>pra você</em>
          </>
        }
      />
      <AreaCliente />
      <Clients />
      <Planos
        planos={planos}
        rota={rota}
        eyebrow={planosEyebrow}
        titulo={planosTitulo}
      />
      <Parceiros />
      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
