import { Layout } from "@/components/Layout.tsx";
import {
  ATUALIZADO_EM,
  INTRO_PRIVACIDADE,
  INTRO_TERMOS,
  privacidade,
  type SecaoLegal,
  termos,
} from "@/data/legal.ts";

/**
 * Quebra um parágrafo nas cláusulas numeradas que ele contém.
 *
 * A origem guardava "1.1. ... 1.2. ... 1.3. ..." numa string só, o que na
 * tela virava um bloco corrido difícil de ler — e as cláusulas se citam por
 * número, então precisam ser localizáveis. A divisão é só visual: juntar as
 * partes de volta com um espaço devolve a string original, caractere a
 * caractere, e isso vale para os 47 parágrafos do documento.
 */
function clausulas(texto: string): string[] {
  return texto.split(/(?<=[.;])\s+(?=\d+\.\d+\.\s)/).filter(Boolean);
}

function Documento(
  { id, titulo, intro, secoes }: {
    id: string;
    titulo: string;
    intro: string;
    secoes: SecaoLegal[];
  },
) {
  return (
    <section class="legal-doc" id={id} aria-labelledby={`${id}-titulo`}>
      <h2 class="legal-doc__titulo" id={`${id}-titulo`}>{titulo}</h2>
      <p class="legal-doc__intro">{intro}</p>
      {
        /* As chaves são índices de propósito. O Fresh serializa o `key` do
          Preact como `data-frsh-key` no HTML servido, então usar o texto da
          cláusula como chave duplicava o documento inteiro num atributo —
          38% desta página eram só isso. */
      }
      {secoes.map((s, i) => (
        <div class="legal-secao" key={i}>
          <h3>{s.titulo}</h3>
          {s.paragrafos?.flatMap(clausulas).map((p, j) => <p key={j}>{p}</p>)}
          {s.itens && (
            <ul>
              {s.itens.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

/**
 * Os dois documentos numa página só, como no site anterior: eles se citam
 * mutuamente, e separá-los faria cada referência virar uma navegação.
 *
 * O texto vem de `data/legal.ts` sem nenhuma reescrita — inclusive a
 * numeração, porque as cláusulas se referenciam por número.
 */
export default function Politicas() {
  return (
    <Layout
      rota="/politicas"
      titulo="Políticas e Termos | Rockfy"
      descricao="Política de Privacidade e Termos de Uso e Prestação de Serviços da Rockfy."
      fluido
    >
      <section class="section pagina-topo" aria-labelledby="titulo-pagina">
        <div class="conteudo">
          <span class="tagline">Transparência</span>
          <h1 class="title" id="titulo-pagina">
            Políticas e <b>termos</b>
          </h1>
          <p class="para pagina-topo__lede">
            As regras que orientam o uso dos serviços Rockfy e o tratamento
            responsável de dados pessoais.
          </p>
          <p class="legal-data">Última atualização: {ATUALIZADO_EM}</p>

          <nav class="legal-nav" aria-label="Documentos legais">
            <a href="#privacidade">Política de Privacidade</a>
            <a href="#termos">Termos de Uso e Prestação de Serviços</a>
          </nav>
        </div>
      </section>

      <section class="section">
        <div class="conteudo">
          <Documento
            id="privacidade"
            titulo="Política de Privacidade e Proteção de Dados"
            intro={INTRO_PRIVACIDADE}
            secoes={privacidade}
          />
          <Documento
            id="termos"
            titulo="Termos de Uso e Prestação de Serviços"
            intro={INTRO_TERMOS}
            secoes={termos}
          />
        </div>
      </section>
    </Layout>
  );
}
