import { Layout } from "@/components/Layout.tsx";
import { HeroPagina } from "@/components/institucional/HeroPagina.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { plans } from "@/data/plans.ts";
import { planosSchema } from "@/core/seo/meta.ts";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";
import { site } from "@/data/site.ts";

const DESCRICAO =
  "Planos de hospedagem Rockfy a partir de R$37 por mês: conta cPanel isolada, servidor em São Paulo, SSL, backup diário e migração grátis. Sem fidelidade.";

/**
 * A página dona do preço.
 *
 * O trilho de planos aparecia em cinco páginas e os CTAs mandavam todo
 * mundo para `/#planos`. Duas consequências: quem já estava pesquisando
 * preço caía na home, que é um destino fraco para essa intenção; e as cinco
 * páginas disputavam entre si as buscas por valor, sem nenhuma delas ser a
 * resposta. Agora existe uma URL para isso.
 *
 * A marcação `Product`/`AggregateOffer` vive só aqui, pelo mesmo motivo: em
 * cinco páginas, cada uma declararia ser o produto. Nas outras o trilho
 * continua como componente de conversão, sem marcação.
 */
export default async function PaginaPlanos() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/planos"
      titulo="Planos de hospedagem a partir de R$37/mês | Rockfy"
      descricao={DESCRICAO}
      fluido
      jsonLd={[
        planosSchema({
          nome: "Hospedagem Rockfy",
          descricao: DESCRICAO,
          url: "/planos",
          planos: plans,
        }),
      ].filter(Boolean)}
    >
      <HeroPagina
        tagline="Planos"
        h1={
          <>
            Escolha o plano, <b>o resto a gente resolve</b>
          </>
        }
        lede="Todos os planos vêm com conta isolada, servidor em São Paulo, SSL, backup diário e migração feita pelo nosso time. Cobrança mensal, sem fidelidade."
        acoes={
          <>
            <a class="cta cta--ghost" href={site.whatsapp}>
              Não sei qual escolher
            </a>
          </>
        }
      />

      <Planos />

      <section class="section dotted" aria-labelledby="incluso">
        <div class="conteudo">
          <span class="tagline">Em todos os planos</span>
          <h2 class="title" id="incluso">
            O que <b>já vem junto</b>
          </h2>
          <ol class="steps">
            <li class="step">
              <h3 class="step__t">Migração feita pelo nosso time</h3>
              <p class="step__d">
                Você envia os acessos do provedor atual e a gente devolve tudo
                funcionando, sem custo e sem tempo fora do ar.
              </p>
            </li>
            <li class="step">
              <h3 class="step__t">Servidor em São Paulo</h3>
              <p class="step__d">
                Latência baixa para quem acessa do Brasil, nota fiscal em reais
                e contrato sob a lei brasileira.
              </p>
            </li>
            <li class="step">
              <h3 class="step__t">SSL, backup e suporte por gente</h3>
              <p class="step__d">
                Certificado grátis renovado sozinho, backup diário e atendimento
                de quem tem acesso ao servidor.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
