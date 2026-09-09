import { PaginaServico } from "@/components/PaginaServico.tsx";
import { HeroWordpress } from "@/components/heroes/HeroWordpress.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

export default async function HospedagemWordpress() {
  const posts = await carregarFaixaPosts();
  return (
    <PaginaServico
      posts={posts}
      rota="/hospedagem-wordpress"
      titulo="Hospedagem WordPress sem travas de construtor | Rockfy"
      descricao="WordPress puro numa conta cPanel isolada: instale os plugins e temas que quiser. Servidor otimizado, migração gratuita e sem fidelidade."
      hero={<HeroWordpress />}
      h1="Hospedagem WordPress para construir do seu jeito"
      lede="Nenhum construtor travado, nenhum tema fechado. WordPress puro, numa conta cPanel isolada, em servidor afinado para ele. A gente migra seu site sem custo."
      cta="Ver planos"
      produtoSchema="Hospedagem WordPress Rockfy"
      planosEyebrow="Hospedagem"
      planosTitulo={
        <>
          WordPress puro, <b>conta isolada</b> e liberdade para construir
        </>
      }
      destaques={[
        { titulo: "Liberdade", linha2: "total" },
        { titulo: "Conta", linha2: "isolada" },
      ]}
    />
  );
}
