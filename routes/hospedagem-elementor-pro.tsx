import { PaginaServico } from "@/components/PaginaServico.tsx";
import { HeroElementor } from "@/components/heroes/HeroElementor.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

export default async function HospedagemElementorPro() {
  const posts = await carregarFaixaPosts();
  return (
    <PaginaServico
      posts={posts}
      rota="/hospedagem-elementor-pro"
      titulo="Hospedagem com Elementor Pro original incluso | Rockfy"
      descricao="Licença Elementor Pro oficial inclusa e ativada automaticamente. Servidor no Brasil, conta isolada e migração grátis."
      hero={<HeroElementor />}
      h1="Hospedagem com Elementor Pro original incluso"
      lede="A licença oficial já vem ativada na sua conta. Você não compra à parte, não renova em dólar e não depende de versão pirata."
      cta="Ver planos"
      destaques={[
        { titulo: "Licença oficial", linha2: "inclusa" },
        { titulo: "Ativação", linha2: "automática" },
      ]}
    />
  );
}
