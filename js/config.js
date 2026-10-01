/*
 * CONFIGURAÇÃO DO FUNIL — edite textos, perguntas e links aqui.
 *
 * Marcações de texto:
 *   *texto*   → destaque em azul (itálico nos títulos)
 *   [texto]   → texto dentro da "caixa" azul
 *   (texto)   → círculo desenhado à mão em volta (use em títulos curtos)
 *   {id}      → resposta dada na pergunta com esse id (ex.: {rede})
 *
 * Blocos disponíveis (campo `t`):
 *   kicker, title, lead, p, big, money, checks, steps, quote,
 *   versus, features, stat, highlight, tags, art, brand, divider
 */
window.QUIZ_CONFIG = {
  brand: 'postou ganhou',

  // WhatsApp da equipe (só números, com DDI + DDD). Ex.: 5511999999999
  whatsappNumber: '5500000000000',
  whatsappMessage: 'Olá! Finalizei meu teste na Postou Ganhou e quero liberar minha estrutura de creator com site, domínio, portfólio e acesso ao app. Quero saber como funciona.',

  // Opcional: URL que recebe as respostas via POST (JSON) ao clicar no CTA final
  webhookUrl: '',

  // Avatares usados nas formas orgânicas (emoji ou caminho de imagem, ex.: 'img/creator1.png')
  avatars: ['🧑🏻‍🦰', '👩🏾‍🦱', '👩🏼', '🧑🏽'],

  steps: [
    /* TELA 01 — ATAQUE */
    {
      id: 'ataque',
      type: 'intro',
      headline: ['Você tem', '[Instagram]', 'ou (TikTok)?'],
      blocks: [
        { t: 'lead', text: 'Então talvez esteja deixando *dinheiro na mesa* toda vez que posta um vídeo.' },
        { t: 'divider' },
        { t: 'big', text: 'Marcas pagam creators para *postar conteúdos.*' },
        { t: 'p', text: 'E algumas oportunidades podem chegar a:' },
        { t: 'money', pre: 'até', value: 'R$300', suffix: 'por dia' },
        { t: 'checks', items: ['Sem precisar ser famoso.', 'Sem precisar ter 100 mil seguidores.', 'Sem precisar viver de internet.'] },
        { t: 'p', center: true, text: 'Responda *4 perguntas* e veja como entrar nesse mercado.' }
      ],
      cta: 'Quero ver se posso começar'
    },

    /* TELA 02 — MICROCOMPROMISSO */
    {
      id: 'rede',
      type: 'question',
      blocks: [{ t: 'title', text: 'Qual desses você *já tem?*' }],
      layout: 'grid',
      options: [
        { icon: '📸', label: 'Instagram' },
        { icon: '🎵', label: 'TikTok' },
        { icon: '✌️', label: 'Os dois' },
        { icon: '🌐', label: 'Outra rede social' }
      ]
    },
    {
      id: 'rede-ok',
      type: 'info',
      blocks: [
        { t: 'art', shape: 'asterisk', emoji: '👏', fill: 'var(--blue)' },
        { t: 'title', size: 'xl', text: '[Ótimo.]' },
        { t: 'lead', text: 'Então você já tem *uma das ferramentas* necessárias para começar.' },
        { t: 'highlight', text: 'Mas existe uma segunda parte que muita gente ainda não conhece.' }
      ],
      cta: 'Continuar'
    },

    /* TELA 03 — DINHEIRO */
    {
      id: 'meta',
      type: 'question',
      blocks: [
        { t: 'kicker', text: 'Se você recebesse por conteúdo…' },
        { t: 'title', text: 'Qual seria sua *primeira meta?*' }
      ],
      options: [
        { icon: '🪙', label: 'R$100 por dia' },
        { icon: '💵', label: 'R$200 por dia' },
        { icon: '💰', label: 'R$300 por dia' },
        { icon: '🚀', label: 'Quero ir além' }
      ]
    },
    {
      id: 'meta-ok',
      type: 'info',
      blocks: [
        { t: 'art', shape: 'clover', emoji: '🎯', fill: 'var(--blue-200)' },
        { t: 'title', size: 'xl', text: 'Meta *registrada.*' },
        { t: 'tags', items: ['🎯 {meta}'] },
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
        { icon: '🌱', label: 'Até 1.000' },
        { icon: '🌿', label: '1.000 a 5.000' },
        { icon: '🌳', label: '5.000 a 10.000' },
        { icon: '🔥', label: '+10.000' }
      ]
    },
    {
      id: 'seguidores-ok',
      type: 'info',
      blocks: [
        { t: 'art', kind: 'avatars' },
        { t: 'title', text: 'Isso *não te impede* de começar.' },
        { t: 'p', text: 'Você não precisa necessariamente ser um grande influencer para trabalhar como creator.' },
        { t: 'p', text: 'Marcas também podem buscar *pessoas comuns* para produzir e divulgar conteúdos.' },
        { t: 'highlight', text: 'O número de seguidores é apenas uma parte. O próximo ponto é *muito mais importante.*' }
      ],
      cta: 'Descobrir'
    },

    /* TELA 05 — GAP */
    {
      id: 'portfolio',
      type: 'question',
      blocks: [
        { t: 'kicker', text: '🔔 Nova notificação' },
        { t: 'title', size: 'sm', text: 'Uma marca acabou de se interessar pelo *seu conteúdo.*' },
        { t: 'quote', from: 'Marca parceira', pre: 'E pergunta:', text: 'Posso ver seu portfólio?' },
        { t: 'big', text: 'O que você mandaria agora?' }
      ],
      options: [
        { icon: '📸', label: 'Meu Instagram' },
        { icon: '🎵', label: 'Meu TikTok' },
        { icon: '🫥', label: 'Não tenho portfólio' },
        { icon: '🤔', label: 'Não sei o que mandar' }
      ]
    },

    /* TELA 06 — DOR */
    {
      id: 'dor',
      type: 'info',
      blocks: [
        { t: 'title', text: 'É aqui que muita gente *perde força.*' },
        { t: 'versus', pre: 'Porque uma coisa é', from: 'Postar na internet', mid: 'Outra é', to: 'Se apresentar como creator' },
        { t: 'p', text: 'Uma marca precisa conseguir entender *rapidamente:*' },
        { t: 'checks', items: ['Quem é você.', 'Que tipo de conteúdo você produz.', 'Quais são seus melhores vídeos.', 'Em quais redes você está.', 'E por que deveria considerar você para uma campanha.'] },
        { t: 'highlight', text: 'É por isso que existe o *portfólio de creator.*' }
      ],
      cta: 'Entendi'
    },

    /* TELA 07 — SEGUNDO GAP */
    {
      id: 'gap2',
      type: 'info',
      blocks: [
        { t: 'kicker', text: 'Mas ainda existe outro problema…' },
        { t: 'checks', variant: 'soft', items: ['Você pode ter um portfólio lindo.', 'Pode ter domínio.', 'Pode ter Instagram organizado.', 'Pode saber gravar.'] },
        { t: 'title', text: 'Mas pra quem você vai *(mostrar)?*' },
        { t: 'checks', variant: 'no', items: ['Ficar mandando mensagem aleatória para empresa?', 'Esperar alguma marca descobrir seu perfil?', 'Torcer para alguém responder sua DM?'] },
        { t: 'big', center: true, text: '[Não precisa ser assim.]' }
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
        { t: 'p', text: 'Ao entrar, você poderá ter:' },
        {
          t: 'features',
          items: [
            { icon: '🖥️', title: 'Seu próprio site', text: 'Sua vitrine profissional como creator.' },
            { icon: '🔗', title: 'Seu próprio domínio', text: 'Um endereço para apresentar seu trabalho.' },
            { icon: '🗂️', title: 'Seu portfólio digital', text: 'Seus conteúdos organizados profissionalmente.' }
          ]
        },
        { t: 'p', text: 'E o principal:' },
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
        { t: 'steps', items: ['Entrar na plataforma.', 'Encontrar oportunidades de marcas.', 'Escolher campanhas compatíveis com seu perfil.', 'Usar seu portfólio para apresentar seu trabalho.', 'Produzir seu conteúdo.', 'Publicar.', 'E poder ser remunerado pelas campanhas em que participar.'] },
        { t: 'highlight', text: 'Tudo começa com sua *estrutura de creator.*' },
        { t: 'checks', items: ['Você já tem o celular.', 'Você já tem a rede social.', 'Você já sabe postar.'] },
        { t: 'big', text: 'Agora falta *profissionalizar essa porra.*' }
      ],
      cta: 'Preparar minha estrutura'
    },

    /* TELA 10 — PROCESSAMENTO */
    {
      id: 'processamento',
      type: 'loading',
      title: 'Preparando seu *acesso…*',
      items: ['Perfil identificado.', 'Rede social identificada: {rede}.', 'Meta definida: {meta}.', 'Preparando próximos passos.'],
      wait: 'Aguarde…',
      duration: 5000
    },

    /* TELA 11 — RESULTADO */
    {
      id: 'resultado',
      type: 'info',
      noBack: true,
      blocks: [
        { t: 'art', shape: 'arch', emoji: '🔓', fill: 'var(--blue)', confetti: true },
        { t: 'title', text: 'Seu próximo passo está *liberado.*' },
        { t: 'p', text: 'Pelas suas respostas, você já possui *o básico necessário* para começar a estruturar sua presença como creator.' },
        { t: 'p', text: 'Agora você pode conhecer a estrutura da:' },
        { t: 'brand' },
        { t: 'p', text: 'Você poderá ter acesso a:' },
        { t: 'checks', variant: 'cards', items: ['Site profissional', 'Domínio próprio', 'Portfólio de creator', 'App com +1.000 marcas'] },
        { t: 'p', text: 'Uma estrutura para apresentar seu conteúdo profissionalmente e encontrar oportunidades disponíveis para creators.' }
      ],
      cta: 'Ver como liberar'
    },

    /* TELA 12 — CTA */
    {
      id: 'cta',
      type: 'final',
      blocks: [
        { t: 'checks', variant: 'big', items: ['Você já posta.', 'Você já tem o celular.', 'Você já tem a rede social.'] },
        { t: 'title', text: 'Agora falta transformar isso em uma *estrutura de creator.*' },
        { t: 'p', text: 'Clique abaixo e fale com nossa equipe para conhecer as condições e liberar sua estrutura *Postou Ganhou.*' },
        { t: 'tags', items: ['🖥️ Site', '🔗 Domínio', '🗂️ Portfólio', '📱 App Postou Ganhou'] }
      ],
      cta: 'Resgatar meu acesso agora',
      note: 'Você será direcionado para o WhatsApp.'
    }
  ]
};
