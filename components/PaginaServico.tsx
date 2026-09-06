import type { ComponentChildren } from "preact";
import { Layout } from "@/components/Layout.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import { Audience } from "@/components/sections/Audience.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { CuidaDeTudo } from "@/components/sections/CuidaDeTudo.tsx";
import { AreaCliente } from "@/components/sections/AreaCliente.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import type { Plan } from "@/data/plans.ts";
import { Parceiros } from "@/components/sections/Parceiros.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import type { Post } from "@/domain/posts.ts";

type Props = {
  rota: string;
  /** Os planos desta rota. Cada linha de produto tem a sua tabela (spec §5-7);
   *  sem isto todas as páginas mostrariam os planos de hospedagem. */
  planos?: Plan[];
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
    planos,
    planosEyebrow,
    planosTitulo,
  }: Props,
) {
  return (
    <Layout rota={rota} titulo={titulo} descricao={descricao} fluido>
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
      <Clients />
      <CuidaDeTudo
        titulo={
          <>
            Pode deixar <b>a gente cuida de tudo</b> <em>pra você</em>
          </>
        }
      />
      <AreaCliente />
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
