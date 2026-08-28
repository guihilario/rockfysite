import { Layout } from "@/components/Layout.tsx";
import { DeployStage } from "@/components/heroes/DeployStage.tsx";
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
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

/** A página de Deploy. É a única em que "como funciona" (colagem + os três
 *  passos) sobe para segunda seção, logo depois da hero. */
export default async function Deploy() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/deploy"
      titulo="Deploy de apps feitos com I.A | Rockfy"
      descricao="Publique a aplicação que você criou na I.A com um link pronto para usar, sem lidar com servidor. Deploy gerenciado pela Rockfy, servidor no Brasil."
      fluido
    >
      <section class="deploy-hero" aria-labelledby="hero-title">
        <div class="conteudo">
          <DeployStage />
          <HeroCopy
            h1="Crie na sua I.A e a gente coloca no ar"
            lede="Sua aplicação ou site feita na I.A com um link pronto para usar, sem você precisar lidar com servidor."
            cta="Entrar na lista de espera"
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
      <PlanosChamada />
      <Planos />
      <Parceiros />
      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
