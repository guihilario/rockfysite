import { Layout } from "@/components/Layout.tsx";
import { Blocos, HeroPagina } from "@/components/institucional/HeroPagina.tsx";
import { site } from "@/data/site.ts";

const CANAIS = [
  {
    titulo: "WhatsApp",
    texto: `O canal mais rápido. ${site.whatsappRotulo}`,
    href: site.whatsapp,
  },
  {
    titulo: "E-mail",
    texto: `Para assuntos que precisam de histórico. ${site.email}`,
    href: `mailto:${site.email}`,
  },
  {
    titulo: "Área do Cliente",
    texto: "Abra um chamado, veja faturas e gerencie seus serviços.",
    href: site.areaCliente,
  },
  {
    titulo: "Central de ajuda",
    texto: "Boa parte das dúvidas já tem resposta pronta.",
    href: "/ajuda",
  },
];

const ANTES_DE_CHAMAR = [
  {
    titulo: "Tenha em mãos o domínio do site",
    texto: "É por ele que a gente localiza sua conta.",
  },
  {
    titulo: "Descreva o que você já tentou",
    texto: "Mesmo que pareça bobo. Economiza a primeira rodada de perguntas.",
  },
  {
    titulo: "Se for algo fora do ar, avise a urgência",
    texto:
      "Site institucional parado e loja parada em dia de campanha são situações diferentes, e a gente prioriza.",
  },
];

const ASSUNTOS = [
  {
    titulo: "Comercial e escolha de plano",
    texto: "WhatsApp.",
    href: site.whatsapp,
  },
  {
    titulo: "Financeiro e faturas",
    texto: "Área do Cliente.",
    href: site.areaCliente,
  },
  {
    titulo: "Privacidade e dados pessoais (LGPD)",
    texto: site.email,
    href: `mailto:${site.email}`,
  },
];

/**
 * Fale com a gente.
 *
 * ATENÇÃO — a faixa de horário de atendimento do site anterior NÃO foi
 * trazida, e a omissão é deliberada. Existem hoje três horários publicados
 * em lugares diferentes, e eles se contradizem:
 *
 *   • Termos §2.4  — e-mail ou Área do Cliente, seg a sex, 9h às 18h
 *   • site antigo  — suporte técnico 24h, todo dia, WhatsApp
 *   • FAQ no ar    — chat e WhatsApp, 8h às 22h, todos os dias
 *
 * No Brasil a oferta publicitária vincula o fornecedor (CDC art. 30), então
 * anunciar um horário mais amplo que o do contrato cria obrigação real.
 * Enquanto ninguém disser qual dos três é o verdadeiro, esta página lista
 * os canais sem prometer janela de atendimento — que é a única versão que
 * não contradiz nada.
 */
export default function Contato() {
  return (
    <Layout
      rota="/contato"
      titulo="Fale com a Rockfy: WhatsApp, e-mail e suporte"
      descricao="Fale com a Rockfy por WhatsApp, e-mail ou Área do Cliente. Atendimento em português, feito por pessoas que mexem no servidor — não por robô."
      fluido
    >
      <HeroPagina
        tagline="Contato"
        h1={
          <>
            Fala com a gente, <em>tem gente do outro lado</em>
          </>
        }
        lede="Escolha o canal que preferir — a gente responde no mesmo idioma e no mesmo fuso."
        acoes={
          <>
            <a class="cta" href={site.whatsapp}>
              Chamar no WhatsApp
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
            <a class="cta cta--ghost" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </>
        }
      />

      <section class="section dotted" aria-labelledby="canais">
        <div class="conteudo">
          <span class="tagline">Canais</span>
          <Blocos
            titulo={
              <>
                Por onde <b>falar com a gente</b>
              </>
            }
            itens={CANAIS}
            colunas={2}
          />
        </div>
      </section>

      <section class="section" aria-labelledby="antes">
        <div class="conteudo">
          <span class="tagline">Ajuda a ajudar</span>
          <Blocos
            titulo={
              <>
                Antes de chamar, <em>se puder</em>
              </>
            }
            itens={ANTES_DE_CHAMAR}
          />
        </div>
      </section>

      <section class="section dotted" aria-labelledby="assuntos">
        <div class="conteudo">
          <span class="tagline">Outros assuntos</span>
          <Blocos
            titulo={
              <>
                Cada assunto tem <b>seu caminho</b>
              </>
            }
            itens={ASSUNTOS}
          />
        </div>
      </section>

      <section class="section" aria-labelledby="endereco">
        <div class="conteudo">
          <span class="tagline">Onde a gente fica</span>
          <h2 class="title" id="endereco">
            Empresa brasileira, <b>endereço de verdade</b>
          </h2>
          <p class="para">
            {site.razaoSocial} — CNPJ {site.cnpj}
          </p>
          <p class="para">{site.endereco}</p>
        </div>
      </section>
    </Layout>
  );
}
