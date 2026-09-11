import { PaginaServico } from "@/components/PaginaServico.tsx";
import { HeroEmail } from "@/components/heroes/HeroEmail.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

export default async function EmailProfissional() {
  const posts = await carregarFaixaPosts();
  return (
    <PaginaServico
      posts={posts}
      rota="/email-profissional"
      titulo="E-mail profissional com o seu domínio | Rockfy"
      descricao="seunome@suaempresa.com.br com antispam, backup diário e suporte humanizado. Incluso nos planos de hospedagem da Rockfy ou contratado avulso."
      hero={<HeroEmail />}
      h1="Seu e-mail com a cara do seu negócio"
      lede="Seu negócio com um endereço de e-mail comercial (seunome@empresa.com). Mais confiança, sem contar caixa e com suporte humanizado."
      cta="Ver planos"
      produtoSchema="E-mail profissional Rockfy"
      planosEyebrow="E-mail profissional"
      planosTitulo={
        <>
          Sem pagar por <b>cada endereço</b>
        </>
      }
      destaques={[
        { titulo: "Com o seu", linha2: "domínio" },
        { titulo: "Sem custo", linha2: "por caixa" },
      ]}
    />
  );
}
