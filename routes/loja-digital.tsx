import { PaginaServico } from "@/components/PaginaServico.tsx";
import { HeroLoja } from "@/components/heroes/HeroLoja.tsx";
import { carregarFaixaPosts } from "@/core/conteudo/faixaPosts.ts";

export default async function LojaDigital() {
  const posts = await carregarFaixaPosts();
  return (
    <PaginaServico
      posts={posts}
      rota="/loja-digital"
      titulo="Loja digital pronta pra vender | Rockfy"
      descricao="Sua loja digital pronta pra vender: catálogo no celular, pedido montado no WhatsApp e PIX sem taxa direto na sua conta."
      hero={<HeroLoja />}
      h1="Sua loja digital pronta pra vender"
      lede="Seus produtos num lugar só, o pedido chega montado no WhatsApp e o PIX cai direto na sua conta. Sem taxa por venda."
      cta="Criar minha loja"
      destaques={[
        { titulo: "PIX sem taxa", linha2: "na sua conta" },
        { titulo: "Pedido pronto", linha2: "no WhatsApp" },
      ]}
    />
  );
}
