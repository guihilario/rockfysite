import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import { criarPedido } from "@/domain/orders.ts";
import { planoPorSlug, plans, slugPlano } from "@/data/plans.ts";
import { planosLoja } from "@/data/planosLoja.ts";
import { formatarTelefone, telefoneValido } from "@/core/formata.ts";

/**
 * Lançamento manual de pedido: quem paga por fora (transferência, parcelado
 * no boca a boca) nunca passou pelo checkout — sem esta tela ele ficaria de
 * fora do CRM, e o número do funil mentiria.
 *
 * O preço vem do plano escolhido, mas pode ser alterado no form (desconto
 * comercial). Se o plano digitado não casar com nenhum de um catálogo, o
 * preço vira obrigatório.
 */
export const handler = define.handlers({
  GET(ctx) {
    const u = new URL(ctx.req.url);
    const email = (u.searchParams.get("e") ?? "").trim();
    return {
      data: {
        email,
        voltar: email
          ? `/mydash/crm/cliente?e=${encodeURIComponent(email)}`
          : "",
        usuario: ctx.state.usuario!,
      },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const voltar = String(form.get("voltar") ?? "");
    const paraOnde = voltar.startsWith("/mydash/crm") ? voltar : "/mydash/crm";
    const separador = paraOnde.includes("?") ? "&" : "?";
    const erro = (): Response =>
      new Response(null, {
        status: 303,
        headers: { location: `${paraOnde}${separador}ok=invalido` },
      });

    const vazio = (nome: string): string | null =>
      String(form.get(nome) ?? "").replace(/\s+/g, " ").trim() || null;

    const slug = vazio("plan") ?? "";
    const plano = planoPorSlug(slug);
    const priceReais = String(form.get("priceReais") ?? "").trim().replace(
      ",",
      ".",
    );
    const priceCentsManual = Math.round(Number(priceReais) * 100);
    const priceCents = plano?.priceCents ?? priceCentsManual;

    const name = vazio("name");
    const email = vazio("email");
    const phone = vazio("phone");
    const document = vazio("document");
    const cep = vazio("cep");
    const address = vazio("address");
    const number = vazio("number");
    const city = vazio("city");
    const state = vazio("state");
    const paymentMethod = vazio("paymentMethod") ?? "pix";

    const obrigatorio = [
      name,
      email,
      phone,
      document,
      cep,
      address,
      number,
      city,
      state,
    ];
    if (
      obrigatorio.some((v) => !v) ||
      !email!.includes("@") ||
      !telefoneValido(phone!)
    ) return erro();
    if (plano === null && (!Number.isFinite(priceCents) || priceCents <= 0)) {
      return erro();
    }
    if (!["pix", "cartao", "boleto"].includes(paymentMethod)) return erro();

    await criarPedido({
      plan: plano?.name ?? vazio("plan") ?? "",
      priceCents,
      name: name!,
      email: email!,
      phone: formatarTelefone(phone!),
      document: document!,
      company: vazio("company"),
      cep: cep!,
      address: address!,
      number: number!,
      complement: vazio("complement"),
      city: city!,
      state: state!,
      paymentMethod,
      source: vazio("source"),
    });

    return new Response(null, {
      status: 303,
      headers: {
        location: `${paraOnde}${separador}ok=pedido-criado`,
      },
    });
  },
});

const PLANOS_CATALOGO = [...plans, ...planosLoja].map((p) => ({
  slug: slugPlano(p.name),
  name: p.name,
}));

export default define.page<typeof handler>(function NovoPedido({ data }) {
  return (
    <Shell titulo="Novo pedido" usuario={data.usuario} atual="crm">
      <div class="adm-cabeca">
        <div>
          <h1>Lançar pedido</h1>
          <p class="adm-meta">
            Para pagamentos que não passaram pelo checkout. Use o código do
            plano; preço é o do plano, editável.
          </p>
        </div>
      </div>

      <form method="post" action="/mydash/crm/novo-pedido" class="form">
        <input type="hidden" name="voltar" value={data.voltar} />
        <div class="crm-grid">
          <label class="campo">
            <span>Plano</span>
            <select name="plan">
              {PLANOS_CATALOGO.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </label>
          <label class="campo">
            <span>Valor/mês (R$)</span>
            <input
              type="number"
              name="priceReais"
              min="0"
              step="0.01"
              placeholder="77.00"
            />
          </label>
          <label class="campo">
            <span>Pagamento</span>
            <select name="paymentMethod">
              <option value="pix">PIX</option>
              <option value="cartao">Cartão de crédito</option>
              <option value="boleto">Boleto</option>
            </select>
          </label>
          <label class="campo">
            <span>Nome do cliente</span>
            <input type="text" name="name" required />
          </label>
          <label class="campo">
            <span>E-mail</span>
            <input
              type="text"
              name="email"
              required
              defaultValue={data.email}
            />
          </label>
          <label class="campo">
            <span>Telefone</span>
            <input type="text" name="phone" required />
          </label>
          <label class="campo">
            <span>CPF/CNPJ</span>
            <input type="text" name="document" required />
          </label>
          <label class="campo">
            <span>Empresa</span>
            <input type="text" name="company" />
          </label>
          <label class="campo">
            <span>CEP</span>
            <input type="text" name="cep" required />
          </label>
          <label class="campo">
            <span>Endereço</span>
            <input type="text" name="address" required />
          </label>
          <label class="campo">
            <span>Número</span>
            <input type="text" name="number" required />
          </label>
          <label class="campo">
            <span>Complemento</span>
            <input type="text" name="complement" />
          </label>
          <label class="campo">
            <span>Cidade</span>
            <input type="text" name="city" required />
          </label>
          <label class="campo">
            <span>UF</span>
            <input type="text" name="state" required maxLength={2} />
          </label>
          <label class="campo">
            <span>Origem (página)</span>
            <input type="text" name="source" placeholder="/planos" />
          </label>
          <label class="campo campo--g">
            <span>Anotação</span>
            <textarea
              name="observacao"
              placeholder="Como veio esse pagamento…"
            />
          </label>
        </div>
        <div class="form-acoes">
          <button class="btn" type="submit">Salvar pedido</button>
          <a class="btn btn--ghost espaco" href={data.voltar || "/mydash/crm"}>
            Cancelar
          </a>
        </div>
      </form>
    </Shell>
  );
});
