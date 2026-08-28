/**
 * O texto da Política de Privacidade e dos Termos de Uso.
 *
 * Copiado literalmente do site anterior, sem reescrita: é documento
 * jurídico, e parafrasear qualquer cláusula muda o que a empresa se obriga
 * a cumprir. Alterações aqui têm que passar por quem responde pelo
 * contrato, não por ajuste de redação.
 *
 * PENDÊNCIAS CONHECIDAS, herdadas do projeto anterior e ainda abertas:
 *
 * • §2.4 dos Termos define o canal oficial como e-mail ou Área do Cliente,
 *   de segunda a sexta, das 9h às 18h — sem WhatsApp. O FAQ que já está no
 *   ar anuncia "chat e WhatsApp, das 8h às 22h, todos os dias". No Brasil a
 *   oferta publicitária vincula o fornecedor (CDC art. 30), então os dois
 *   não podem coexistir.
 *
 * • §8.4 dos Termos diz que não há SLA específico, enquanto as peças de
 *   infraestrutura do site antigo prometem 99,9% com crédito proporcional.
 *   Por isso essa promessa não foi trazida para nenhuma página daqui.
 */

export type SecaoLegal = {
  titulo: string;
  paragrafos?: string[];
  itens?: string[];
};

/** Data que aparece no topo da página. Só muda quando o texto mudar. */
export const ATUALIZADO_EM = "21 de agosto de 2026";

export const INTRO_PRIVACIDADE =
  "ROCKFY — CAPSULA TECNOLOGIA E SERVICOS LTDA. Esta Política explica como tratamos dados pessoais relacionados aos nossos sites, áreas de cliente, canais de atendimento e serviços de infraestrutura e hospedagem.";

export const INTRO_TERMOS =
  "ROCKFY — CAPSULA TECNOLOGIA E SERVICOS LTDA. Ao contratar, utilizar ou renovar os serviços, o CLIENTE declara ter tido acesso a estes Termos e à Política de Privacidade e concorda com as condições aplicáveis ao produto selecionado.";

export const privacidade: SecaoLegal[] = [
  {
    titulo: "1. Papéis da ROCKFY no tratamento de dados",
    paragrafos: [
      "1.1. A ROCKFY atua como controladora dos dados pessoais necessários à administração de sua própria relação com clientes, usuários e contatos, incluindo cadastro, contratação, faturamento, atendimento, segurança, prevenção a fraudes e cumprimento de obrigações legais.",
      "1.2. Em relação aos dados pessoais inseridos, coletados ou armazenados pelo CLIENTE em sites, aplicações, bancos de dados, caixas de e-mail e demais ambientes hospedados, o CLIENTE normalmente atua como controlador e a ROCKFY poderá atuar como operadora, tratando tais dados na medida necessária à prestação dos serviços e de acordo com as instruções lícitas do CLIENTE.",
      "1.3. O CLIENTE é responsável por definir as finalidades e bases legais dos tratamentos realizados por meio de seus próprios sites e aplicações, bem como por fornecer aos titulares as informações e mecanismos exigidos pela legislação.",
    ],
  },
  {
    titulo: "2. Dados pessoais tratados",
    paragrafos: [
      "A ROCKFY poderá tratar, conforme o serviço utilizado e a interação realizada:",
    ],
    itens: [
      "Dados cadastrais e de identificação: nome, CPF ou CNPJ, razão social, endereço, e-mail, telefone e informações necessárias à identificação da conta.",
      "Dados contratuais e financeiros: plano contratado, histórico de cobranças, pagamentos, faturas, notas fiscais, créditos, cancelamentos e informações necessárias à conciliação financeira. Dados completos de cartão não são armazenados pela ROCKFY quando o pagamento é processado por prestador especializado.",
      "Dados técnicos e de segurança: endereço IP, data e hora de acesso, identificadores de sessão, navegador, sistema operacional, eventos de autenticação, logs administrativos e registros relacionados à segurança e disponibilidade dos serviços.",
      "Dados de atendimento: conteúdo de solicitações, mensagens, arquivos e informações fornecidas pelo usuário ao entrar em contato com o suporte.",
      "Dados de navegação e cookies: informações necessárias ao funcionamento, autenticação, segurança e preferências da plataforma e, quando aplicável, dados decorrentes de tecnologias adicionais devidamente informadas ao usuário.",
    ],
  },
  {
    titulo: "3. Finalidades e bases legais",
    paragrafos: [
      "Os dados pessoais poderão ser tratados para as seguintes finalidades, conforme a hipótese aplicável:",
    ],
    itens: [
      "Executar contratos e procedimentos relacionados à contratação, ativação, administração, alteração e cancelamento dos serviços.",
      "Processar cobranças, emitir documentos fiscais e manter registros contábeis, financeiros e contratuais.",
      "Prestar suporte técnico, responder solicitações e autenticar a identidade do titular da conta.",
      "Proteger contas, sistemas e infraestrutura, prevenir fraudes, abusos, invasões e incidentes de segurança.",
      "Manter registros técnicos e logs exigidos ou permitidos pela legislação.",
      "Cumprir obrigações legais, regulatórias, fiscais, administrativas ou judiciais e exercer regularmente direitos.",
      "Enviar comunicações operacionais indispensáveis e comunicações comerciais ou informativas quando houver base legal aplicável, respeitados os mecanismos de oposição, descadastramento ou revogação de consentimento.",
      "A base legal utilizada dependerá da operação concreta e poderá incluir execução de contrato, cumprimento de obrigação legal ou regulatória, exercício regular de direitos, legítimo interesse e consentimento, quando este for efetivamente necessário.",
    ],
  },
  {
    titulo: "4. Dados de pagamento",
    paragrafos: [
      "4.1. Pagamentos poderão ser processados por prestadores especializados. A ROCKFY procura limitar o tratamento aos dados necessários à confirmação da transação, faturamento, prevenção a fraude, conciliação e suporte.",
      "4.2. Quando o pagamento por cartão for processado diretamente por prestador de pagamentos, a ROCKFY não armazena o número completo do cartão, código de segurança ou senha do instrumento de pagamento em seus próprios sistemas.",
    ],
  },
  {
    titulo: "5. Compartilhamento e prestadores de serviço",
    paragrafos: [
      "A ROCKFY não comercializa dados pessoais de clientes para publicidade de terceiros. O compartilhamento poderá ocorrer, na medida necessária, com:",
    ],
    itens: [
      "Prestadores de infraestrutura, processamento, armazenamento, rede, segurança, monitoramento, comunicação e suporte técnico.",
      "Prestadores de pagamento, cobrança, faturamento e serviços financeiros necessários à execução da contratação.",
      "Prestadores necessários ao registro, configuração ou manutenção de domínios e serviços de internet contratados pelo CLIENTE.",
      "Autoridades públicas, administrativas, fiscais ou judiciais, quando houver obrigação legal, ordem válida ou outra hipótese prevista em lei.",
      "Assessores profissionais e fornecedores que necessitem tratar informações para defesa de direitos, auditoria, segurança ou continuidade operacional, sujeitos às obrigações aplicáveis de confidencialidade e proteção de dados.",
    ],
  },
  {
    titulo: "6. Transferências internacionais",
    paragrafos: [
      "Alguns prestadores de tecnologia ou componentes da infraestrutura podem processar ou armazenar dados fora do Brasil. Quando uma operação caracterizar transferência internacional de dados pessoais sujeita à LGPD, a ROCKFY adotará mecanismo válido e medidas compatíveis com a legislação e a regulamentação da ANPD, inclusive quanto à transparência e às garantias aplicáveis.",
    ],
  },
  {
    titulo: "7. Segurança da informação",
    paragrafos: [
      "7.1. A ROCKFY adota medidas técnicas e administrativas razoáveis e compatíveis com os riscos de sua operação para reduzir a ocorrência de acessos não autorizados e situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou tratamento inadequado.",
      "7.2. Nenhum ambiente conectado à internet pode ser considerado absolutamente imune a incidentes. A segurança também depende de medidas sob responsabilidade do CLIENTE, incluindo proteção de credenciais, atualização de aplicações, temas, plugins e códigos próprios, controle de usuários e manutenção de cópias de segurança independentes.",
      "7.3. O acesso da ROCKFY ao conteúdo hospedado é limitado ao necessário para execução do serviço, segurança, atendimento de solicitação de suporte, cumprimento de obrigação legal ou resposta a incidente.",
    ],
  },
  {
    titulo: "8. Incidentes de segurança",
    paragrafos: [
      "A ROCKFY mantém procedimentos para avaliação e resposta a incidentes de segurança. Quando um incidente envolvendo dados pessoais puder gerar risco ou dano relevante e a ROCKFY atuar como controladora, serão adotadas as providências de comunicação previstas na legislação e regulamentação aplicáveis. Quando atuar como operadora, buscará comunicar o controlador afetado sem demora indevida após tomar ciência do incidente relevante.",
    ],
  },
  {
    titulo: "9. Retenção e eliminação",
    paragrafos: [
      "9.1. Dados cadastrais, contratuais e de atendimento serão mantidos pelo tempo necessário à prestação dos serviços e, após o encerramento, pelo período necessário ao cumprimento de obrigações legais, regulatórias, fiscais, exercício regular de direitos e prevenção a fraudes.",
      "9.2. Os dados e conteúdos hospedados pelo CLIENTE seguem as regras de suspensão, cancelamento, retenção e exclusão previstas nos Termos de Uso e Prestação de Serviços e nas condições do produto contratado.",
      "9.3. Encerrado o prazo aplicável de retenção operacional, os dados hospedados poderão ser excluídos de forma definitiva dos ambientes ativos e, posteriormente, das cópias técnicas remanescentes conforme seus ciclos de retenção, ressalvadas obrigações legais ou situações de preservação necessária.",
    ],
  },
  {
    titulo: "10. Cookies e tecnologias semelhantes",
    paragrafos: [
      "10.1. A ROCKFY poderá utilizar cookies estritamente necessários para autenticação, segurança, manutenção de sessão, prevenção a fraude e funcionamento de suas páginas e áreas restritas. 10.2. Caso sejam utilizados cookies ou tecnologias não essenciais para analytics, personalização ou marketing, a ROCKFY fornecerá as informações e controles exigidos pela legislação aplicável.",
    ],
  },
  {
    titulo: "11. Direitos dos titulares",
    paragrafos: [
      "Nos limites e condições previstos na LGPD, o titular poderá solicitar, entre outros direitos:",
    ],
    itens: [
      "Confirmação da existência de tratamento e acesso aos dados.",
      "Correção de dados incompletos, inexatos ou desatualizados.",
      "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a legislação.",
      "Portabilidade dos dados, observadas as normas aplicáveis e os segredos comercial e industrial.",
      "Informações sobre compartilhamento de dados e sobre a possibilidade de não fornecer consentimento e suas consequências.",
      "Revogação do consentimento e eliminação dos dados tratados com base nele, quando aplicável e ressalvadas as hipóteses legais de conservação.",
      "Oposição a tratamento realizado com fundamento em hipótese que dispense consentimento, quando houver descumprimento da LGPD.",
    ],
  },
  {
    titulo: "12. Dados tratados em nome dos clientes",
    paragrafos: [
      "12.1. A ROCKFY não determina quais dados pessoais o CLIENTE coleta em seus sites, lojas virtuais, formulários, sistemas ou caixas de e-mail, nem as finalidades comerciais definidas pelo CLIENTE. 12.2. O CLIENTE deve manter sua própria política de privacidade, avisos, bases legais, controles de consentimento e demais mecanismos exigidos para sua atividade. 12.3. Solicitações de titulares relacionadas exclusivamente a dados controlados pelo CLIENTE deverão ser dirigidas ao respectivo CLIENTE.",
    ],
  },
  {
    titulo: "13. Crianças e adolescentes",
    paragrafos: [
      "Os serviços da ROCKFY são destinados à contratação e administração por pessoas com capacidade para celebrar a relação contratual aplicável. Caso o CLIENTE utilize sua infraestrutura para tratar dados de crianças ou adolescentes, caberá ao CLIENTE observar as regras legais específicas aplicáveis a esse tratamento.",
    ],
  },
  {
    titulo: "14. Alterações desta Política",
    paragrafos: [
      "A ROCKFY poderá atualizar esta Política para refletir alterações legais, regulatórias, técnicas ou operacionais. A versão vigente e sua data de atualização serão disponibilizadas nos canais oficiais da ROCKFY. Alterações relevantes poderão ser comunicadas por meio da Área do Cliente, e-mail ou outro canal adequado.",
    ],
  },
  {
    titulo: "15. Contato",
    paragrafos: [
      "Canal de privacidade e proteção de dados: suporte@rockfy.com. CAPSULA TECNOLOGIA E SERVICOS LTDA — ROCKFY. CNPJ/MF nº 31.786.423/0001-02. Jundiaí - SP.",
    ],
  },
];

export const termos: SecaoLegal[] = [
  {
    titulo: "1. Objeto e escopo dos serviços",
    paragrafos: [
      "1.1. O objeto destes Termos é regular a prestação de serviços de infraestrutura de tecnologia pela ROCKFY, incluindo hospedagem de sites, servidores, armazenamento, e-mail, registro ou administração de recursos relacionados a domínios e outros serviços expressamente descritos no plano contratado. 1.2. As características, limites, recursos, capacidade, preço, periodicidade, franquias e funcionalidades de cada serviço são aqueles informados na oferta ou Área do Cliente no momento da contratação. 1.3. A ROCKFY poderá utilizar infraestrutura própria ou de terceiros para prestar os serviços, mantendo a responsabilidade pelas obrigações que lhe forem aplicáveis perante o CLIENTE.",
    ],
  },
  {
    titulo: "2. Suporte técnico e responsabilidades",
    paragrafos: [
      "2.1. Salvo quando o plano indicar expressamente o contrário, o suporte abrange a infraestrutura sob administração da ROCKFY, conectividade, disponibilidade do ambiente, painel de controle e recursos diretamente fornecidos. 2.2. Não estão incluídos desenvolvimento, programação, alteração ou depuração de código; criação ou correção de layouts, conteúdos ou funcionalidades; configuração, manutenção ou correção de aplicações, temas, extensões e plugins de terceiros; falhas decorrentes de alterações do CLIENTE ou de terceiros; e serviços não descritos no plano. 2.3. Auxílio pontual fora do escopo não cria obrigação de repetição. 2.4. O canal oficial é suporte@rockfy.com ou a Área do Cliente, em dias úteis, de segunda a sexta-feira, das 09h00 às 18h00, ressalvadas condições específicas.",
    ],
  },
  {
    titulo: "3. Obrigações do CLIENTE",
    paragrafos: [
      "O CLIENTE é responsável por:",
      "Fornecer dados cadastrais, fiscais e de contato corretos e mantê-los atualizados.",
      "Manter sob sigilo credenciais, senhas, chaves e demais meios de autenticação.",
      "Utilizar os serviços de acordo com a legislação, estes Termos e os limites técnicos do plano.",
      "Manter atualizados e seguros os sistemas, aplicações, códigos, temas, extensões e plugins sob sua administração.",
      "Manter cópias de segurança independentes de dados essenciais ao seu negócio.",
      "Possuir os direitos, licenças e autorizações necessários sobre os conteúdos e dados que hospedar.",
      "Responder pelas atividades realizadas por usuários, colaboradores ou terceiros com acesso à sua conta ou infraestrutura.",
    ],
    itens: [
      "Fornecer dados cadastrais, fiscais e de contato corretos e mantê-los atualizados.",
      "Manter sob sigilo credenciais, senhas, chaves e demais meios de autenticação.",
      "Utilizar os serviços de acordo com a legislação, estes Termos e os limites técnicos do plano.",
      "Manter atualizados e seguros os sistemas, aplicações, códigos, temas, extensões e plugins sob sua administração.",
      "Manter cópias de segurança independentes de dados essenciais ao seu negócio.",
      "Possuir os direitos, licenças e autorizações necessários sobre os conteúdos e dados que hospedar.",
      "Responder pelas atividades realizadas por usuários, colaboradores ou terceiros com acesso à sua conta ou infraestrutura.",
    ],
  },
  {
    titulo: "4. Preços, faturamento e pagamentos",
    paragrafos: [
      "4.1. O CLIENTE pagará os valores e na periodicidade indicados na contratação ou renovação. 4.2. O não pagamento poderá acarretar multa moratória de 2% sobre o saldo devido e juros de mora de 1% ao mês, proporcionalmente aos dias de atraso, sem prejuízo de suspensão e cancelamento. 4.3. Em alteração de plano durante ciclo vigente, a ROCKFY poderá aplicar cálculo proporcional: upgrade cobra a diferença do período restante; downgrade poderá converter saldo em crédito futuro, sem restituição automática. 4.4. Notas fiscais serão emitidas com base nos dados cadastrais disponíveis. 4.5. Preços poderão ser atualizados para ciclos futuros mediante comunicação prévia quando exigida.",
    ],
  },
  {
    titulo: "5. Suspensão, cancelamento e exclusão por inadimplência",
    paragrafos: [
      "5.1. Fatura em aberto por 5 dias corridos após o vencimento poderá suspender os serviços. 5.2. Inadimplência por 30 dias corridos poderá levar ao cancelamento e à desativação. 5.3. Após o cancelamento, poderá haver retenção operacional sem garantia de recuperação; atingidos 60 dias corridos do vencimento original, os dados poderão ser excluídos definitivamente. 5.4. A exclusão poderá abranger arquivos, bancos de dados, caixas de e-mail, configurações e cópias técnicas. 5.5. O CLIENTE deve manter seus contatos atualizados. 5.6. A regularização após o cancelamento não garante a existência dos dados anteriores.",
    ],
  },
  {
    titulo: "6. Cancelamento solicitado pelo CLIENTE",
    paragrafos: [
      "6.1. O CLIENTE poderá solicitar o cancelamento pelos canais disponibilizados, observadas as condições do plano e da legislação. 6.2. Antes da data efetiva, deverá exportar os arquivos, bancos de dados, mensagens e demais informações que deseje preservar. 6.3. Após o cancelamento e encerrado eventual prazo de retenção, a ROCKFY poderá excluir os dados vinculados ao serviço.",
    ],
  },
  {
    titulo: "7. Backups",
    paragrafos: [
      "7.1. A ROCKFY poderá disponibilizar ferramentas ou cópias de segurança conforme o produto contratado. 7.2. Salvo contratação expressa, backups da ROCKFY são recurso complementar e não substituem cópias independentes do CLIENTE. 7.3. O CLIENTE deve manter backup externo e atualizado e testar sua restauração. 7.4. Backups estão sujeitos a ciclos de retenção, capacidade, falhas, corrupção e limitações tecnológicas.",
    ],
  },
  {
    titulo: "8. Disponibilidade, manutenção e alterações técnicas",
    paragrafos: [
      "8.1. A ROCKFY empregará esforços razoáveis para manter a disponibilidade conforme o produto. 8.2. Poderão ocorrer interrupções por manutenção, atualização, segurança, migração, falhas ou intervenções de rede. 8.3. Sempre que possível, manutenções programadas relevantes serão comunicadas. 8.4. Não haverá SLA específico salvo previsão expressa.",
    ],
  },
  {
    titulo: "9. Uso aceitável",
    paragrafos: [
      "É proibido utilizar a infraestrutura para atividades ilícitas ou que comprometam a segurança, reputação ou estabilidade dos serviços, incluindo:",
    ],
    itens: [
      "Spam ou mensagens em massa em desconformidade com a legislação.",
      "Phishing, fraude, malware, botnets, códigos maliciosos ou exploração não autorizada.",
      "Ataques, negação de serviço, varreduras abusivas ou tentativas de acesso não autorizado.",
      "Armazenamento ou distribuição de conteúdo ilícito ou que viole direitos de terceiros.",
      "Uso como repositório genérico quando não fizer parte do produto contratado.",
      "Consumo abusivo ou desproporcional de recursos capaz de prejudicar a infraestrutura.",
      "Diante de risco relevante, abuso, indício razoável de ilícito, comprometimento de segurança ou impacto a terceiros, a ROCKFY poderá adotar medidas cautelares proporcionais, incluindo bloqueio de tráfego, isolamento, limitação ou suspensão do serviço, inclusive antes de notificação quando a urgência técnica ou jurídica assim exigir.",
    ],
  },
  {
    titulo: "10. Conteúdo, propriedade intelectual e dados do CLIENTE",
    paragrafos: [
      "10.1. O CLIENTE permanece titular dos direitos sobre seus arquivos, conteúdos, códigos, bancos de dados e materiais hospedados. 10.2. Durante a vigência, autoriza a ROCKFY a armazenar, copiar tecnicamente, transmitir, processar e realizar operações indispensáveis à execução do serviço. 10.3. O CLIENTE declara possuir os direitos e autorizações necessários e responderá por reclamações decorrentes do conteúdo sob seu controle.",
    ],
  },
  {
    titulo: "11. Proteção de dados pessoais",
    paragrafos: [
      "11.1. O tratamento relacionado à relação comercial da ROCKFY é descrito na Política de Privacidade. 11.2. Quando tratar dados hospedados em nome do CLIENTE, a ROCKFY atuará, em regra, como operadora, limitada às operações necessárias e às instruções lícitas. 11.3. Poderá utilizar suboperadores e prestadores, inclusive com processamento internacional. 11.4. O CLIENTE é responsável por garantir base legal adequada e atender direitos dos titulares sob seu controle.",
    ],
  },
  {
    titulo: "12. Segurança e incidentes",
    paragrafos: [
      "12.1. As partes adotarão medidas de segurança compatíveis com suas responsabilidades. 12.2. O CLIENTE deverá comunicar sem demora suspeitas de comprometimento de credenciais, invasões ou incidentes. 12.3. Ao identificar incidente relevante envolvendo dados tratados em nome do CLIENTE, a ROCKFY buscará comunicá-lo sem demora indevida.",
    ],
  },
  {
    titulo: "13. Limitações e exclusões de responsabilidade",
    paragrafos: [
      "13.1. A ROCKFY não responde por falhas ou prejuízos decorrentes de atos do CLIENTE ou terceiros sob sua responsabilidade, credenciais comprometidas por fato não imputável à ROCKFY, códigos e aplicações do CLIENTE, incompatibilidades de terceiros ou uso em desacordo com estes Termos. 13.2. Também não responde por caso fortuito ou força maior, falhas generalizadas de telecomunicações ou internet, ataques de grande escala, atos de autoridade ou falhas externas fora de controle razoável. 13.3. Nenhuma disposição exclui responsabilidade que não possa ser legalmente afastada. 13.4. Limitações serão interpretadas conforme a contratação, o plano e a legislação, inclusive normas de proteção do consumidor.",
    ],
  },
  {
    titulo: "14. Comunicações",
    paragrafos: [
      "14.1. São válidas as comunicações operacionais e contratuais enviadas aos contatos cadastrados ou disponibilizadas na Área do Cliente. 14.2. O CLIENTE deve manter e-mail, telefone e demais dados atualizados. 14.3. Comunicações de marketing observarão a Política de Privacidade e os mecanismos aplicáveis.",
    ],
  },
  {
    titulo: "15. Alterações destes Termos",
    paragrafos: [
      "A ROCKFY poderá atualizar estes Termos por alterações legais, regulatórias, técnicas, de segurança ou dos serviços. A versão vigente será disponibilizada nos canais oficiais. Quando houver impacto material em contratos vigentes, será adotada a comunicação prévia cabível e respeitados os direitos legais.",
    ],
  },
  {
    titulo: "16. Vigência e disposições gerais",
    paragrafos: [
      "16.1. Estes Termos vigoram enquanto houver relação contratual, sem prejuízo de cláusulas que devam permanecer aplicáveis. 16.2. Tolerância não implica renúncia, alteração ou novação. 16.3. Se alguma disposição for inválida, as demais permanecerão válidas. 16.4. A Política de Privacidade e as condições específicas do plano integram estes Termos no que forem aplicáveis.",
    ],
  },
  {
    titulo: "17. Legislação aplicável e foro",
    paragrafos: [
      "17.1. Estes Termos são regidos pela legislação brasileira. 17.2. Fica eleito o Foro da Comarca de Jundiaí - SP, ressalvadas as hipóteses em que a legislação assegure ao CLIENTE foro diverso ou determine competência específica.",
    ],
  },
  {
    titulo: "18. Contato",
    paragrafos: [
      "ROCKFY. suporte@rockfy.com. CAPSULA TECNOLOGIA E SERVICOS LTDA. CNPJ/MF nº 31.786.423/0001-02. Jundiaí - SP.",
    ],
  },
];
