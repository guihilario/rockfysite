import { define } from "@/utils.ts";
import { Shell } from "@/components/admin/Shell.tsx";
import {
  avisarSistemaExterno,
  criarLead,
  ETAPAS_CRM,
  registrarEnvio,
} from "@/domain/leads.ts";
import { formatarTelefone, telefoneValido } from "@/core/formata.ts";

/**
 * Cadastro manual de lead — telefone, indicação, feira. O caminho normal
 * captura o contato sozinho (formulários e checkout); este é para o contato
 * que nasce fora do site e ainda assim precisa entrar no funil.
 */
export const handler = define.handlers({
  GET(ctx) {
    return {
      data: {
        usuario: ctx.state.usuario!,
        aviso: new URL(ctx.req.url).searchParams.get("ok") ?? undefined,
      },
    };
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const vazio = (nome: string): string | null =>
      String(form.get(nome) ?? "").replace(/\s+/g, " ").trim() || null;

    const name = vazio("name");
    const email = vazio("email");
    const phone = vazio("phone");

    if (
      !name || !email || !email.includes("@") ||
      !phone || !telefoneValido(phone)
    ) {
      return new Response(null, {
        status: 303,
        headers: { location: "/mydash/crm/novo-lead?ok=invalido" },
      });
    }

    const lead = await criarLead({
      name,
      email,
      phone: formatarTelefone(phone),
      plan: vazio("plan"),
      source: vazio("source") ?? "manual",
      etapa: vazio("etapa") ?? "novo",
    });
    const status = await avisarSistemaExterno(lead);
    if (status !== "ok") {
      console.warn(`[crm] webhook: ${status} (lead ${lead.id})`);
    }
    await registrarEnvio(lead.id, status);

    return new Response(null, {
      status: 303,
      headers: { location: "/mydash/crm?ok=lead-criado" },
    });
  },
});

const RECADO: Record<string, string> = {
  invalido: "Preencha nome, e-mail e um telefone válido.",
};

export default define.page<typeof handler>(function NovoLead({ data }) {
  return (
    <Shell titulo="Novo lead" usuario={data.usuario} atual="crm">
      <div class="adm-cabeca">
        <div>
          <h1>Cadastrar contato</h1>
          <p class="adm-meta">
            Contato que chegou por fora do site. Ele vai para o funil e avisa o
            CRM externo, como qualquer outro.
          </p>
        </div>
      </div>

      {data.aviso && RECADO[data.aviso] && (
        <p class="aviso">{RECADO[data.aviso]}</p>
      )}

      <form method="post" action="/mydash/crm/novo-lead" class="form">
        <div class="crm-grid">
          <label class="campo">
            <span>Nome</span>
            <input type="text" name="name" required />
          </label>
          <label class="campo">
            <span>E-mail</span>
            <input type="text" name="email" required />
          </label>
          <label class="campo">
            <span>Telefone</span>
            <input
              type="text"
              name="phone"
              required
              placeholder="(11) 99999-9999"
            />
          </label>
          <label class="campo">
            <span>Plano</span>
            <input type="text" name="plan" placeholder="Start" />
          </label>
          <label class="campo">
            <span>Origem</span>
            <input type="text" name="source" placeholder="indicação" />
          </label>
          <label class="campo">
            <span>Etapa inicial</span>
            <select name="etapa">
              {ETAPAS_CRM.map((e) => (
                <option value={e.chave} selected={e.chave === "novo"}>
                  {e.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div class="form-acoes">
          <button class="btn" type="submit">Salvar contato</button>
          <a class="btn btn--ghost espaco" href="/mydash/crm">Cancelar</a>
        </div>
      </form>
    </Shell>
  );
});
