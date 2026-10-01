/*
 * CONFIGURAÇÃO DO FUNIL — edite textos, perguntas e links aqui.
 *
 * Marcações de texto:
 *   *texto*   → destaque em azul
 *   ^texto^   → destaque laranja forte (valores em dinheiro)
 *   [texto]   → texto dentro da caixa laranja
 *   (texto)   → sublinhado azul (use em títulos curtos)
 *   {id}      → resposta dada na pergunta com esse id (ex.: {rede})
 *   {xp}      → XP acumulado | {xptotal} → XP máximo do funil
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

    /* TELA 02 — MICROCOMPROMISSO */
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
      ]
    },
    {
      id: 'rede-ok',
      type: 'info',
      blocks: [
        { t: 'art', icon: 'checkCircle', solid: true, celebrate: true, achievement: 'Conquista desbloqueada' },
        { t: 'title', size: 'xl', text: 'Ótimo.' },
        { t: 'lead', text: 'Então você já tem *uma das ferramentas* necessárias para começar.' },
        { t: 'highlight', icon: 'lock', text: 'Mas existe uma segunda parte que muita gente ainda não conhece.' }
      ],
      cta: 'Continuar'
    },

    /* TELA 03 — DINHEIRO */
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
      ]
    },
    {
      id: 'meta-ok',
      type: 'info',
      blocks: [
        { t: 'art', icon: 'target', solid: true, celebrate: true, achievement: 'Meta definida' },
        { t: 'title', size: 'xl', text: 'Meta *registrada.*' },
        { t: 'tags', accent: true, items: ['{meta}'] },
        { t: 'lead', text: 'Agora precisamos verificar uma coisa *importante* sobre seu perfil.' }
      ],
      cta: 'Verificar'
    },

    /* TELA 04 — OBJEÇÃO DOS SEGUIDORES */
    {
      id: 'seguidores',
      type: 'question',
      blocks: [{ t: 'title', text: 'Quantos seguidores você tem *hoje?*' }],
      options: [
        { icon: 'bars1', label: 'Até 1.000' },
        { icon: 'bars2', label: '1.000 a 5.000' },
        { icon: 'bars3', label: '5.000 a 10.000' },
        { icon: 'bars4', label: '+10.000' }
      ]
    },
    {
      id: 'seguidores-ok',
      type: 'info',
      blocks: [
        { t: 'art', icon: 'trending', achievement: 'Obstáculo superado' },
        { t: 'title', text: 'Isso *não te impede* de começar.' },
        {
          t: 'group',
          blocks: [
            { t: 'p', text: 'Você não precisa necessariamente ser um grande influencer para trabalhar como creator.' },
            { t: 'divider' },
            { t: 'p', text: 'Marcas também podem buscar *pessoas comuns* para produzir e divulgar conteúdos.' }
          ]
        },
        { t: 'highlight', icon: 'arrowDown', text: 'O número de seguidores é apenas uma parte. O próximo ponto é *muito mais importante.*' }
      ],
      cta: 'Descobrir'
    },

    /* TELA 05 — GAP */
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

    /* TELA 06 — DOR */
    {
      id: 'dor',
      type: 'info',
      blocks: [
        { t: 'title', text: 'É aqui que muita gente *perde força.*' },
        { t: 'versus', pre: 'Porque uma coisa é', from: 'Postar na internet', mid: 'Outra é', to: 'Se apresentar como creator' },
        {
          t: 'group', label: 'Uma marca precisa conseguir entender rapidamente',
          blocks: [
            {
              t: 'checks', variant: 'rows',
              items: ['Quem é você.', 'Que tipo de conteúdo você produz.', 'Quais são seus melhores vídeos.', 'Em quais redes você está.', 'E por que deveria considerar você para uma campanha.']
            }
          ]
        },
        { t: 'highlight', solid: true, icon: 'folder', text: 'É por isso que existe o portfólio de creator.' }
      ],
      cta: 'Entendi'
    },

    /* TELA 07 — SEGUNDO GAP */
    {
      id: 'gap2',
      type: 'info',
      blocks: [
        { t: 'kicker', text: 'Mas ainda existe outro problema…' },
        {
          t: 'checks', variant: 'cards',
          items: [
            { icon: 'folder', text: 'Você pode ter um portfólio lindo.' },
            { icon: 'link', text: 'Pode ter domínio.' },
            { icon: 'instagram', text: 'Pode ter Instagram organizado.' },
            { icon: 'video', text: 'Pode saber gravar.' }
          ]
        },
        { t: 'title', text: 'Mas pra quem você vai *mostrar?*' },
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

    /* TELA 08 — BIG REVEAL */
    {
      id: 'reveal',
      type: 'info',
      blocks: [
        { t: 'kicker', text: 'Conheça a' },
        { t: 'brand' },
        { t: 'lead', text: 'Uma estrutura criada para *conectar creators* ao mercado de marcas.' },
        {
          t: 'group', label: 'Ao entrar, você poderá ter',
          blocks: [
            {
              t: 'features',
              items: [
                { icon: 'monitor', title: 'Seu próprio site', text: 'Sua vitrine profissional como creator.' },
                { icon: 'link', title: 'Seu próprio domínio', text: 'Um endereço para apresentar seu trabalho.' },
                { icon: 'folder', title: 'Seu portfólio digital', text: 'Seus conteúdos organizados profissionalmente.' }
              ]
            }
          ]
        },
        { t: 'kicker', text: 'E o principal' },
        { t: 'stat', label: 'Acesso ao app Postou Ganhou', pre: 'Um ecossistema com', value: '+1.000', unit: 'marcas brasileiras', text: 'e oportunidades para creators encontrarem campanhas e trabalhos disponíveis na plataforma.' },
        { t: 'title', size: 'sm', text: 'Não é *só um site.*' },
        { t: 'versus', pre: 'É uma estrutura para você sair do', from: '“Eu posto vídeos.”', mid: 'E começar a se apresentar como', to: '“Eu sou creator.”' }
      ],
      cta: 'Quero meu acesso'
    },

    /* TELA 09 — VISUALIZAÇÃO */
    {
      id: 'visualizacao',
      type: 'info',
      blocks: [
        { t: 'title', text: 'Imagina abrir o *celular…*' },
        { t: 'steps', items: ['Entrar na plataforma.', 'Encontrar oportunidades de marcas.', 'Escolher campanhas compatíveis com seu perfil.', 'Usar seu portfólio para apresentar seu trabalho.', 'Produzir seu conteúdo.', 'Publicar.', 'E poder ser ^remunerado^ pelas campanhas em que participar.'] },
        {
          t: 'group',
          blocks: [
            { t: 'big', text: 'Tudo começa com sua *estrutura de creator.*' },
            {
              t: 'checks', variant: 'tiles',
              items: [
                { icon: 'phone', text: 'Você já tem o celular.' },
                { icon: 'users', text: 'Você já tem a rede social.' },
                { icon: 'video', text: 'Você já sabe postar.' }
              ]
            }
          ]
        },
        { t: 'big', text: 'Agora falta *profissionalizar essa porra.*' }
      ],
      cta: 'Preparar minha estrutura'
    },

    /* TELA 10 — PROCESSAMENTO */
    {
      id: 'processamento',
      type: 'loading',
      title: 'Preparando seu *acesso…*',
      items: ['Perfil identificado.', 'Rede social identificada: {rede}.', 'Meta definida: ^{meta}^.', 'Preparando próximos passos.'],
      wait: 'Aguarde…',
      duration: 5000
    },

    /* TELA 11 — RESULTADO */
    {
      id: 'resultado',
      type: 'info',
      noBack: true,
      blocks: [
        { t: 'art', icon: 'unlock', solid: true, celebrate: true, achievement: 'Nível desbloqueado' },
        { t: 'tags', accent: true, items: ['+{xp} XP acumulados'] },
        { t: 'title', text: 'Seu próximo passo está *liberado.*' },
        { t: 'p', text: 'Pelas suas respostas, você já possui *o básico necessário* para começar a estruturar sua presença como creator.' },
        {
          t: 'group', label: 'Agora você pode conhecer a estrutura da',
          blocks: [
            { t: 'brand', size: 'sm' },
            { t: 'p', text: 'Você poderá ter acesso a:' },
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
        { t: 'p', text: 'Uma estrutura para apresentar seu conteúdo profissionalmente e encontrar oportunidades disponíveis para creators.' }
      ],
      cta: 'Ver como liberar'
    },

    /* TELA 12 — CTA */
    {
      id: 'cta',
      type: 'final',
      blocks: [
        { t: 'art', icon: 'trophy', solid: true, celebrate: true, achievement: 'Nível Creator' },
        {
          t: 'checks', variant: 'tiles',
          items: [
            { icon: 'video', text: 'Você já posta.' },
            { icon: 'phone', text: 'Você já tem o celular.' },
            { icon: 'users', text: 'Você já tem a rede social.' }
          ]
        },
        { t: 'title', text: 'Agora falta transformar isso em uma *estrutura de creator.*' },
        { t: 'p', text: 'Clique abaixo e fale com nossa equipe para conhecer as condições e liberar sua estrutura *Postou Ganhou.*' },
        {
          t: 'group', label: 'Seu acesso inclui',
          blocks: [
            {
              t: 'checks', variant: 'cards',
              items: [
                { icon: 'monitor', text: 'Site' },
                { icon: 'link', text: 'Domínio' },
                { icon: 'folder', text: 'Portfólio' },
                { icon: 'phone', text: 'App Postou Ganhou' }
              ]
            }
          ]
        }
      ],
      cta: 'Resgatar meu acesso agora',
      note: 'Você será direcionado para o WhatsApp.'
    }
  ]
};
