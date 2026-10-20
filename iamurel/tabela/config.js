/* =====================================================================
   IAMUREL · TABELA DE PREÇOS — ARQUIVO DE CONFIGURAÇÃO
   Para mudar qualquer coisa na página, edite SÓ este arquivo.
   (Não existe painel de administração: é um site estático, sem login,
   sem banco de dados — por isso não há o que invadir.)

   COMO EDITAR RÁPIDO
   • Mudar preço ........ procure o plano e troque  preco:'449,98'
   • Nova arte .......... coloque a imagem na pasta img/ e adicione uma linha em "artes"
   • Novo plano ......... copie um bloco { ... } de "planos" e cole depois dele
   • Link personalizado . …/tabela/?cliente=Maria&empresa=Padaria&plano=medio
   • Validade por link .. …/tabela/?ate=15/11/2026
   Cuidado: mantenha as vírgulas e as aspas ' ' como estão.
   ===================================================================== */
window.IAMUREL = {
  marca: 'IAMUREL',
  whats: '5548996877913',                              // só números, com 55 + DDD
  insta: 'https://instagram.com/iamurel.agencia', instaNome: '@iamurel.agencia',
  email: 'iamurelbrasil@gmail.com',
  site:  'https://rauldesigner.com.br/iamurel/',       // botão "site principal"
  validade: '30/11/2026',
  rodape: 'Produção mensal antecipada',                // aparece no fim de cada plano

  hero: { tag: 'Tabela de preços', linhas: ['Marketing para', 'negócios <em>reais.</em>'], sub: 'Conteúdo com direção. Design com intenção.' },
  ticker: ['Conteúdo com direção', 'Design com intenção', 'Marketing para negócios reais', 'Produção mensal antecipada'],

  sobre: { titulo: 'Relevância,<br><em>não volume.</em>',
           texto: 'A IAMUREL é um estúdio de comunicação visual e direção de conteúdo. Velocidade com inteligência artificial, acabamento e critério humanos.' },
  pilares: [
    ['Conteúdo planejado', 'Calendário pensado para manter constância.'],
    ['Design com intenção', 'Cada peça com um motivo para existir.'],
    ['Vídeos que vendem', 'Roteiro e edição curta para mostrar o que você faz.'],
    ['Sua marca mais forte', 'Visual consistente em todos os pontos de contato.']
  ],

  // ARTES: para adicionar, ponha o arquivo em img/ e copie uma linha.
  artes: [
    { src: 'img/arte-01.jpg', alt: 'Exemplo de peça para estética', legenda: 'Estética' },
    { src: 'img/arte-02.jpg', alt: 'Exemplo de peça para oficina mecânica', legenda: 'Oficina' },
    { src: 'img/arte-03.jpg', alt: 'Exemplo de peça para o agronegócio', legenda: 'Agro' }
  ],

  // PLANOS: itens = [quantidade, 'nome'] · checks = linhas com ✓ · hot:1 = "Em destaque" · aPartir:1 = "a partir de"
  planos: [
    { id: 'basico', nome: 'Básico', tag: 'Composição fixa', desc: 'Para manter a comunicação do seu negócio em dia.', preco: '329,98',
      itens: [[10,'Posts estáticos'],[1,'Carrossel'],[12,'Stories (telas)']], checks: [],
      nota: 'Preço e entregas fixos. Sem troca ou retirada de itens.' },
    { id: 'medio', nome: 'Médio', tag: 'Composição fixa', hot: 1, desc: 'Mais conteúdo e vídeo para apresentar o que você faz.', preco: '449,98',
      itens: [[14,'Posts estáticos'],[3,'Carrosséis'],[20,'Stories (telas)'],[3,'Roteiros para Reels'],[2,'Vídeos curtos editados'],[1,'Banner promocional']],
      checks: ['Organização do perfil no Instagram'],
      nota: 'Preço e entregas fixos. Sem troca ou retirada de itens.' },
    { id: 'ultra', nome: 'Ultra', tag: 'Base + acréscimos', aPartir: 1, desc: 'Uma base mais completa, com espaço para acrescentar entregas.', preco: '740,00',
      itens: [[20,'Posts estáticos'],[4,'Carrosséis'],[24,'Stories (telas)'],[5,'Roteiros para Reels'],[5,'Vídeos curtos editados'],[3,'Banners promocionais']],
      checks: ['Organização do perfil no Instagram','Catálogo digital — escopo na proposta','Rebranding — escopo na proposta'],
      nota: 'A base é mantida. Acréscimos, catálogo e rebranding têm escopo e valor final definidos na proposta.' }
  ],
  acrescimos: ['Catálogo digital', 'Rebranding'],        // opções extras no pedido (não mudam o preço)

  // QUIZ "qual plano combina": cada opção vale 0, 1 ou 2 (posição do plano). Vale a resposta mais alta.
  quiz: [
    { p: 'Quanto conteúdo você quer por mês?', o: [['O essencial', 0], ['Presença constante', 1], ['Bastante, em ritmo forte', 2]] },
    { p: 'Você quer vídeos?', o: [['Por enquanto não', 0], ['Alguns, curtos', 1], ['Sim, vários', 2]] },
    { p: 'Precisa de catálogo ou rebranding?', o: [['Não', 0], ['Talvez depois', 1], ['Sim', 2]] }
  ],

  passos: [
    ['Conversa rápida', 'Entendemos seu negócio, público e objetivo.'],
    ['Proposta e contrato', 'Plano escolhido, formalizado em contrato simples.'],
    ['Produção antecipada', 'O conteúdo do mês é produzido antes de ir ao ar.'],
    ['Publicação e ajustes', 'Entrega das peças e ajustes combinados.']
  ],
  condicoes: [                                          // REVISAR cada linha com você
    'Preços e entregas fixos por plano, sem troca ou retirada de itens.',
    'Ultra: a base é mantida; acréscimos, catálogo e rebranding têm escopo e valor final na proposta.',
    'Formalização por contrato simples de prestação de serviços.',
    'Forma e data de pagamento combinadas no contrato.',
    'Gestão de tráfego pago e anúncios não fazem parte dos planos.'
  ],
  faq: [                                                // REVISAR as respostas
    ['O que é produção mensal antecipada?', 'O conteúdo de cada mês é produzido antes de entrar no ar, para manter a constância.'],
    ['Posso pedir algo fora do plano?', 'Pode. Itens extras viram proposta, com escopo e valor definidos antes de começar.'],
    ['Como peço a proposta?', 'Preencha o pedido no final desta página: ele abre o WhatsApp com tudo pronto.']
  ]
};
