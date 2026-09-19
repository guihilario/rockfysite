-- Índices para a busca de ficha do client (2026-09-19).
--
-- A ficha (popover e página) casa leads e pedidos por e-mail exato ou por
-- telefone "limpo" de máscara. O Postgres não usa índice nenhum nessa busca:
-- cada ficha varre as duas tabelas inteiras, re-executando
-- `regexp_replace(phone, '\D', '', 'g')` linha por linha (a expressão mais
-- cara do fluxo). Estes índices funcionais cobrem exatamente as expressões
-- que o SQL consome, sem mudar uma linha de query.
--
-- `regexp_replace` é imutável, então o Planner consegue usá-lo em um índice
-- de expressão — ele guarda a chave já limpa, e a busca por dígitos vira
-- lookup de igualdade em vez de varredura com regex por linha.

CREATE INDEX leads_email_lower_idx ON leads (lower(email));
CREATE INDEX leads_phone_digitos_idx ON leads (regexp_replace(phone, '\D', '', 'g'));
CREATE INDEX orders_email_lower_idx ON orders (lower(email));
CREATE INDEX orders_phone_digitos_idx ON orders (regexp_replace(phone, '\D', '', 'g'));

-- O funil filtra por etapa e quase sempre em ordem "mais recentes primeiro":
-- o índice simples de etapa (0007) ainda obriga a ordenar por created_at
-- depois do filtro. O composto cobre os dois num passe só, tanto no contador
-- (`GROUP BY etapa`) quanto no kanban.
DROP INDEX IF EXISTS leads_etapa_idx;
CREATE INDEX leads_etapa_criado_idx ON leads (etapa, created_at DESC);