import { Layout } from "@/components/Layout.tsx";
import { DeployStage } from "@/components/heroes/DeployStage.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import { Audience } from "@/components/sections/Audience.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { CuidaDeTudo } from "@/components/sections/CuidaDeTudo.tsx";
import { AreaCliente } from "@/components/sections/AreaCliente.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { plans } from "@/data/plans.ts";
import { planosSchema } from "@/core/seo/meta.ts";
import { Parceiros } from "@/components/sections/Parceiros.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";
import { faqDeploy } from "@/data/faqDeploy.ts";

/** A página de Deploy. É a única em que "como funciona" (colagem + os três
 *  passos) sobe para segunda seção, logo depois da hero. */
export default async function Deploy() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/deploy"
      titulo="Deploy de apps feitos com IA | Rockfy"
      descricao="Publique a aplicação que você criou na IA com um link pronto para usar, sem lidar com servidor. Deploy gerenciado, preço em reais e suporte em português."
      jsonLd={[
        planosSchema({
          nome: "Rockfy CloudDeploy",
          descricao:
            "Publique a aplicação que você criou na IA com um link pronto para usar, sem lidar com servidor. Deploy gerenciado, preço",
          url: "/deploy",
          planos: plans,
        }),
      ].filter(Boolean)}
      fluido
    >
      <section class="deploy-hero" aria-labelledby="hero-title">
        <div class="conteudo">
          <DeployStage />
          <HeroCopy
            h1="Crie na sua I.A, a gente coloca no ar"
            lede="Publique a aplicação que você criou com o poder de escala e infraestrutura do Google. Simples e sem você lidar com servidor."
            cta="Ver planos"
            rota="/deploy"
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
            Perfeito <b>para o que você está construindo</b> <em>agora</em>
          </>
        }
        colagem="deploy"
        passos
      />
      <Audience />
      <Clients />
      <AreaCliente />
      <Planos
        planos={plans}
        rota="/deploy"
        eyebrow="Planos de Deploy"
        titulo={
          <>
            Publique o app e <b>conecte seu domínio</b>
          </>
        }
      />
      <Parceiros />
      <Faq
        itens={faqDeploy}
        titulo={
          <>
            Perguntas sobre o <b>Deploy</b>
          </>
        }
        texto="Se ficar alguma dúvida, o suporte responde no WhatsApp, das 8h às 22h, todos os dias."
      />
      <Posts posts={posts} />
    </Layout>
  );
}
