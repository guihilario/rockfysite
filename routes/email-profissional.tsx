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
      descricao="seunome@suaempresa.com.br com antispam, backup diário e suporte feito por gente. Incluso nos planos de hospedagem da Rockfy ou contratado avulso."
      hero={<HeroEmail />}
      h1="Seu e-mail com a cara do seu negócio"
      lede="Seu negócio com um endereço de e-mail comercial (seunome@empresa.com). Mais confiança, a partir de R$ 19,90/mês e suporte humano."
      cta="Ver planos"
      destaques={[
        { titulo: "Com o seu", linha2: "domínio" },
        { titulo: "Sem custo", linha2: "por caixa" },
      ]}
    />
  );
}
