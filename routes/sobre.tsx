import { Layout } from "@/components/Layout.tsx";
import { Blocos, HeroPagina } from "@/components/institucional/HeroPagina.tsx";
import { Posts } from "@/components/sections/Posts.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";
import { CollageDeploy, CollageElementor } from "@/components/Collages.tsx";
import { site } from "@/data/site.ts";

const VALORES = [
  {
    titulo: "Performance",
    texto:
      "Cada milissegundo importa. Servidores afinados para o que roda neles, com monitoramento 24 horas por dia.",
  },
  {
    titulo: "Transparência",
    texto:
      "Sem letra miúda. Preço claro, limites publicados e o valor da renovação igual ao da contratação.",
  },
  {
    titulo: "Suporte de verdade",
    texto:
      "Pessoas que entendem da stack e resolvem o problema. Não usamos agente de IA no atendimento.",
  },
  {
    titulo: "Brasil primeiro",
    texto:
      "Infraestrutura em São Paulo, atendimento em português, nota fiscal em reais e contrato sob a lei brasileira.",
  },
];

const EQUIPE = [
  {
    titulo: "Desenvolvimento",
    texto:
      "Equipe especializada em infraestrutura e performance, e nas plataformas que a gente hospeda — de WordPress a aplicações modernas. Desenvolve as soluções da casa e mantém tudo atualizado.",
  },
  {
    titulo: "Suporte",
    texto:
      "Time dedicado ao atendimento. Todo mundo aqui mexe no servidor de verdade, tem acesso e autonomia para resolver — sem repassar seu chamado para outra fila.",
  },
];

const PRODUTOS = [
  {
    titulo: "Hospedagem WordPress",
    texto: "Conta cPanel isolada, domínios ilimitados, migração grátis.",
    href: "/hospedagem-wordpress",
  },
  {
    titulo: "Hospedagem com Elementor Pro",
    texto: "Licença original inclusa e ativada na sua conta.",
    href: "/hospedagem-elementor-pro",
  },
  {
    titulo: "Deploy [I.A]",
    texto:
      "Publique o app que você criou na I.A, sem servidor para administrar.",
    href: "/deploy",
  },
  {
    titulo: "Loja digital",
    texto: "Catálogo, PIX sem taxa e pedido no WhatsApp.",
    href: "/loja-digital",
  },
  {
    titulo: "E-mail profissional",
    texto: "Seu domínio no endereço, incluso na hospedagem ou avulso.",
    href: "/email-profissional",
  },
];

/**
 * Quem somos.
 *
 * Duas coisas do site anterior ficaram de fora de propósito:
 *
 * • O painel de uptime "99,9% garantido com crédito proporcional". É um
 *   SLA, e o §8.4 dos Termos diz que não há SLA específico. Publicar os
 *   dois em paralelo é o pior cenário — a oferta vincula o fornecedor
 *   (CDC art. 30) enquanto o contrato diz o contrário.
 *
 * • A contagem de sites hospedados e o tempo de casa. São afirmações que
 *   ninguém confirmou; entram quando alguém puder confirmá-las.
 *
 * A razão social, o CNPJ e o endereço ficam porque são verificáveis e já
 * constam dos próprios Termos.
 */
export default async function Sobre() {
  const posts = await carregarFaixaPosts();
  return (
    <Layout
      rota="/sobre"
      titulo="Sobre a Rockfy: quem cuida da sua infraestrutura"
      descricao="A nuvem brasileira de quem constrói na internet: hospedagem, deploy, loja digital e e-mail num painel só. Servidor em São Paulo e suporte por gente."
      fluido
    >
      <HeroPagina
        tagline="Sobre a Rockfy"
        h1={
          <>
            A nuvem brasileira para <b>tudo que você põe no ar</b>
          </>
        }
        lede="Site, aplicação, loja e e-mail costumam morar em quatro lugares diferentes, cada um com um suporte que não resolve. A Rockfy existe para juntar isso num painel só, com preço em reais e gente do outro lado."
        acoes={
          <>
            <a class="cta" href="/planos">
              Ver planos
              <span class="badge">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
            <a class="cta cta--ghost" href={site.whatsapp}>
              Falar com uma pessoa
            </a>
          </>
        }
      />

      <section class="section dotted" aria-labelledby="historia">
        <div class="conteudo">
          <div class="split">
            <div>
              <span class="tagline">Nossa história</span>
              <h2 class="title" id="historia">
                Começou como <em>problema nosso</em>
              </h2>
              <p class="para">
                Começamos como uma software house, entregando projetos para
                clientes corporativos. A cada entrega, o mesmo problema: a
                hospedagem genérica não aguentava a carga, e o suporte do outro
                lado não resolvia.
              </p>
              <p class="para">
                Decidimos cuidar da infraestrutura nós mesmos. A Rockfy começou
                pela hospedagem — servidor afinado, cache configurado do jeito
                certo — e foi crescendo junto com o que os nossos clientes
                precisavam colocar no ar.
              </p>
              <p class="para">
                Hoje não é só site. É a aplicação que alguém montou com I.A, a
                loja que vende no WhatsApp, o e-mail com domínio próprio. Mudou
                o que se publica na internet; não mudou quem cuida disso.
              </p>
            </div>
            <CollageDeploy />
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="valores">
        <div class="conteudo">
          <span class="tagline">Valores</span>
          <Blocos
            titulo={
              <>
                No que a gente <b>acredita</b>
              </>
            }
            itens={VALORES}
            colunas={2}
          />
        </div>
      </section>

      <section class="section dotted" aria-labelledby="equipe">
        <div class="conteudo">
          <span class="tagline">Equipe</span>
          <Blocos
            titulo={
              <>
                Quem está <em>do outro lado</em>
              </>
            }
            itens={EQUIPE}
            colunas={2}
          />
        </div>
      </section>

      <section class="section" aria-labelledby="empresa">
        <div class="conteudo">
          <div class="split split--rev">
            <div>
              <span class="tagline">Empresa brasileira</span>
              <h2 class="title" id="empresa">
                Empresa brasileira, <b>servidor brasileiro</b>
              </h2>
              <p class="para">
                A Rockfy é marca da {site.razaoSocial}, CNPJ{" "}
                {site.cnpj}, com sede em {site.cidade} —{" "}
                {site.endereco.split(" — ")[0]}.
              </p>
              <p class="para">
                Nossos servidores ficam em datacenter em São Paulo, com
                LiteSpeed, NVMe SSD e backup diário. Emitimos nota fiscal em
                reais, o contrato é regido pela lei brasileira e o foro é a
                Comarca de Jundiaí.
              </p>
              <p class="para">
                Isso não é burocracia: é diferencial. Boa parte da hospedagem
                barata tem servidor aqui e empresa no exterior — se algo der
                errado, você resolve em outro fuso e em outro idioma.
              </p>
            </div>
            <CollageElementor />
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="produtos">
        <div class="conteudo">
          <span class="tagline">Produtos</span>
          <Blocos
            titulo={
              <>
                O que a gente <b>faz</b>
              </>
            }
            itens={PRODUTOS}
            colunas={2}
          />
        </div>
      </section>

      <Posts posts={posts} />
    </Layout>
  );
}
