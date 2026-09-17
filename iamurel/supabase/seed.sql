-- ==============================================================================
-- IAMUREL - Seed Data (Dados Iniciais)
-- Execute este script no SQL Editor do Supabase APÓS executar o schema.sql
-- ==============================================================================

-- 1. Configurações Globais do Site
INSERT INTO iamurel_site_settings (
  id,
  name,
  description,
  hero_title,
  hero_subtitle,
  primary_cta_text,
  secondary_cta_text,
  contact_email
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'IAMUREL',
  'A IAMUREL combina inteligência artificial, direção criativa e design gráfico para transformar ideias soltas em uma presença de marca clara e consistente.',
  'Conteúdo com direção. Design com intenção.',
  'A IAMUREL combina inteligência artificial, direção criativa e design gráfico para transformar ideias soltas em uma presença de marca mais clara, consistente e pronta para circular.',
  'Falar sobre um projeto',
  'Ver como funciona',
  'contato@iamurel.com'
) ON CONFLICT (id) DO UPDATE SET
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  description = EXCLUDED.description;

-- 2. Serviços Comerciais
INSERT INTO iamurel_services (
  title,
  problem_solved,
  deliverables,
  target_audience,
  not_included,
  timeframe,
  investment_range,
  order_index,
  status
) VALUES
(
  'Identidade Visual',
  'Sua marca parece amadora, genérica ou desconectada do valor real dos seus serviços.',
  'Logotipo com variações, tipografia principal e secundária, paleta cromática com códigos exatos, manual de uso essencial e arquivos finais em vetor e PNG.',
  'Novos negócios, profissionais liberais e marcas precisando de reposicionamento urgente.',
  'Registro de marca no INPI e impressão física de materiais.',
  '15 a 25 dias úteis',
  'A partir de R$ 2.500',
  1,
  'active'
),
(
  'Direção de Conteúdo',
  'Você tem conhecimento e boas ideias, mas não consegue manter frequência, ritmo ou coerência editorial.',
  'Diagnóstico de canal, matriz de editorias semanais, 12 roteiros detalhados por mês e guia de tom de voz.',
  'Criadores, especialistas e empresas que produzem internamente mas precisam de norte estratégico.',
  'Captação e gravação presencial de vídeos.',
  'Ciclo mensal',
  'A partir de R$ 1.800/mês',
  2,
  'active'
),
(
  'Conteúdo para Redes (Design + Copy)',
  'Cada post parece de uma empresa diferente e o feed transmite amadorismo.',
  'Sistemas de templates no Figma, 12 a 20 peças mensais (carrosséis e estáticos) com copy direcionada e curadoria visual.',
  'Pequenas empresas e marcas que precisam de presença consistente sem sobrecarregar a equipe.',
  'Gestão de tráfego pago e resposta a mensagens diretas (DMs).',
  'Ciclo mensal',
  'Sob consulta',
  3,
  'active'
),
(
  'Campanhas e Lançamentos',
  'Você tem um produto ou evento, mas a comunicação está dispersa e sem tração visual.',
  'Conceito visual da campanha, key visuals, peças para redes, páginas de captura e sequência de peças de aquecimento e conversão.',
  'Empresas lançando novos serviços, produtos ou turmas.',
  'Verba de mídia e compra de anúncios.',
  '20 a 30 dias úteis',
  'A partir de R$ 3.800',
  4,
  'active'
);

-- 3. Pacotes Comerciais
INSERT INTO iamurel_packages (
  id,
  level,
  commercial_role,
  description,
  price,
  price_type,
  revisions,
  timeframe,
  is_highlighted,
  order_index,
  status
) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  'Essencial',
  'Entrada com logo, paleta e base visual para quem precisa começar.',
  'O mínimo viável para sua marca nascer com profissionalismo, clareza e intenção.',
  1900.00,
  'starting_at',
  '1 rodada estruturada de refinamento',
  '15 dias úteis',
  false,
  1,
  'active'
),
(
  '10000000-0000-0000-0000-000000000002',
  'Recomendado',
  'Solução para pequenos negócios que precisam aplicar uma identidade no cotidiano.',
  'O equilíbrio ideal entre sistema de identidade e peças práticas prontas para circulação comercial.',
  3400.00,
  'starting_at',
  '2 rodadas estruturadas de refinamento',
  '20 a 25 dias úteis',
  true,
  2,
  'active'
),
(
  '10000000-0000-0000-0000-000000000003',
  'Profissional',
  'Sistema visual e conteúdo mais completos, com aplicações e orientação contínua.',
  'Para negócios estabelecidos que necessitam de consolidação de marca, repertório visual e templates de alto nível.',
  null,
  'on_request',
  'Até 3 rodadas de refinamento',
  '30 dias úteis',
  false,
  3,
  'active'
),
(
  '10000000-0000-0000-0000-000000000004',
  'Ultra',
  'Solução ampla, estratégica e personalizada para quem quer estruturar toda a comunicação.',
  'Imersão profunda: diagnóstico completo, reposicionamento, identidade integral e direção criativa contínua.',
  null,
  'on_request',
  'Acompanhamento e refinamentos dedicados',
  '45 a 60 dias úteis',
  false,
  4,
  'active'
);

-- Itens do Pacote Essencial
INSERT INTO iamurel_package_items (package_id, title, quantity, order_index) VALUES
('10000000-0000-0000-0000-000000000001', 'Logotipo Principal e Símbolo Vetorial', '1', 1),
('10000000-0000-0000-0000-000000000001', 'Paleta Cromática com Códigos Digitais e Impressão', NULL, 2),
('10000000-0000-0000-0000-000000000001', 'Seleção Tipográfica e Hierarquia Visual', NULL, 3),
('10000000-0000-0000-0000-000000000001', 'Mini Guia de Aplicação em PDF', '1', 4);

-- Itens do Pacote Recomendado
INSERT INTO iamurel_package_items (package_id, title, quantity, order_index) VALUES
('10000000-0000-0000-0000-000000000002', 'Tudo contido no Pacote Essencial', NULL, 1),
('10000000-0000-0000-0000-000000000002', 'Templates Editáveis para Posts e Carrosséis (Figma)', '6', 2),
('10000000-0000-0000-0000-000000000002', 'Templates para Stories Institucionais', '4', 3),
('10000000-0000-0000-0000-000000000002', 'Assinatura de E-mail e Capas de Perfil', NULL, 4),
('10000000-0000-0000-0000-000000000002', 'Manual de Marca Compacto e Organizado', '1', 5);

-- Itens do Pacote Profissional
INSERT INTO iamurel_package_items (package_id, title, quantity, order_index) VALUES
('10000000-0000-0000-0000-000000000003', 'Identidade Visual Completa (Wordmark, Símbolo, Grafismos)', NULL, 1),
('10000000-0000-0000-0000-000000000003', 'Manual de Identidade Visual e Voz da Marca', '1', 2),
('10000000-0000-0000-0000-000000000003', 'Kit Editorial de Redes Sociais Completo', '12', 3),
('10000000-0000-0000-0000-000000000003', 'Aplicações Comerciais (Apresentação comercial e Proposta)', '2', 4),
('10000000-0000-0000-0000-000000000003', 'Sessão de Alinhamento e Entrega Guiada', '1', 5);

-- Itens do Pacote Ultra
INSERT INTO iamurel_package_items (package_id, title, quantity, order_index) VALUES
('10000000-0000-0000-0000-000000000004', 'Diagnóstico Estratégico e Mapeamento de Marca', NULL, 1),
('10000000-0000-0000-0000-000000000004', 'Sistema de Design Integral e Multiplataforma', NULL, 2),
('10000000-0000-0000-0000-000000000004', 'Direção Criativa para Conteúdo e Campanhas (30 dias)', NULL, 3),
('10000000-0000-0000-0000-000000000004', 'Biblioteca Exclusiva de Elementos Visuais Assistidos por IA', NULL, 4),
('10000000-0000-0000-0000-000000000004', 'Canal Direto de Acompanhamento Criativo', NULL, 5);

-- 4. Demonstrações e Estudos Autorais
INSERT INTO iamurel_showcases (
  title,
  label,
  context,
  decision,
  deliverable,
  order_index
) VALUES
(
  'Estrutura Modular de Identidade para Consultoria',
  'demonstration',
  'O negócio atuava com serviços de alto valor, mas utilizava uma identidade genérica que parecia amadora em propostas.',
  'Desenvolvemos um grid tipográfico com alto contraste, paleta sóbria marfim e carvão, gerando variações rápidas com apoio de IA para testes de legibilidade em telas e impressão.',
  'Manual de marca compacto, template de proposta comercial e sistema de capas para relatórios.',
  1
),
(
  'Direção Editorial e Carrosséis Educativos',
  'process_example',
  'Especialista produzia conteúdo denso e técnico, mas sem retenção visual e com baixa leitura pelo público-alvo.',
  'Roteirização em 5 atos, diagramação minimalista com respiro visual e títulos que contextualizam o problema antes de apresentar a solução.',
  'Estrutura de 8 carrosséis estratégicos com direção de arte e textos revisados.',
  2
);

-- 5. FAQ (Perguntas Frequentes)
INSERT INTO iamurel_faq (question, answer, order_index) VALUES
(
  'Como a IA é utilizada nos projetos da IAMUREL?',
  'A IA é nossa ferramenta de aceleração para pesquisa de referências, geração rápida de alternativas, organização de dados e desdobramentos de formatos. A curadoria, a direção de arte, a escolha tipográfica, o contexto do seu negócio e a responsabilidade criativa são 100% conduzidas por mãos humanas.',
  1
),
(
  'Qual é a diferença entre conteúdo automático e o método da IAMUREL?',
  'Conteúdo automático é genérico, repetitivo e ignora o contexto da sua marca. Na IAMUREL, o método AI-First une a rapidez da exploração computacional com uma direção humana rigorosa. Cada palavra e decisão visual tem uma intenção comercial clara.',
  2
),
(
  'Eu já tenho um logotipo. Posso contratar apenas a parte de conteúdo?',
  'Com certeza. Fazemos um diagnóstico da sua identidade existente e criamos o sistema editorial, templates e roteiros respeitando e potencializando a marca que você já construiu.',
  3
),
(
  'O que acontece depois que eu envio o formulário de contato?',
  'Recebemos sua mensagem em nosso CRM interno, analisamos seu segmento e suas necessidades, e retornamos em até 1 dia útil pelo canal de sua preferência com um diagnóstico preliminar e sugestão de formato de trabalho.',
  4
),
(
  'Como funcionam os prazos e revisões?',
  'Cada pacote possui um prazo e número definido de rodadas de refinamento para garantir previsibilidade tanto para você quanto para o nosso fluxo de produção. Tudo é alinhado antes do início formal do projeto.',
  5
);
