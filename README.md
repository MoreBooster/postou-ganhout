# Postou Ganhou — Funil Quiz

Funil de quiz mobile-first (12 telas), em HTML, CSS e JS puro, sem build e sem dependências.

## Estrutura

```
index.html        → página única
css/styles.css    → visual (cores no topo, em :root)
js/config.js      → TODO o conteúdo: textos, perguntas, WhatsApp
js/quiz.js        → motor do funil (não precisa mexer)
```

## Antes de publicar

1. Em `js/config.js`, troque `whatsappNumber` pelo número da equipe (DDI + DDD + número, só dígitos).
2. (Opcional) Preencha `webhookUrl` para receber as respostas (Make, Zapier, n8n…) quando a pessoa clica no botão final.
3. (Opcional) Troque os emojis de `avatars` por fotos PNG com fundo transparente (ex.: `img/creator1.png`) para ficar ainda mais próximo da referência.

## Como editar textos

Cada tela é um item de `steps` em `js/config.js`, formado por blocos (`title`, `p`, `checks`, `highlight`…).

- `*texto*` → destaque azul
- `[texto]` → texto dentro da caixa azul
- `(texto)` → círculo desenhado à mão
- `{rede}` / `{meta}` → mostra a resposta da pessoa

## Rastreamento

Se o Pixel da Meta (`fbq`), o GA4 (`gtag`) ou o GTM (`dataLayer`) estiverem na página, o funil dispara:
`QuizStep` (cada tela), `QuizStart` e `Lead` (clique no WhatsApp).

## Rodar localmente

Abra o `index.html` no navegador, ou use `npx serve .`.
Para publicar, basta subir a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger…).
