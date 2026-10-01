/*
 * CONFIGURAÇÃO DO FUNIL — edite textos, perguntas e links aqui.
 *
 * Marcações de texto:
 *   *texto*   → destaque em azul
 *   ^texto^   → destaque laranja forte (valores em dinheiro)
 *   [texto]   → texto dentro da caixa laranja
 *   (texto)   → sublinhado azul (use em títulos curtos)
 *   {id}      → resposta dada na pergunta com esse id (ex.: {rede})
 *
 * Blocos disponíveis (campo `t`):
 *   kicker, title, lead, p, big, checks, steps, quote, versus, features,
 *   stat, strip, highlight, tags, art (ícone), brand, divider,
 *   group (painel que agrupa outros blocos: { t: 'group', blocks: [...] })
 *
 * Variações de `checks`: 'tiles' (3 colunas), 'cards' (2 colunas), 'no' (x),
 * 'soft' (contorno), 'big'. Itens podem ser texto ou { icon, text }.
 */
window.QUIZ_CONFIG = {
  brand: 'postou ganhou',

  // WhatsApp da equipe (só números, com DDI + DDD). Ex.: 5511999999999
  whatsappNumber: '5500000000000',
  whatsappMessage: 'Olá! Finalizei meu teste na Postou Ganhou e quero liberar minha estrutura de creator com site, domínio, portfólio e acesso ao app. Quero saber como funciona.',

  // Opcional: URL que recebe as respostas via POST (JSON) ao clicar no CTA final
  webhookUrl: '',

  steps: [
    /* TELA 01 — ATAQUE */
    {
      id: 'ataque',
      type: 'intro',
      kicker: 'Você tem Instagram ou TikTok?',
      // size: 'money' → linha do valor em destaque | 'sm' → linha menor
      headline: ['Ganhe até', { text: '[R$300,00]', size: 'money' }, 'por dia', { text: 'apenas *postando vídeo.*', size: 'sm' }],
      blocks: [
        { t: 'lead', text: 'Então talvez esteja deixando ^dinheiro na mesa^ toda vez que posta um vídeo.' },
        {
          t: 'group',
          blocks: [
            { t: 'big', text: 'Marcas pagam creators para *postar conteúdos.*' },
            {
              t: 'checks', variant: 'tiles',
              items: [
                { icon: 'star', text: 'Sem precisar ser famoso.' },
                { icon: 'users', text: 'Sem precisar ter 100 mil seguidores.' },
                { icon: 'clock', text: 'Sem precisar viver de internet.' }
              ]
            }
          ]
        }
      ],
      cta: 'Quero fazer R$300/dia',
      ctaNote: 'Responda 4 perguntas e veja como entrar nesse mercado.'
    },

    /* PERGUNTA 1 — MICROCOMPROMISSO */
    {
      id: 'rede',
      type: 'question',
      blocks: [{ t: 'title', text: 'Qual desses você *já tem?*' }],
      layout: 'grid',
      options: [
        { icon: 'instagram', label: 'Instagram' },
        { icon: 'tiktok', label: 'TikTok' },
        { icon: 'layers', label: 'Os dois' },
        { icon: 'globe', label: 'Outra rede social' }
      ],
      // aviso rápido que aparece depois da resposta (sem tela extra)
      feedback: { title: 'Ótimo!', text: 'Você já tem uma das ferramentas necessárias para começar.' }
    },

    /* PERGUNTA 2 — DINHEIRO */
    {
      id: 'meta',
      type: 'question',
      tone: 'money',
      blocks: [
        { t: 'kicker', text: 'Se você recebesse por conteúdo…' },
        { t: 'title', text: 'Qual seria sua *primeira meta?*' }
      ],
      options: [
        { icon: 'coin', label: 'R$100 por dia' },
        { icon: 'cash', label: 'R$200 por dia' },
        { icon: 'wallet', label: 'R$300 por dia' },
        { icon: 'trending', label: 'Quero ir além' }
      ],
      feedback: { title: 'Meta registrada: {meta}', text: 'Agora vamos verificar uma coisa importante sobre seu perfil.' }
    },

    /* PERGUNTA 3 — OBJEÇÃO DOS SEGUIDORES */
    {
      id: 'seguidores',
      type: 'question',
      blocks: [{ t: 'title', text: 'Quantos seguidores você tem *hoje?*' }],
      options: [
        { icon: 'bars1', label: 'Até 1.000' },
        { icon: 'bars2', label: '1.000 a 5.000' },
        { icon: 'bars3', label: '5.000 a 10.000' },
        { icon: 'bars4', label: '+10.000' }
      ],
      feedback: { title: 'Isso não te impede de começar.', text: 'Marcas também buscam pessoas comuns para produzir e divulgar conteúdos.' }
    },

    /* PERGUNTA 4 — GAP */
    {
      id: 'portfolio',
      type: 'question',
      blocks: [
        { t: 'kicker', text: 'Nova mensagem' },
        { t: 'title', size: 'sm', text: 'Uma marca acabou de se interessar pelo *seu conteúdo.*' },
        { t: 'quote', from: 'Marca parceira', pre: 'E pergunta:', text: 'Posso ver seu portfólio?' },
        { t: 'big', text: 'O que você mandaria agora?' }
      ],
      layout: 'grid',
      options: [
        { icon: 'instagram', label: 'Meu Instagram' },
        { icon: 'tiktok', label: 'Meu TikTok' },
        { icon: 'fileX', label: 'Não tenho portfólio' },
        { icon: 'help', label: 'Não sei o que mandar' }
      ]
    },

    /* O PROBLEMA — dor + segundo gap */
    {
      id: 'problema',
      type: 'info',
      blocks: [
        { t: 'title', text: 'É aqui que muita gente *perde força.*' },
        { t: 'versus', pre: 'Porque uma coisa é', from: 'Postar na internet', mid: 'Outra é', to: 'Se apresentar como creator' },
        {
          t: 'group', label: 'Uma marca precisa entender rapidamente',
          blocks: [
            {
              t: 'checks', variant: 'rows',
              items: ['Quem é você.', 'Que tipo de conteúdo você produz.', 'Quais são seus melhores vídeos.', 'Em quais redes você está.', 'E por que deveria considerar você para uma campanha.']
            }
          ]
        },
        { t: 'highlight', solid: true, icon: 'folder', text: 'É por isso que existe o portfólio de creator.' },
        { t: 'kicker', text: 'Mas ainda existe outro problema…' },
        { t: 'title', size: 'sm', text: 'Pra quem você vai *mostrar?*' },
        {
          t: 'group', tone: 'muted',
          blocks: [
            { t: 'checks', variant: 'no', items: ['Ficar mandando mensagem aleatória para empresa?', 'Esperar alguma marca descobrir seu perfil?', 'Torcer para alguém responder sua DM?'] }
          ]
        },
        { t: 'big', text: '[Não precisa ser assim.]' }
      ],
      cta: 'Mostrar como funciona'
    },

    /* A SOLUÇÃO — big reveal + visualização */
    {
      id: 'solucao',
      type: 'info',
      blocks: [
        { t: 'kicker', text: 'Conheça a' },
        { t: 'brand' },
        { t: 'lead', text: 'Uma estrutura criada para *conectar creators* ao mercado de marcas.' },
        {
          t: 'checks', variant: 'cards',
          items: [
            { icon: 'monitor', text: 'Seu próprio site' },
            { icon: 'link', text: 'Seu próprio domínio' },
            { icon: 'folder', text: 'Seu portfólio digital' },
            { icon: 'phone', text: 'App Postou Ganhou' }
          ]
        },
        { t: 'stat', label: 'E o principal: o app', pre: 'Um ecossistema com', value: '+1.000', unit: 'marcas brasileiras', text: 'e oportunidades para creators encontrarem campanhas e trabalhos disponíveis na plataforma.' },
        { t: 'title', size: 'sm', text: 'Imagina abrir o *celular…*' },
        { t: 'steps', items: ['Encontrar oportunidades de marcas.', 'Escolher campanhas compatíveis com seu perfil.', 'Usar seu portfólio para se apresentar.', 'Produzir e publicar seu conteúdo.', 'E poder ser ^remunerado^ pelas campanhas em que participar.'] },
        { t: 'big', text: 'Você já tem o celular, a rede social e sabe postar. Agora só falta *se profissionalizar.*' }
      ],
      cta: 'Preparar minha estrutura'
    },

    /* PROCESSAMENTO */
    {
      id: 'processamento',
      type: 'loading',
      title: 'Preparando seu *acesso…*',
      items: ['Perfil identificado.', 'Rede social identificada: {rede}.', 'Meta definida: ^{meta}^.', 'Preparando próximos passos.'],
      wait: 'Aguarde…',
      duration: 4200
    },

    /* RESULTADO + CTA */
    {
      id: 'cta',
      type: 'final',
      noBack: true,
      blocks: [
        { t: 'art', icon: 'trophy', solid: true, celebrate: true, achievement: 'Nível Creator' },
        { t: 'title', text: 'Seu próximo passo está *liberado.*' },
        { t: 'p', text: 'Pelas suas respostas, você já possui *o básico necessário* para começar a estruturar sua presença como creator.' },
        {
          t: 'checks', variant: 'tiles',
          items: [
            { icon: 'video', text: 'Você já posta.' },
            { icon: 'phone', text: 'Você já tem o celular.' },
            { icon: 'users', text: 'Você já tem a rede social.' }
          ]
        },
        { t: 'title', size: 'sm', text: 'Agora falta transformar isso em uma *estrutura de creator.*' },
        {
          t: 'group', label: 'Seu acesso Postou Ganhou inclui',
          blocks: [
            {
              t: 'checks', variant: 'cards',
              items: [
                { icon: 'monitor', text: 'Site profissional' },
                { icon: 'link', text: 'Domínio próprio' },
                { icon: 'folder', text: 'Portfólio de creator' },
                { icon: 'phone', text: 'App com +1.000 marcas' }
              ]
            }
          ]
        },
        { t: 'p', text: 'Clique abaixo e fale com nossa equipe para conhecer as condições e liberar sua estrutura *Postou Ganhou.*' }
      ],
      cta: 'Resgatar meu acesso agora',
      note: 'Você será direcionado para o WhatsApp.'
    }
  ]
};
