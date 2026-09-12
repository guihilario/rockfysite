import { Layout } from "@/components/Layout.tsx";
import { Blocos, HeroPagina } from "@/components/institucional/HeroPagina.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

export default async function MyDocker() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/my-docker"
      titulo="myDocker | Container isolado em cloud no Brasil"
      descricao="Rode suas aplicações em um container isolado, hospedado em cloud no Brasil e com o suporte da Rockfy."
      fluido
    >
      <HeroPagina
        tagline="myDocker"
        h1={
          <>
            Seu container isolado, <b>em cloud no Brasil</b>
          </>
        }
        lede="Um ambiente dedicado para rodar suas aplicações com previsibilidade, segurança e suporte de quem cuida da infraestrutura."
        acoes={<a class="cta" href="#planos">Conhecer o plano Scale</a>}
      />

      <section class="section dotted" aria-labelledby="my-docker-recursos">
        <div class="conteudo">
          <Blocos
            titulo={
              <>
                Infraestrutura para sua aplicação <b>crescer tranquila</b>
              </>
            }
            itens={[
              {
                titulo: "Container isolado",
                texto:
                  "Recursos separados para sua aplicação, sem dividir o ambiente com outros projetos.",
              },
              {
                titulo: "Cloud no Brasil",
                texto:
                  "Sua aplicação roda perto dos usuários, com cobrança em reais e operação nacional.",
              },
              {
                titulo: "Suporte Rockfy",
                texto:
                  "Você cuida do produto e nosso time ajuda a manter a infraestrutura pronta para ele.",
              },
            ]}
          />
        </div>
      </section>

      <Planos rota="/my-docker" eyebrow="myDocker no plano Scale" />
      <Posts posts={posts} />
    </Layout>
  );
}
