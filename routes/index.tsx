import { Layout } from "@/components/Layout.tsx";
import { DeployStage } from "@/components/heroes/DeployStage.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import { Audience } from "@/components/sections/Audience.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { CuidaDeTudo } from "@/components/sections/CuidaDeTudo.tsx";
import { AreaCliente } from "@/components/sections/AreaCliente.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Parceiros } from "@/components/sections/Parceiros.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";
import { HeroFoto } from "@/components/heroes/HeroFoto.tsx";

/**
 * A home. Abre com a faixa de foto e apresenta cada produto numa vitrine
 * própria, com a colagem animada do respectivo hero.
 *
 * É a única página que carrega o schema de FAQPage: a FAQ aparece em todas,
 * mas declarar o rich result em seis URLs faz elas competirem entre si,
 * então a raiz fica sendo a dona.
 *
 * A navegação aqui é a lista simples de `data/navV2.ts`, não o mega menu —
 * as páginas internas seguem com ele.
 */
export default async function Home() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/"
      titulo="Rockfy | Sua nova nuvem: hospedagem, deploy e loja digital"
      descricao="Hospedagem WordPress em servidor otimizado, deploy de apps de IA, loja digital e e-mail profissional num painel só. Preço em reais e suporte humanizado."
      faqSchema
      cabecalho="vidro"
      fluido
    >
      <HeroFoto rota="/" />

      <Audience />

      <section class="deploy-hero" aria-labelledby="home-deploy-title">
        <div class="conteudo">
          <DeployStage />
          <HeroCopy
            nivel="h2"
            tituloId="home-deploy-title"
            tituloClass="title"
            h1="Crie na sua I.A, a gente coloca no ar"
            lede="Publique a aplicação que você criou com o poder de escala e infraestrutura de ponta. Simples e sem você lidar com servidor."
            cta="Ver o CloudDeploy"
            ctaHref="/deploy"
            destaques={[
              { titulo: "Link pronto", linha2: "para usar" },
              { titulo: "Sem lidar", linha2: "com servidor" },
            ]}
          />
        </div>
      </section>

      <CuidaDeTudo
        titulo={
          <>
            Pode deixar <b>a gente cuida de tudo</b> <em>pra você</em>
          </>
        }
      />
      <AreaCliente />
      <Clients />
      <Planos />
      <Parceiros />
      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
