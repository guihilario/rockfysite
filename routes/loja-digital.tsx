import { Layout } from "@/components/Layout.tsx";
import { HeroLoja } from "@/components/heroes/HeroLoja.tsx";
import { HeroCopy } from "@/components/HeroCopy.tsx";
import {
  Atendimento,
  Atualize,
  Catalogo,
  Montagem,
  TaxaZero,
} from "@/components/loja/SecoesLoja.tsx";
import { CenaLoja } from "@/components/loja/CenaLoja.tsx";
import { Clients } from "@/components/sections/Clients.tsx";
import { Planos } from "@/components/sections/Planos.tsx";
import { Faq } from "@/components/sections/Faq.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { planosLoja } from "@/data/planosLoja.ts";
import { planosSchema } from "@/core/seo/meta.ts";
import { faqLoja } from "@/data/faqLoja.ts";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

/**
 * A loja digital não usa o `PaginaServico`.
 *
 * As outras páginas de produto vendem hospedagem e compartilham as mesmas
 * faixas (público, parceiros, "a gente cuida de tudo"). Esta vende outra
 * coisa, com planos por quantidade de produtos e um percurso próprio, então
 * monta a sua própria sequência — o desenho continua sendo o do site, e os
 * depoimentos continuam sendo os nossos.
 */
export default async function LojaDigital() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/loja-digital"
      titulo="Loja digital pronta pra vender | Rockfy"
      descricao="Sua loja digital pronta pra vender: catálogo no celular, pedido montado no WhatsApp e PIX sem taxa direto na sua conta. Teste 7 dias grátis."
      fluido
      /* A marcação de preço fica aqui porque esta é a única página que
         mostra estes planos — ao contrário dos de hospedagem, que apareciam
         em cinco e por isso foram para /planos. */
      jsonLd={[
        planosSchema({
          nome: "Loja digital Rockfy",
          descricao:
            "Loja digital com catálogo no celular, pedido no WhatsApp e PIX sem taxa por pedido. A partir de R$47,90 por mês, com 7 dias grátis.",
          url: "/loja-digital",
          planos: planosLoja,
        }),
      ].filter(Boolean)}
    >
      <div class="hero-slot hero-slot--page">
        <HeroLoja />
      </div>
      <div class="conteudo">
        <HeroCopy
          h1="Sua loja digital pronta pra vender em todo lugar"
          lede="Seus produtos em um só lugar pra seu cliente comprar pelo celular e no WhatsApp."
          cta="Começar grátis"
          destaques={[
            { titulo: "PIX sem taxa", linha2: "na sua conta" },
            { titulo: "Pedido pronto", linha2: "no WhatsApp" },
          ]}
        />
      </div>

      <Atendimento />
      <Catalogo />
      <TaxaZero />
      <Atualize />

      {
        /* A chamada dos planos: mesma faixa `.split` das outras, mas o botão
          fica de fora porque o trilho de planos vem logo abaixo. */
      }
      <section class="section" aria-labelledby="planos-chamada">
        <div class="conteudo">
          <div class="split">
            <div>
              <span class="tagline">Planos</span>
              <h2 class="title" id="planos-chamada">
                Tudo que você precisa.{" "}
                <em>
                  <br />Nada que você não usa.
                </em>
              </h2>
              <p class="para">No precinho pra você vender mais.</p>
            </div>
            <CenaLoja nome="planos" />
          </div>
        </div>
      </section>

      <Planos
        planos={planosLoja}
        eyebrow="Escolha o seu"
        titulo={
          <>
            Comece com <b>7 dias grátis</b>
          </>
        }
      />

      <Montagem />
      <Clients />

      <Faq
        itens={faqLoja}
        titulo={
          <>
            Ainda na <b>dúvida?</b>
          </>
        }
        texto="Algumas perguntas que a gente mais ouve. Se ficar alguma, o atendimento responde no WhatsApp, das 8h às 22h, todos os dias."
        cta="Falar com o atendimento"
      />

      <Posts posts={posts} />
    </Layout>
  );
}
