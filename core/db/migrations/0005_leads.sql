-- Captura de interessados nos planos.
--
-- O formulário vive num popover nativo, envia por POST comum e o servidor
-- responde com um redirect para o WhatsApp: sem JavaScript no caminho, o
-- fluxo funciona igual com o script bloqueado.
--
-- `plan` e `source` guardam de onde veio o clique — sem isso não dá para
-- saber qual página e qual faixa de preço geram contato, que é a única
-- pergunta interessante sobre esta tabela.

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  /* Nome do plano que originou o clique; nulo se vier de um botão solto. */
  plan TEXT,
  /* Caminho da página de origem, ex.: "/planos". */
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  /* Resultado do envio para o sistema externo: "ok", "sem webhook" ou a
     mensagem do erro. Guardado para o lead não se perder em silêncio
     quando o CRM estiver fora do ar. */
  webhook_status TEXT,
  webhook_at TIMESTAMPTZ
);

-- A listagem do painel é sempre "mais recentes primeiro".
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

-- Configuração editável pelo painel. Hoje só a URL do webhook, mas a tabela
-- é genérica de propósito: a alternativa era uma variável de ambiente, e aí
-- mudar o endereço do CRM exigiria um deploy.
CREATE TABLE settings (
  name TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
