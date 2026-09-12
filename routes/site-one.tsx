import { Layout } from "@/components/Layout.tsx";
import { Blocos, HeroPagina } from "@/components/institucional/HeroPagina.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";
import { Clients } from "@/components/sections/Clients.tsx";
import { plans } from "@/data/plans.ts";
import { planosSchema } from "@/core/seo/meta.ts";

const DESCRICAO =
  "Publique sites HTML e JavaScript criados com IA, conecte seu domínio e conte com infraestrutura e suporte da Rockfy.";

export default async function SiteOne() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/site-one"
      titulo="siteOne | Publique sites HTML e JavaScript com a Rockfy"
      descricao={DESCRICAO}
      fluido
      jsonLd={[planosSchema({
        nome: "Rockfy siteOne",
        descricao: DESCRICAO,
        url: "/site-one",
        planos: plans,
      })].filter(Boolean)}
    >
      <HeroPagina
        tagline="siteOne"
        h1={
          <>
            Seu site criado com IA, <b>no ar em um clique</b>
          </>
        }
        lede="Envie seu projeto HTML e JavaScript, conecte seu domínio e publique sem precisar configurar servidor."
        acoes={<a class="cta" href="#planos">Ver planos</a>}
      />

      <section class="section dotted" aria-labelledby="site-one-recursos">
        <div class="conteudo">
          <Blocos
            titulo={
              <>
                Do arquivo ao domínio, <b>sem complicação</b>
              </>
            }
            itens={[
              {
                titulo: "Publicação simples",
                texto:
                  "Coloque no ar os sites HTML e JavaScript que você criou com sua ferramenta de IA favorita.",
              },
              {
                titulo: "Domínio personalizado",
                texto:
                  "Use o endereço da sua marca com SSL configurado e renovado automaticamente.",
              },
              {
                titulo: "Cloud no Brasil",
                texto:
                  "Infraestrutura próxima do seu público, cobrança em reais e suporte humanizado.",
              },
            ]}
          />
        </div>
      </section>

      <Clients />
      <Planos rota="/site-one" eyebrow="Planos com siteOne" />
      <Posts posts={posts} />
    </Layout>
  );
}
