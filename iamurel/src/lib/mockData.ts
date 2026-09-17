import { SiteSettings, Service, Package, Lead, Showcase, FAQ } from '../types';

export const mockSettings: SiteSettings = {
  id: '1',
  name: 'IAMUREL',
  description: 'A IAMUREL combina inteligência artificial, direção criativa e design gráfico para transformar ideias soltas em uma presença de marca clara e consistente.',
  hero_title: 'Conteúdo com direção. Design com intenção.',
  hero_subtitle: 'A IAMUREL combina inteligência artificial, direção criativa e design gráfico para transformar ideias soltas em uma presença de marca mais clara, consistente e pronta para circular.',
  primary_cta_text: 'Falar sobre um projeto',
  secondary_cta_text: 'Ver como funciona',
  contact_email: 'contato@iamurel.com'
};

export const mockServices: Service[] = [
  {
    id: 's1',
    title: 'Identidade Visual',
    problem_solved: 'Sua marca parece genérica e não transmite o valor do seu negócio.',
    deliverables: 'Logotipo, paleta de cores, tipografia, guia de marca e aplicações.',
    target_audience: 'Novos negócios e marcas precisando de reposicionamento.',
    not_included: 'Impressão de materiais, gestão de redes sociais.',
    timeframe: '2 a 4 semanas',
    investment_range: 'A partir de R$ 2.500',
    image_url: null,
    order_index: 1,
    status: 'active'
  },
  {
    id: 's2',
    title: 'Direção de Conteúdo',
    problem_solved: 'Você posta sem estratégia e suas redes sociais não têm coerência.',
    deliverables: 'Calendário editorial, templates, roteiros e orientação de publicação.',
    target_audience: 'Criadores e empresas que produzem internamente mas precisam de norte.',
    not_included: 'Produção audiovisual in loco.',
    timeframe: 'Mensal',
    investment_range: 'A partir de R$ 1.800/mês',
    image_url: null,
    order_index: 2,
    status: 'active'
  }
];

export const mockPackages: Package[] = [
  {
    id: 'p1',
    level: 'Essencial',
    commercial_role: 'Entrada com logo, paleta e base visual para quem precisa começar.',
    description: 'O mínimo viável para sua marca nascer com profissionalismo e clareza, sem excessos.',
    price: null,
    price_type: 'on_request',
    revisions: '1 rodada de refinamento',
    timeframe: '15 dias úteis',
    is_highlighted: false,
    order_index: 1,
    status: 'active',
    items: [
      { id: 'i1', package_id: 'p1', title: 'Design de Logotipo', quantity: '1', order_index: 1 },
      { id: 'i2', package_id: 'p1', title: 'Paleta de Cores Estratégica', quantity: null, order_index: 2 },
      { id: 'i3', package_id: 'p1', title: 'Seleção Tipográfica', quantity: null, order_index: 3 },
    ]
  },
  {
    id: 'p2',
    level: 'Recomendado',
    commercial_role: 'Solução para pequenos negócios que precisam aplicar uma identidade no cotidiano.',
    description: 'Sua marca pronta para uso diário nas redes sociais e materiais de contato.',
    price: null,
    price_type: 'on_request',
    revisions: '2 rodadas de refinamento',
    timeframe: '25 dias úteis',
    is_highlighted: true,
    order_index: 2,
    status: 'active',
    items: [
      { id: 'i4', package_id: 'p2', title: 'Tudo do pacote Essencial', quantity: null, order_index: 1 },
      { id: 'i5', package_id: 'p2', title: 'Templates para Redes Sociais', quantity: '6', order_index: 2 },
      { id: 'i6', package_id: 'p2', title: 'Manual de Marca Compacto', quantity: '1', order_index: 3 },
    ]
  }
];

export const mockShowcases: Showcase[] = [
  {
    id: 'sh1',
    title: 'Sistema de Identidade Modular',
    label: 'demonstration',
    context: 'Uma marca precisava de consistência através de 4 canais diferentes sem perder a essência.',
    decision: 'Criamos um grid flexível e tipografia expressiva baseada em AI para testar variações rapidamente.',
    deliverable: 'Manual de Marca e Templates Figma',
    image_url: null,
    order_index: 1
  }
];

export const mockFaq: FAQ[] = [
  {
    id: 'f1',
    question: 'Como a IA é utilizada no processo?',
    answer: 'Usamos a IA para acelerar a pesquisa de referências, gerar variações de rascunho e organizar grandes volumes de texto. No entanto, a seleção, o refinamento visual, o contexto e a decisão final são sempre de um diretor humano. A IA é nossa ferramenta de aceleração, não de delegação.',
    order_index: 1
  },
  {
    id: 'f2',
    question: 'Eu já tenho uma logo, vocês fazem apenas o conteúdo?',
    answer: 'Sim. Podemos atuar apenas na direção de conteúdo e estruturação de campanhas respeitando a sua identidade visual atual. Faremos uma auditoria inicial para entender como melhor aplicá-la.',
    order_index: 2
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Carolina Mendes',
    email: 'carol@exemplo.com',
    phone: '11999999999',
    business_name: 'Studio Carol Mendes',
    need: 'Preciso organizar meu conteúdo.',
    objective: 'Atrair clientes corporativos',
    timeframe: 'Próximos 30 dias',
    investment_range: 'R$ 2k - 5k',
    preferred_channel: 'whatsapp',
    message: 'Tenho os posts mas sinto que não tem uma unidade visual.',
    origin: 'Instagram',
    consent: true,
    status: 'novo',
    priority: 'medium',
    service_interest: 'Direção de Conteúdo',
    package_interest: null,
    last_contact_at: null,
    next_follow_up_at: null,
    assigned_to: null,
    tags: ['design de interiores'],
    created_at: new Date().toISOString()
  }
];
