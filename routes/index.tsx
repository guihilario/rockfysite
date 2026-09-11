import { Layout } from "@/components/Layout.tsx";
import { VitrineProduto } from "@/components/sections/VitrineProduto.tsx";
import { HeroDeploy } from "@/components/heroes/DeployStage.tsx";
import { HeroElementor } from "@/components/heroes/HeroElementor.tsx";
import { HeroEmail } from "@/components/heroes/HeroEmail.tsx";
import { HeroLoja } from "@/components/heroes/HeroLoja.tsx";
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

      {
        /* A prova social vem imediatamente depois da foto: aqui a abertura
           é a hero, então esta é a segunda seção de fato. */
      }

      <Clients />

      <Audience />

      <VitrineProduto
        invertido
        tagline="CloudDeploy"
        titulo={
          <>
            Crie na sua I.A, <b>a gente coloca no ar</b>
          </>
        }
        texto="Publique a aplicação que você criou com o poder de escala e infraestrutura do Google. Simples e sem você lidar com servidor."
        cta="Ver o CloudDeploy"
        href="/deploy"
      >
        <HeroDeploy />
      </VitrineProduto>

      <VitrineProduto
        tagline="Hospedagem de site"
        titulo={
          <>
            Elementor Pro <b>oficial</b>, já ativado
          </>
        }
        texto="Conta cPanel isolada, licença original inclusa e migração feita pelo nosso time. Você constrói; a licença e o servidor são problema nosso."
        cta="Ver hospedagem"
        href="/hospedagem-elementor-pro"
      >
        <HeroElementor />
      </VitrineProduto>

      <VitrineProduto
        invertido
        tagline="Loja digital"
        titulo={
          <>
            Sua loja no ar <b>sem taxa</b> por pedido
          </>
        }
        texto="Catálogo, PIX que cai direto na sua conta e pedido chegando no WhatsApp. Você monta pelo celular e começa a vender no mesmo dia."
        cta="Ver a loja digital"
        href="/loja-digital"
      >
        <HeroLoja />
      </VitrineProduto>

      <VitrineProduto
        tagline="E-mail profissional"
        titulo={
          <>
            Seu endereço, <b>sem pagar por caixa</b>
          </>
        }
        texto="Crie os e-mails da empresa com o seu domínio e divida o armazenamento entre as caixas. Antispam, webmail e configuração assistida inclusos."
        cta="Ver e-mail profissional"
        href="/email-profissional"
      >
        <HeroEmail />
      </VitrineProduto>

      <CuidaDeTudo
        titulo={
          <>
            Pode deixar <b>a gente cuida de tudo</b> <em>pra você</em>
          </>
        }
      />
      <AreaCliente />
      <Planos />
      <Parceiros />
      <Faq />
      <Posts posts={posts} />
    </Layout>
  );
}
