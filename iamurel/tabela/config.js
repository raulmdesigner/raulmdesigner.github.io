/* =====================================================================
   IAMUREL · TABELA DE PREÇOS — ARQUIVO DE CONFIGURAÇÃO
   Para mudar qualquer coisa na página, edite SÓ este arquivo.
   (Não existe painel de administração: é um site estático, sem login,
   sem banco de dados — por isso não há o que invadir.)

   COMO EDITAR RÁPIDO
   • Mudar preço ........ procure o plano e troque  preco:'449,98'
   • Nova arte .......... coloque a imagem em img/ e copie uma linha de "artes"
   • Novo segmento ...... acrescente em "segmentos" e use o mesmo id em "seg" da arte
   • Novo plano ......... copie um bloco { ... } de "planos" e cole depois dele
   LINKS PARA ENVIAR (troque o endereço pelo seu)
   • Cliente novo ....... …/tabela/?cliente=Maria&empresa=Padaria&plano=medio
   • Já estão conversando …/tabela/?conversa=1&cliente=Maria   (a mensagem do WhatsApp muda)
   • Validade por link .. …/tabela/?ate=15/11/2026
   Linhas marcadas REVISAR foram sugeridas por mim: confirme se são verdade para você.
   Cuidado: mantenha as vírgulas e as aspas ' ' como estão.
   ===================================================================== */
window.IAMUREL = {
  marca: 'IAMUREL',
  whats: '5548996877913',                              // só números, com 55 + DDD
  insta: 'https://instagram.com/iamurel.agencia', instaNome: '@iamurel.agencia',
  email: 'iamurelbrasil@gmail.com',
  site:  'https://rauldesigner.com.br/iamurel/',
  validade: '30/11/2026',                              // REVISAR
  rodape: 'Produção mensal antecipada',

  hero: { tag: 'Tabela de preços', linhas: ['Tire o peso do feed', 'das <em>suas costas.</em>'],
          sub: 'Conteúdo planejado e design com intenção para o seu negócio aparecer toda semana.',
          cta: 'Quero organizar minhas redes', ctaConversa: 'Escolher meu plano' },
  ticker: ['Conteúdo com direção', 'Design com intenção', 'Marketing para negócios reais', 'Produção mensal antecipada'],

  // Mensagens do WhatsApp. {seg} {plano} são preenchidos sozinhos.
  msg: {
    rapida: 'Olá! Vi a tabela de preços da IAMUREL e quero organizar minhas redes sociais. Pode me explicar como funciona?',
    nova: 'Olá! Vim pela tabela de preços da IAMUREL.',
    conversa: 'Vi a tabela que você me enviou.',
    quiz: 'Olá! Fiz o quiz da tabela da IAMUREL: meu negócio é {seg} e o plano {plano} parece ideal. Podemos conversar?',
    quizConversa: 'Fiz o quiz da tabela e o plano {plano} parece ideal para o meu negócio ({seg}). Vamos seguir por aqui?',
    fecho: 'Pode me enviar a proposta?', fechoConversa: 'Podemos seguir por aqui?'
  },

  dorTitulo: 'Postar não deveria ser<br>mais um <em>trabalho.</em>',
  dores: [                                              // [dor, o que a IAMUREL faz]
    ['Feed parado ou irregular', 'Calendário planejado para manter constância.'],
    ['Falta de tempo', 'O conteúdo do mês é produzido antes de ir ao ar.'],
    ['Falta de ideias', 'Temas e roteiros pensados para o seu negócio.'],
    ['Difícil mostrar o serviço', 'Design e vídeos curtos que explicam o que você faz.']
  ],

  // GALERIA: seg = id de "segmentos" · uso = o que a peça faz pelo negócio
  segmentos: [['todos', 'Todos'], ['beleza', 'Beleza'], ['servicos', 'Serviços'], ['agro', 'Agro']],
  artes: [
    { src: 'img/arte-01.jpg', alt: 'Exemplo de peça para estética', legenda: 'Estética', seg: 'beleza', uso: 'Cria autoridade e confiança' },
    { src: 'img/arte-02.jpg', alt: 'Exemplo de peça para oficina mecânica', legenda: 'Oficina', seg: 'servicos', uso: 'Explica o serviço com clareza' },
    { src: 'img/arte-03.jpg', alt: 'Exemplo de peça para o agronegócio', legenda: 'Agro', seg: 'agro', uso: 'Mostra o valor do trabalho' }
  ],

  // PLANOS: itens = [quantidade, 'nome'] · checks = linhas com ✓ · selo = etiqueta de destaque · aPartir:1
  planos: [
    { id: 'basico', nome: 'Básico', tag: 'Composição fixa', para: 'Para começar com constância.', desc: 'Para manter a comunicação do seu negócio em dia.', preco: '329,98',
      itens: [[10,'Posts estáticos'],[1,'Carrossel'],[12,'Stories (telas)']], checks: [],
      nota: 'Preço e entregas fixos. Sem troca ou retirada de itens.' },
    { id: 'medio', nome: 'Médio', tag: 'Composição fixa', selo: 'Mais equilibrado', para: 'Para somar vídeo ao feed.', desc: 'Mais conteúdo e vídeo para apresentar o que você faz.', preco: '449,98',
      itens: [[14,'Posts estáticos'],[3,'Carrosséis'],[20,'Stories (telas)'],[3,'Roteiros para Reels'],[2,'Vídeos curtos editados'],[1,'Banner promocional']],
      checks: ['Organização do perfil no Instagram'],
      nota: 'Preço e entregas fixos. Sem troca ou retirada de itens.' },
    { id: 'ultra', nome: 'Ultra', tag: 'Base + acréscimos', aPartir: 1, para: 'Para quem quer volume e espaço para crescer.', desc: 'Uma base mais completa, com espaço para acrescentar entregas.', preco: '740,00',
      itens: [[20,'Posts estáticos'],[4,'Carrosséis'],[24,'Stories (telas)'],[5,'Roteiros para Reels'],[5,'Vídeos curtos editados'],[3,'Banners promocionais']],
      checks: ['Organização do perfil no Instagram','Catálogo digital — escopo na proposta','Rebranding — escopo na proposta'],
      nota: 'A base é mantida. Acréscimos, catálogo e rebranding têm escopo e valor final definidos na proposta.' }
  ],
  acrescimos: ['Catálogo digital', 'Rebranding'],        // aparecem no pedido do Ultra (não mudam o preço)

  // QUIZ: opções com valor 0, 1 ou 2 contam para o plano (média arredondada).
  // "pontua:0" = só ajuda a conversa. Na última pergunta, "Sim" (2) leva direto ao plano mais completo.
  quiz: [
    { id: 'seg', p: 'Qual é o seu tipo de negócio?', pontua: 0, o: [['Beleza e estética','beleza'],['Alimentação','alimentacao'],['Serviços (oficina, clínica…)','servicos'],['Loja e varejo','varejo'],['Agro e campo','agro'],['Outro','outro']] },
    { id: 'obj', p: 'O que você mais quer agora?', pontua: 0, o: [['Ser lembrado e mostrar que existo','lembrado'],['Divulgar ofertas e produtos','ofertas'],['Passar mais confiança','confianca']] },
    { id: 'freq', p: 'Quanto conteúdo você quer por mês?', o: [['O essencial',0],['Presença constante',1],['Bastante, em ritmo forte',2]] },
    { id: 'video', p: 'Você quer vídeos?', o: [['Por enquanto não',0],['Alguns, curtos',1],['Sim, vários',2]] },
    { id: 'extra', p: 'Precisa de catálogo ou rebranding?', o: [['Não',0],['Talvez depois',1],['Sim',2]] }
  ],
  ideias: {                                             // REVISAR: ideia de conteúdo mostrada no resultado
    beleza: 'Antes e depois, dicas de cuidado e bastidores do atendimento.',
    alimentacao: 'Prato do dia, bastidores da cozinha e oferta da semana.',
    servicos: 'Explicar o serviço, mostrar o trabalho feito e responder dúvidas comuns.',
    varejo: 'Novidades, combos e dicas de uso dos produtos.',
    agro: 'Rotina do campo, qualidade do produto e quem já compra de você.',
    outro: 'Mostrar o que você faz, para quem e como pedir.'
  },

  passosTitulo: 'O que acontece depois<br>que você <em>chama.</em>',
  passos: [                                             // REVISAR
    ['Briefing', 'Conversa rápida para entender seu negócio, público e objetivo.'],
    ['Produção e aprovação', 'Criamos o conteúdo do mês e você aprova antes de publicar.'],
    ['Entrega e publicação', 'As peças são entregues conforme o plano escolhido.']
  ],
  condicoes: [                                          // REVISAR
    'Preços e entregas fixos por plano, sem troca ou retirada de itens.',
    'Ultra: a base é mantida; acréscimos, catálogo e rebranding têm escopo e valor final na proposta.',
    'Formalização por contrato simples de prestação de serviços.',
    'Forma e data de pagamento combinadas no contrato.',
    'Gestão de tráfego pago e anúncios não fazem parte dos planos.'
  ],
  faq: [                                                // REVISAR as respostas
    ['Preciso aprovar antes de postar?', 'Sim. As peças passam pela sua aprovação antes de irem ao ar.'],
    ['Preciso mandar fotos?', 'Fotos e informações do seu negócio ajudam muito. O que faltar a gente resolve no briefing.'],
    ['Quantas peças eu recebo?', 'Depende do plano: veja as quantidades de posts, carrosséis e stories em cada um.'],
    ['Funciona para outras redes além do Instagram?', 'Os planos são pensados para o Instagram. Outras redes podem entrar em proposta.'],
    ['Posso pedir algo fora do plano?', 'Pode. Itens extras viram proposta, com escopo e valor definidos antes de começar.']
  ]
};
