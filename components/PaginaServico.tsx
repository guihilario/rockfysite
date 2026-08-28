import type { ComponentChildren } from "preact";
import { Layout } from "@/components/Layout.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import { Audience } from "@/components/sections/Audience.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { CuidaDeTudo } from "@/components/sections/CuidaDeTudo.tsx";
import { AreaCliente } from "@/components/sections/AreaCliente.tsx";
import { PlanosChamada } from "@/components/sections/PlanosChamada.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Parceiros } from "@/components/sections/Parceiros.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";

type Props = {
  rota: string;
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
  { rota, titulo, descricao, hero, h1, lede, cta, destaques }: Props,
) {
  return (
    <Layout rota={rota} titulo={titulo} descricao={descricao}>
      {
        /* hero-slot--page compensa a folga que cada arte deixa na moldura,
          para o vão até o texto ficar igual ao da página de Deploy */
      }
      <div class="hero-slot hero-slot--page">{hero}</div>
      <HeroCopy h1={h1} lede={lede} cta={cta} destaques={destaques} />

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
      <PlanosChamada />
      <Planos />
      <Parceiros />
      <Faq />
      <Posts />
    </Layout>
  );
}
