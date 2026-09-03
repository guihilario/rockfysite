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
import { HeroFoto } from "@/components/heroes/HeroFoto.tsx";

/**
 * Home v2 — a versão com a faixa de foto abrindo a página e o palco descido
 * para a segunda seção.
 *
 * Fica numa rota própria enquanto a decisão não é tomada: assim ela
 * continua navegável e comparável lado a lado com a `/`, em vez de virar
 * um arquivo parado que ninguém abre.
 *
 * Entra com `noindex` e sem o schema de FAQPage — esse é da home de
 * verdade, e declarar o mesmo rich result em duas URLs faria as duas
 * competirem entre si.
 */
export default async function HomeV2() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/v2"
      titulo="Home v2 | Rockfy"
      descricao="Hospedagem WordPress, deploy de apps feitos com I.A, loja digital e e-mail profissional em um só painel. Infraestrutura Rockfy, servidor no Brasil."
      naoIndexar
      cabecalhoFlutuante
      fluido
    >
      <HeroFoto />

      {
        /* A prova social vem imediatamente depois da foto: aqui a abertura
           é a hero, então esta é a segunda seção de fato. */
      }
      <Clients />

      {
        /* O palco e os chips descem para depois dela, e sem título próprio:
           quem apresenta a página é a faixa de cima, e um segundo título
           logo abaixo dela repetia a função. */
      }
      <HeroSlot />
      <div class="conteudo">
        <Chips />
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
      <PlanosChamada />
      <Planos />
      <Parceiros />
      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
