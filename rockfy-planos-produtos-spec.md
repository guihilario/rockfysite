# Rockfy — Especificação de Produtos, Planos e Páginas

**Versão:** 1.1  
**Data:** 6 de setembro de 2026  
**Objetivo:** separar comercialmente os produtos da Rockfy, mantendo uma conta e um painel integrados.

---

## 1. Resultado esperado

Cada produto terá proposta, público, planos, limites, CTA e FAQ próprios. O cliente poderá contratar vários produtos na mesma conta e receber cobrança consolidada, mas nenhum produto deverá ser incluído artificialmente no plano de outro.

Linhas comerciais:

1. Rockfy Deploy — aplicação, banco, domínio e recursos de produção.
2. Rockfy WordPress — hospedagem isolada com Elementor Pro.
3. Rockfy E-mail — e-mail por domínio e armazenamento.
4. Rockfy Loja Digital — catálogo, pedidos, Pix e PDV.
5. Rockfy para Agências — planos combinados de WordPress, Deploy, E-mail e gestão.
6. Rockfy Operação — infraestrutura gerenciada a partir de R$ 1.500/mês.

---

## 2. Restrições obrigatórias

### 2.1 Preservar o site

- Não redesenhar o site nem substituir o design system.
- Não alterar tipografia, cores, grid, animações, header ou footer.
- Não refatorar páginas ou componentes fora do escopo.
- Reutilizar seções, cards, botões, acordeões e carrosséis existentes.
- Criar páginas novas com a mesma linguagem visual.
- Preservar responsividade, SEO, metadados e dados estruturados; atualizar apenas o conteúdo afetado.

### 2.2 Preservar a arquitetura

- Manter Deno e Fresh.
- Não adicionar Vite ou node_modules.
- Manter HTML-first.
- Não componentizar páginas inteiras.
- Se os preços estiverem hardcoded, fazer a menor alteração para receber configuração por produto.
- Não criar CMS nem abstração complexa.
- Não quebrar rotas ou links antigos.

Os valores e limites deste documento são a fonte de verdade da versão 1.0.

---

## 3. Rotas

### Existentes

| Rota | Função nova |
|---|---|
| /deploy | Somente Rockfy Deploy |
| /hospedagem-wordpress | Somente Rockfy WordPress |
| /hospedagem-elementor-pro | Aquisição para os mesmos planos WordPress |
| /email-profissional | Somente Rockfy E-mail |
| /loja-digital | Somente Loja Digital |
| /planos | Catálogo das linhas de produto |

### Novas

| Rota | Função |
|---|---|
| /para-agencias | Operação multicliente e pacote completo |
| /operacao-gerenciada | Serviço gerenciado |

Se /hospedagem-para-agencias vier a ser usado, redirecionar permanentemente para /para-agencias.

---

## 4. Regras comuns

- Valores mensais em reais, sem fidelidade.
- Cancelamento pelo painel.
- Nota fiscal em reais.
- Upgrade imediato com diferença proporcional.
- Downgrade no ciclo seguinte.
- Não usar “ilimitado” para recurso de custo variável, exceto caixas de e-mail dentro do armazenamento total e sob uso legítimo.
- O plano recomendado deve ser destacado.
- Cada card deve dizer para quem o plano foi criado.
- Excedente deve gerar bloqueio, pacote adicional ou upgrade, nunca cobrança surpresa.

---

## 5. Rockfy Deploy

### Posicionamento

**Headline atual:** Publique seu app e conecte seu domínio em um único painel.

**Apoio atual:** Publique aplicações criadas com IA ou código próprio. A Rockfy configura o build, o SSL e a infraestrutura para colocar o projeto em produção.

**Mensagem de roadmap:** Postgres gerenciado no mesmo painel — em breve.

Quando o banco estiver efetivamente disponível, substituir a headline por “Seu app, banco e domínio em um único painel” e incluir o Postgres no texto de apoio.

**CTA principal:** Publicar meu projeto  
**CTA secundário:** Ver compatibilidade

### Público

Usuários de Lovable, v0 e Bolt; vibecoders; desenvolvedores; freelancers; consultores de IA; estúdios e pequenos SaaS.

### Planos

| Recurso | Launch | Pro | Studio | Scale |
|---|---:|---:|---:|---:|
| Preço | R$ 47 | R$ 97 | R$ 197 | R$ 397 |
| Aplicações | 1 | 3 | 10 | 25 |
| Bancos Postgres — em breve | 1 | 3 | 10 | 25 |
| Armazenamento total — em breve | 1 GB | 5 GB | 15 GB | 40 GB |
| Operações de banco/mês — em breve | 100 mil | 500 mil | 1 milhão | 3 milhões |
| Domínios próprios | 1 | 3 | 10 | 25 |
| SSL | Sim | Sim | Sim | Sim |
| Git ou upload | Sim | Sim | Sim | Sim |
| Variáveis e secrets | Sim | Sim | Sim | Sim |
| Logs | 24 horas | 7 dias | 15 dias | 30 dias |
| Backup de banco | 7 dias | 7 dias | 7 dias | 30 dias |
| Rollback | Básico | Sim | Sim | Sim |
| Organização por cliente | Não | Não | Sim | Sim |
| Suporte | Normal | Prioritário | Prioritário | Prioritário |

**Recomendado:** Pro.

### Extras

| Extra | Valor |
|---|---:|
| Aplicação adicional sem banco | R$ 19/mês |
| Aplicação adicional com Postgres — em breve | R$ 39/mês |
| Operação gerenciada | A partir de R$ 1.500/mês |

Não publicar preço de armazenamento e operações adicionais até validar custo por unidade. Usar temporariamente “consulte franquias adicionais”.

### Rockfy Database

**Disponibilidade inicial:** em breve. A interface deve ser preparada, mas o recurso não pode aparecer como ativo, incluso ou contratável antes da integração entrar em produção.

- Nome comercial: Rockfy Database.
- Descrição: Postgres gerenciado.
- Prisma é fornecedor interno e não produto comercial.
- Painel chama a API Rockfy; apenas o backend chama o provedor.
- Nunca expor token administrativo.
- Um banco isolado por projeto.
- Conexão pooled para runtime e direta para migrations.
- Credenciais em secrets criptografados.
- Permitir exportação.
- Mostrar status, região, armazenamento e operações.
- Implementar uma flag de disponibilidade equivalente a databaseEnabled=false.
- Enquanto a flag estiver desativada, exibir selo “Em breve”, esconder ações de criação e impedir contratação.
- Quando a flag for ativada, remover o selo sem exigir alteração estrutural na página.

### Região

- Quando o banco for lançado: aplicação e banco juntos na Virgínia.
- Enquanto houver apenas Deploy, exibir a região real da aplicação. Após o lançamento do banco, exibir “Aplicação e banco: Virgínia, EUA”.
- Não afirmar genericamente “infraestrutura no Brasil” nesta página.
- Só oferecer Brasil quando aplicação e banco estiverem próximos e validados.

### Compatibilidade

Inicial: HTML, React, Next.js, Vite, Astro, containers aceitos, Postgres, Prisma ORM, Drizzle e Kysely com migrations válidas.

Não prometer migração automática de todo app Lovable. Supabase Auth, Storage, Realtime, Edge Functions ou RLS complexo podem exigir migração assistida.

### Limite de suporte

Exibir perto dos planos e na FAQ:

> O suporte cobre publicação, infraestrutura, domínio, banco e funcionamento da plataforma. Desenvolvimento, correção do código e migrações complexas podem ser contratados separadamente.

### Ordem das seções

1. Hero.
2. Aplicação + domínio e chamada “Postgres em breve”.
3. Como funciona em três etapas.
4. Compatibilidade.
5. Painel.
6. Planos.
7. Demonstração ou caso real.
8. Oferta para agências.
9. FAQ específica.

Remover cPanel, Elementor, e-mail, planos WordPress, FAQ de WordPress e servidor em São Paulo.

---

## 6. Rockfy WordPress

/hospedagem-wordpress e /hospedagem-elementor-pro vendem o mesmo produto e exibem os mesmos planos. A segunda página muda somente a narrativa de aquisição.

**Headline WordPress:** WordPress puro, conta isolada e liberdade para construir.  
**Headline Elementor:** Hospedagem com Elementor Pro oficial já incluído.  
**CTA:** Hospedar meu site

### Planos

| Recurso | Essencial | Pro | Studio | Agency |
|---|---:|---:|---:|---:|
| Preço | R$ 37 | R$ 77 | R$ 157 | R$ 297 |
| Contas cPanel isoladas | 1 | 3 | 8 | 15 |
| Sites principais | 1 | 3 | 8 | 15 |
| Elementor Pro | Sim | Sim | Sim | Sim |
| Migrações gratuitas | 1 | 3 | 8 | 15 |
| SSL | Sim | Sim | Sim | Sim |
| Backup diário | 30 dias | 30 dias | 30 dias | 30 dias |
| Organização por cliente | Não | Sim | Sim | Sim |
| Suporte | Normal | Normal | Prioritário | Prioritário |

**Recomendado:** Pro na página WordPress; Studio na página Elementor.

### Regras

- Uma conta isolada corresponde a um projeto ou cliente principal.
- Não usar “domínios ilimitados”.
- Conta adicional: R$ 19,90/mês.
- Não incluir Deploy ou caixas de e-mail nos cards.
- Oferecer E-mail como adicional.
- Benefícios: São Paulo, migração, Elementor original, backup externo, SSL, cPanel e isolamento.

### FAQ

- A migração é gratuita?
- O Elementor é original?
- Quantos sites posso hospedar?
- O que significa conta isolada?
- Posso contratar e-mail?
- Como funciona o backup?
- Posso adicionar outra conta?

---

## 7. Rockfy E-mail

**Headline:** Seu e-mail profissional sem pagar por cada endereço.

**Apoio:** Crie endereços com o domínio da empresa e compartilhe o armazenamento contratado entre as caixas.

**CTA:** Criar meus e-mails

### Planos

| Recurso | Essencial | Business | Studio |
|---|---:|---:|---:|
| Preço | R$ 19,90 | R$ 39,90 | R$ 79,90 |
| Domínios | 1 | 3 | 10 |
| Caixas | Ilimitadas* | Ilimitadas* | Ilimitadas* |
| Armazenamento total | 10 GB | 30 GB | 100 GB |
| Webmail | Sim | Sim | Sim |
| Antispam | Sim | Sim | Sim |
| Configuração assistida | Sim | Sim | Sim |
| Migração incluída | 3 caixas | 10 caixas | 30 caixas |
| Suporte | Normal | Prioritário | Prioritário |

\* Dentro do armazenamento e sujeito à política de uso legítimo.

**Recomendado:** Business.

### Regras

- Manter “sem custo por caixa” com a ressalva de armazenamento.
- Não usar “armazenamento ilimitado”.
- Não exibir cPanel, Elementor, Deploy ou banco.
- Armazenamento adicional terá preço após validação de custo.

### FAQ

- Preciso hospedar o site na Rockfy?
- Posso usar meu domínio atual?
- Existe cobrança por caixa?
- Como o armazenamento é dividido?
- Vocês configuram no celular?
- É possível migrar mensagens antigas?
- Existe antispam e backup?

---

## 8. Loja Digital

Preservar preços e estrutura atuais.

| Recurso | Bora | Top | Especial |
|---|---:|---:|---:|
| Preço | R$ 47,90 | R$ 87,90 | Sob consulta |
| Teste | 7 dias | 7 dias | Demonstração |
| Produtos | 80 | 280 | Ilimitados |
| Usuários | 5 | 10 | Ilimitados |
| Catálogo | Sim | Sim | Sim |
| Pix sem taxa por pedido | Sim | Sim | Sim |
| Pedidos no WhatsApp | Sim | Sim | Sim |
| PDV e relatórios | Sim | Sim | Sim |
| Suporte | Normal | Prioritário | Dedicado |

**Recomendado:** Top.

Não misturar com WordPress ou Deploy e não anunciar recursos inexistentes. Manter configuração inicial gratuita.

---

## 9. Rockfy para Profissionais e Agências

Criar /para-agencias com a linguagem visual atual.

**Headline:** WordPress, aplicações e e-mails dos seus clientes em uma única operação.

**Apoio:** Hospede WordPress, publique aplicações, crie e-mails profissionais e organize cada cliente em uma conta Rockfy.

**CTA principal:** Montar minha estrutura  
**CTA secundário:** Falar com a Rockfy

### Planos combinados

Esta é a única página em que WordPress, Deploy, E-mail e Gestão aparecem no mesmo plano. Preservar a lógica comercial dos planos atuais.

| Recurso | Start | Pro | Studio | Scale |
|---|---:|---:|---:|---:|
| Preço | R$ 37 | R$ 77 | R$ 157 | R$ 297 |
| Contas WordPress isoladas | 1 | 2 | 8 | 15 |
| Elementor Pro oficial | Sim | Sim | Sim | Sim |
| Deploys de aplicações | 1 | 2 | 4 | 10 |
| Bancos Postgres — em breve | 1 | 2 | 4 | 10 |
| Caixas de e-mail | 3 | 8 | 15 | 25 |
| Gestão de clientes | Sim | Sim | Sim | Sim |
| Gestão e cobrança | Sim | Sim | Sim | Sim |
| SSL e domínios vinculados | Sim | Sim | Sim | Sim |
| Suporte | Normal | Normal | Prioritário | Prioritário |

**Recomendado:** Studio.

### Papéis dos planos

- Start: freelancer começando a operar projetos de clientes.
- Pro: profissional com uma pequena carteira.
- Studio: agência ou estúdio em crescimento.
- Scale: operação com vários clientes recorrentes.

### Regras

- Um Deploy dá direito a uma aplicação.
- Quando disponível, cada Deploy poderá receber um Postgres opcional dentro da franquia.
- Até o lançamento, exibir “Postgres gerenciado — em breve”; não permitir criação nem sugerir que já está incluso.
- Não usar “domínios ilimitados”. Os domínios devem estar vinculados às contas WordPress, aplicações e serviços de e-mail contratados.
- Recursos adicionais seguem os preços das linhas individuais.
- Os planos combinados aparecem somente nesta página; páginas específicas continuam com planos puros.

### Seções

1. Hero.
2. Logins, fornecedores e cobranças espalhados.
3. Um painel por cliente.
4. WordPress, Apps e E-mail.
5. Receita recorrente.
6. Planos combinados.
7. Depoimentos relevantes.
8. FAQ.

---

## 10. Operação Gerenciada

Criar /operacao-gerenciada.

**Headline:** A Rockfy cuida da infraestrutura. Você cuida do negócio.

**Apoio:** Implantação, migração, segurança, monitoramento, backups e incidentes para aplicações que não podem depender de improviso.

**CTA:** Solicitar diagnóstico

**Preço:** a partir de R$ 1.500/mês, sob diagnóstico. Não criar checkout automático.

### Incluído

- arquitetura;
- implantação e migração;
- domínio e DNS;
- banco e storage;
- observabilidade;
- backup e restauração;
- atualização de infraestrutura;
- resposta a incidentes;
- performance;
- interlocução técnica.

### Fora do padrão

Desenvolvimento contínuo, redesign, suporte ao usuário final, custos extraordinários e atendimento ilimitado sem escopo.

---

## 11. Página /planos

Deixar de exibir uma tabela universal. Mostrar primeiro quatro escolhas:

| Produto | A partir de | CTA |
|---|---:|---|
| Deploy | R$ 47/mês | Ver planos de Deploy |
| WordPress | R$ 37/mês | Ver planos WordPress |
| E-mail | R$ 19,90/mês | Ver planos de e-mail |
| Loja Digital | R$ 47,90/mês | Ver planos da loja |

Depois:

1. “Cuida de vários clientes?” → /para-agencias.
2. “Quer que a Rockfy cuide de tudo?” → /operacao-gerenciada, a partir de R$ 1.500.
3. Benefícios comuns: reais, nota fiscal, suporte brasileiro e conta única.
4. FAQ somente sobre cobrança, troca de plano e cancelamento.

Não afirmar que todos os produtos estão em São Paulo.

---

## 12. Navegação

No menu Produtos:

- Deploy;
- Hospedagem WordPress;
- Elementor Pro;
- E-mail profissional;
- Loja Digital;
- Para agências;
- Operação gerenciada.

Manter header e footer. Elementor aponta para /hospedagem-elementor-pro.

---

## 13. Componente de preços

Preservar o visual atual. A configuração por página deve aceitar:

- produto;
- nome, etiqueta e descrição;
- preço e periodicidade;
- lista de recursos;
- recomendado;
- CTA e URL;
- tooltip;
- observação de limites;
- plano sob consulta.

Não criar condicionais por rota dentro do card. A página fornece os dados. O grid deve aceitar três ou quatro planos e manter o comportamento mobile atual.

---

## 14. Conteúdo compartilhado

Personalizar “Feito pra quem faz acontecer”:

- Deploy: vibecoders, desenvolvedores, consultores e estúdios.
- WordPress: designers, freelancers, gestores e agências.
- E-mail: profissionais, equipes, escritórios e agências.
- Loja: comércio local, alimentação, varejo e prestadores.

Cada FAQ deve tratar apenas do produto da rota. Filtrar artigos por produto; ocultar a seção de blog quando não houver artigo relevante.

---

## 15. Correções textuais

- “e a gente da sua infra” → “e a gente cuida da sua infra”;
- “Hospede seus clientes ganhe todo mês” → “Hospede seus clientes, ganhe todo mês”;
- corrigir “aplicação ou site feita”;
- preferir “IA” a “I.A”.

Revisar antes de manter promessas como “em segundos”, “se roda na sua máquina”, “recursos dedicados”, plantão imediato, backup externo e migração sem indisponibilidade. Só publicar o que puder ser garantido.

---

## 16. Conversão e SEO

Eventos: product_view, pricing_view, plan_select, primary_cta_click, whatsapp_click e managed_operation_lead. Não adicionar analytics novo se já existir.

### Metadados sugeridos

- Deploy: “Deploy de aplicações com Postgres gerenciado | Rockfy”.
- Deploy description: “Publique aplicações com banco Postgres, domínio, SSL, logs e suporte em um único painel.”
- Para agências: “Hospedagem para agências e freelancers | Rockfy”.
- Agências description: “Gerencie WordPress, aplicações, bancos e e-mails dos seus clientes em uma única conta.”

Manter o foco SEO atual das páginas WordPress, Elementor e E-mail. A página Elementor só deve ter canonical próprio se o conteúdo for suficientemente distinto.

---

## 17. Ordem de implementação

1. Tornar preços configuráveis com alteração mínima.
2. Atualizar /deploy.
3. Atualizar /hospedagem-wordpress.
4. Atualizar /hospedagem-elementor-pro.
5. Atualizar /email-profissional.
6. Preservar e revisar /loja-digital.
7. Criar /para-agencias.
8. Criar /operacao-gerenciada.
9. Reconstruir /planos.
10. Atualizar navegação, SEO e links.
11. Revisar FAQs e conteúdos repetidos.
12. Validar visual e funcionalmente.

---

## 18. Critérios de aceite

### Funcionais

- Cada página exibe somente seus planos.
- E-mail e Deploy não exibem cPanel ou Elementor.
- WordPress e Elementor compartilham valores.
- Loja preserva os planos.
- /planos encaminha para cada linha.
- Novas rotas funcionam.
- CTAs apontam para o fluxo correto.
- Rotas antigas não quebram.

### Visuais

- Layout e design system preservados.
- Cards funcionam com três e quatro planos.
- Mobile, tablet e desktop validados.
- Sem corte, sobreposição ou salto de layout.

### Técnicos

- Sem Vite, node_modules ou dependência desnecessária.
- Sem refatoração fora do escopo.
- Build, lint e testes existentes passam.
- Sem erros no console.
- Canonical e metadados corretos.

### Conteúdo

- Valores iguais a esta especificação.
- FAQs específicas.
- Deploy não promete infraestrutura brasileira.
- Limite de suporte do Deploy visível.
- Prisma não aparece como produto.
- Usar “Rockfy Database” e “Postgres gerenciado”.
- Postgres aparece como “Em breve” até a integração estar ativa.

---

## 19. Fora do escopo

- Integração real com a Management API do Prisma.
- Cobrança real de excedentes.
- Novo sistema de autenticação.
- Alteração do painel do cliente.
- Mudança de infraestrutura.
- Migração de clientes.
- Alteração de contratos jurídicos.

As páginas devem ficar preparadas para esses recursos, sem implementá-los nesta tarefa.

---

## 20. Instrução final ao agente

Antes de editar, localizar componentes, rotas e fontes atuais. Fazer mudanças pequenas e verificáveis. Não reescrever páginas que funcionam. Quando uma alteração estrutural parecer necessária, escolher primeiro a alternativa que preserve HTML, componentes e estilos.

Ao finalizar:

1. listar arquivos alterados e criados;
2. explicar mudanças por rota;
3. registrar divergências desta especificação;
4. executar as validações existentes;
5. não declarar conclusão com testes falhando.
