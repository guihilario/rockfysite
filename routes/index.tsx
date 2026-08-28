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

/**
 * A home. É a única página que carrega o schema de FAQPage: a FAQ aparece
 * em todas, mas declarar o rich result em seis URLs faz elas competirem
 * entre si, então a raiz fica sendo a dona.
 */
export default function Home() {
  return (
    <Layout
      rota="/"
      titulo="Rockfy | Sua nova nuvem: hospedagem, deploy e loja digital"
      descricao="Hospedagem WordPress, deploy de apps feitos com I.A, loja digital e e-mail profissional em um só painel. Infraestrutura Rockfy, servidor no Brasil."
      faqSchema
    >
      <h1 class="headline">
        <span class="l1">Bem-vindo</span>{" "}
        <span class="l2">à sua nova nuvem</span>
      </h1>
      <HeroSlot />
      <Chips />

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
