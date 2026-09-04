import { Layout } from "@/components/Layout.tsx";
import { HeroSlot } from "@/components/HeroSlot.tsx";
import { Chips } from "@/components/Chips.tsx";
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

/**
 * A home. É a única página que carrega o schema de FAQPage: a FAQ aparece
 * em todas, mas declarar o rich result em seis URLs faz elas competirem
 * entre si, então a raiz fica sendo a dona.
 */
export default async function Home() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/"
      titulo="Rockfy | Sua nova nuvem: hospedagem, deploy e loja digital"
      descricao="Hospedagem WordPress com servidor em São Paulo, deploy de apps de I.A, loja digital e e-mail profissional num painel só. Preço em reais e suporte por gente."
      faqSchema
      fluido
    >
      {
        /* O h1 e os chips seguem limitados; o hero é a única faixa que
          vai de ponta a ponta — é o que o `fluido` do Layout permite. */
      }
      <div class="conteudo">
        <h1 class="headline">
          <span class="l1">Bem-vindo</span>{" "}
          <span class="l2">à sua nova nuvem</span>
        </h1>
      </div>
      <HeroSlot />
      <div class="conteudo">
        <Chips />
      </div>

      {
        /* A rede de clientes vem logo depois da abertura: é a prova
          social, e ela rende mais perto do topo do que no meio. */
      }
      <Clients />
      <Audience />
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
      <Posts posts={posts} />
    </Layout>
  );
}
