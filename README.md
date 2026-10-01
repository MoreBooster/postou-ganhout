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

## Como editar textos

Cada tela é um item de `steps` em `js/config.js`, formado por blocos (`title`, `p`, `checks`, `highlight`…).

- `*texto*` → destaque laranja
- `[texto]` → texto dentro da caixa laranja
- `(texto)` → sublinhado laranja
- `^texto^` → laranja forte (valores em dinheiro)
- `{rede}` / `{meta}` → mostra a resposta da pessoa
- `{sim}` / `{simtotal}` → valor atual / valor máximo do simulador

## Gamificação

**Simulador de potencial:** o contador do topo soma R$/dia a cada etapa concluída, conforme o campo `sim` de cada etapa no `js/config.js` (hoje 60 + 80 + 60 + 60 + 20 + 20 = R$ 300/dia). Ele aparece sempre identificado como simulação, e a tela final traz um aviso de que não é garantia de ganho. Mantenha esse aviso.

**Avisos de resposta:** o campo `feedback` de cada pergunta mostra um aviso rápido que avança sozinho.

**Conquistas:** nos blocos `art`, use `achievement: 'Texto do selo'` e `celebrate: true` para disparar confete.

## Rastreamento

Se o Pixel da Meta (`fbq`), o GA4 (`gtag`) ou o GTM (`dataLayer`) estiverem na página, o funil dispara:
`QuizStep` (cada tela), `QuizStart` e `Lead` (clique no WhatsApp).

## Rodar localmente

Abra o `index.html` no navegador, ou use `npx serve .`.
Para publicar, basta subir a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger…).
