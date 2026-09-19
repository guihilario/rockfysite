-- Pedidos gerados pelo checkout.
--
-- O checkout segue o fluxo dos planos (dados → pagamento → confirmação), mas,
-- diferente do lead que só abre o WhatsApp, ele registra uma compra: plano,
-- valor, dados de cobrança e documento. O registro existe antes do pagamento —
-- a intenção de compra não pode depender de um gateway que ainda não confirmou.
--
-- `price_cents` guarda o valor em centavos, não a string de exibição ("R$37"):
-- somar e comparar preço com texto é bug à espera de acontecer. O display fica
-- por conta da camada de apresentação.
--
-- `document`, `phone` e `cep` guardam a versão formatada em padrão brasileiro
-- ((11) 98765-4321, 00.000.000/0000-00, 00000-000) — legível no painel sem
-- reformatar na tela; `payment_method` é a escolha da etapa de pagamento
-- (pix | cartao | boleto) — hoje "zerada", porque a cobrança segue manual pelo
-- WhatsApp, e o banco guarda para quando um gateway entrar.
--
-- O status começa em `pending`: pago o boleto/PIX ou confirmado o cartão, o
-- painel marca `paid` — o pedido não é pago automaticamente, porque Deus não
-- avisa o banco quando cai o dinheiro (ainda).
--
-- `source` registra de onde veio o clique, igual em `leads`: sem isso não dá
-- para saber qual página gera pedido.

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  /* CPF (11) ou CNPJ (14) no formato padrão: 000.000.000-00 / 00.000.000/0000-00. */
  document TEXT NOT NULL,
  company TEXT,
  cep TEXT NOT NULL,
  address TEXT NOT NULL,
  /* Número e complemento separados: o complemento é opcional e, fundido no
     endereço, deixaria a rua com um "ap 42" pendurado sem escapatória. */
  number TEXT NOT NULL,
  complement TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A listagem do painel é sempre "mais recentes primeiro".
CREATE INDEX orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX orders_status_idx ON orders (status);