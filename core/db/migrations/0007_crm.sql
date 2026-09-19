-- Mini-CRM do painel (2026-09-18).
--
-- O painel só listava lead e pedido; para virar gestão de venda, cada contato
-- ganha um lugar no funil (`etapa`), uma anotação livre (`observacao`) e um
-- prazo de retorno (`proximo_contato`). Os pedidos recebem anotação também —
-- registrar "boleto pago dia 01/10" sem alterar o status é o uso mais comum,
-- e misturar isso no endereço do pedido (a alternativa) poluiria o boleto.
--
-- `etapa` é texto com chaves estáveis (novo, contatado, proposta, ganho,
-- perdido). O rótulo e a cor vivem em `domain/leads.ts`, não aqui: a coluna só
-- precisa ser estável; a exibição muda sem migração.

ALTER TABLE leads ADD COLUMN etapa TEXT NOT NULL DEFAULT 'novo';
ALTER TABLE leads ADD COLUMN observacao TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN proximo_contato DATE;

ALTER TABLE orders ADD COLUMN observacao TEXT NOT NULL DEFAULT '';

-- O funil vira o primeiro filtro do CRM; sem índice, contar e filtrar por
-- etapa varre a tabela toda.
CREATE INDEX leads_etapa_idx ON leads (etapa);