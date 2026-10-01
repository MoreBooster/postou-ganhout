(function () {
  'use strict';

  var C = window.QUIZ_CONFIG;
  var app = document.getElementById('app');
  var steps = C.steps;
  var answers = {};
  var current = 0;

  // gamificação: simulador de potencial (R$/dia) — cada etapa soma o valor do campo `sim` no config.
  // É uma simulação ilustrativa, sempre identificada como tal na tela.
  var sim = 0;
  var awarded = {};
  var lastPct = 0;
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var simTotal = C.steps.reduce(function (t, s) { return t + (s.sim || 0); }, 0);
  function brl(n) { return 'R$ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var busy = false;

  var progressSteps = steps.filter(function (s) { return s.type !== 'intro' && s.type !== 'loading'; });
  var questionSteps = steps.filter(function (s) { return s.type === 'question'; });

  /* ---------- helpers ---------- */

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function indexOfId(id) {
    for (var i = 0; i < steps.length; i++) if (steps[i].id === id) return i;
    return -1;
  }

  function answerLabel(id) {
    var s = steps[indexOfId(id)];
    if (!s || answers[id] == null) return '';
    return s.options[answers[id]].label;
  }

  // {id} → resposta; *x* → destaque; ^x^ → verde; [x] → caixa; (x) → sublinhado
  function rich(str) {
    var out = esc(String(str || '').replace(/\{([\w-]+)\}/g, function (_, id) {
      if (id === 'sim') return brl(sim);
      if (id === 'simtotal') return brl(simTotal);
      return answerLabel(id) || '—';
    }));
    return out
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\^(.+?)\^/g, '<span class="g">$1</span>')
      .replace(/\[(.+?)\]/g, '<span class="box">$1</span>')
      .replace(/\((.+?)\)/g, '<span class="mark">$1</span>');
  }

  function track(event, data) {
    try {
      if (window.fbq) window.fbq('trackCustom', event, data || {});
      if (window.gtag) window.gtag('event', event, data || {});
      if (window.dataLayer) window.dataLayer.push(Object.assign({ event: event }, data || {}));
    } catch (e) { /* tracking nunca quebra o funil */ }
  }

  function vibrate() {
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
  }

  /* ---------- ícones (traço) ---------- */

  function bars(n) {
    return [4, 8, 12, 16].map(function (h, i) {
      return '<rect x="' + (3 + i * 5) + '" y="' + (20 - h) + '" width="3" height="' + h + '" rx="1" fill="currentColor" stroke="none"' + (i < n ? '' : ' opacity=".22"') + '/>';
    }).join('');
  }

  var ICONS = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.4 4.6 5 5"/>',
    layers: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 13 12 18l9.5-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.3c-.4-.8-1.4-1.3-2.8-1.3-1.7 0-2.8.8-2.8 2s1.1 1.7 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.4 0-2.4-.5-2.8-1.3M12 6.5v1.5M12 16v1.5"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
    wallet: '<path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20H20a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H5.5"/><path d="M16.5 13.5h1"/>',
    trending: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    bars1: bars(1), bars2: bars(2), bars3: bars(3), bars4: bars(4),
    fileX: '<path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3v6h6"/><path d="M10 13l4 4M14 13l-4 4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.4"/><circle cx="12" cy="16.8" r=".6" fill="currentColor"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    unlock: '<rect x="4.5" y="11" width="15" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7"/><path d="M12 15v2"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
    zap: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    flame: '<path d="M12 21.5c-4 0-6.5-2.7-6.5-6.2 0-3.6 2.6-5.4 3.6-8.3.6 1.6 1.6 2.6 2.6 3 .3-3 1.8-5.2 3.4-6.5.3 3 3.4 5.4 3.4 10.3 0 4.6-2.8 7.7-6.5 7.7z"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lock: '<rect x="4.5" y="11" width="15" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5 21 7.5v9l-5.5-3"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M6 12.5l4 4 8-9"/>',
    x: '<path d="M7 7l10 10M17 7 7 17"/>'
  };

  function icon(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  var WA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

  function wordmark() {
    return '<div class="wordmark"><span class="wordmark__dot"></span>' + esc(C.brand) + '</div>';
  }

  /* ---------- blocos de conteúdo ---------- */

  var BLOCKS = {
    kicker: function (b) { return '<p class="kicker">' + rich(b.text) + '</p>'; },
    title: function (b) { return '<h2 class="title' + (b.size ? ' title--' + b.size : '') + '">' + rich(b.text) + '</h2>'; },
    lead: function (b) { return '<p class="lead">' + rich(b.text) + '</p>'; },
    p: function (b) { return '<p class="p">' + rich(b.text) + '</p>'; },
    big: function (b) { return '<p class="big">' + rich(b.text) + '</p>'; },
    divider: function () { return '<hr class="divider">'; },
    disclaimer: function (b) { return '<p class="disclaimer">' + rich(b.text) + '</p>'; },

    checks: function (b) {
      var v = b.variant || 'yes';
      return '<ul class="checks checks--' + v + '">' + b.items.map(function (it, i) {
        var o = typeof it === 'string' ? { text: it } : it;
        var ic = icon(o.icon || (v === 'no' ? 'x' : 'check'));
        return '<li style="--i:' + i + '"><span class="checks__ico">' + ic + '</span><span class="checks__t">' + rich(o.text) + '</span></li>';
      }).join('') + '</ul>';
    },

    group: function (b) {
      return '<div class="group' + (b.tone ? ' group--' + b.tone : '') + '">' +
        (b.label ? '<p class="group__label">' + rich(b.label) + '</p>' : '') +
        renderBlocks(b.blocks) + '</div>';
    },

    strip: function (b) {
      return '<div class="strip">' + b.items.map(function (o) {
        return '<div class="strip__item"><b>' + rich(o.value) + '</b><span>' + rich(o.label) + '</span></div>';
      }).join('') + '</div>';
    },

    steps: function (b) {
      return '<ol class="steps">' + b.items.map(function (t, i) {
        return '<li style="--i:' + i + '"><span class="steps__n">' + String(i + 1).padStart(2, '0') + '</span><span class="steps__t">' + rich(t) + '</span></li>';
      }).join('') + '</ol>';
    },

    quote: function (b) {
      return '<div class="chat">' +
        (b.pre ? '<p class="p">' + rich(b.pre) + '</p>' : '') +
        '<div class="chat__bubble">' +
          '<span class="chat__from">' + icon('briefcase') + esc(b.from) + '</span>' +
          '<span class="chat__typing" aria-hidden="true"><i></i><i></i><i></i></span>' +
          '<span class="chat__text">“' + rich(b.text) + '”</span>' +
        '</div></div>';
    },

    versus: function (b) {
      return '<div class="versus">' +
        '<div class="versus__card versus__card--from"><small>' + rich(b.pre || '') + '</small><span>' + rich(b.from) + '</span></div>' +
        '<span class="versus__arrow">' + icon('arrow') + '</span>' +
        '<div class="versus__card versus__card--to"><small>' + rich(b.mid || '') + '</small><span>' + rich(b.to) + '</span></div>' +
        '</div>';
    },

    features: function (b) {
      return '<ul class="features">' + b.items.map(function (f, i) {
        return '<li style="--i:' + i + '"><span class="tile">' + icon(f.icon) + '</span>' +
          '<b>' + rich(f.title) + '</b><small>' + rich(f.text) + '</small></li>';
      }).join('') + '</ul>';
    },

    stat: function (b) {
      return '<div class="stat">' +
        '<span class="stat__label">' + icon('phone') + rich(b.label) + '</span>' +
        (b.pre ? '<span class="stat__pre">' + rich(b.pre) + '</span>' : '') +
        '<span class="stat__value">' + esc(b.value) + '</span>' +
        '<span class="stat__unit">' + rich(b.unit) + '</span>' +
        (b.text ? '<p class="stat__text">' + rich(b.text) + '</p>' : '') +
        '</div>';
    },

    highlight: function (b) {
      return '<div class="highlight' + (b.solid ? ' highlight--solid' : '') + '">' +
        (b.icon ? '<span class="highlight__ico">' + icon(b.icon) + '</span>' : '') +
        '<span>' + rich(b.text) + '</span></div>';
    },

    tags: function (b) {
      return '<div class="tags' + (b.accent ? ' tags--accent' : '') + '">' + b.items.map(function (t) { return '<span class="tag">' + rich(t) + '</span>'; }).join('') + '</div>';
    },

    brand: function (b) {
      return '<div class="brandmark' + (b.size ? ' brandmark--' + b.size : '') + '"><span>Postou</span><span class="box">ganhou</span></div>';
    },

    art: function (b) {
      var badge = '<div class="badge' + (b.solid ? ' badge--solid' : '') + '"' + (b.celebrate ? ' data-celebrate' : '') + '>' +
        '<span class="badge__ring"></span>' + icon(b.icon) + '</div>';
      if (!b.achievement) return badge;
      return '<div class="achv">' + badge +
        '<span class="achv__label">' + icon('trophy') + esc(b.achievement) + '</span></div>';
    }
  };

  function renderBlocks(list) {
    return (list || []).map(function (b, i) {
      return '<div class="blk blk--' + b.t + '" style="--i:' + i + '">' + BLOCKS[b.t](b) + '</div>';
    }).join('');
  }

  function topbar(step) {
    var pos = progressSteps.indexOf(step) + 1;
    var pct = Math.round((pos / progressSteps.length) * 100);
    var qi = questionSteps.indexOf(step);
    var showBack = !step.noBack;
    return '<header class="qbar">' +
      (showBack
        ? '<button class="iconbtn" data-action="back" aria-label="Voltar">' + icon('back') + '</button>'
        : '<span class="iconbtn iconbtn--ghost"></span>') +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + lastPct + '%" data-to="' + pct + '"></span></div>' +
      '<span class="xp" aria-label="Simulador de potencial: ' + brl(sim) + ' por dia (simulação)">' +
        '<span class="xp__coin" aria-hidden="true">$</span>' +
        '<span class="xp__txt"><b class="xp__n">' + brl(sim) + '</b><small>simulação/dia</small></span></span>' +
      '</header>';
  }

  function stickyCta(label, attrs, note) {
    return '<div class="sticky-cta">' +
      '<button class="btn" ' + attrs + '>' + esc(label) + icon('arrow') + '</button>' +
      (note ? '<p class="note">' + rich(note) + '</p>' : '') + '</div>';
  }

  /* ---------- telas ---------- */

  function viewIntro(s) {
    var hl = s.headline.map(function (l, i) {
      var o = typeof l === 'string' ? { text: l } : l;
      return '<span class="hl__line' + (o.size ? ' hl__line--' + o.size : '') + '" style="--i:' + i + '">' + rich(o.text) + '</span>';
    }).join('');
    return '<section class="screen hero">' +
      '<header class="hero__top">' + wordmark() + '<span class="hero__time">' + icon('clock') + '1 min</span></header>' +
      '<div class="hero__stage">' +
        (s.kicker ? '<p class="hero__kicker">' + rich(s.kicker) + '</p>' : '') +
        '<h1 class="hl">' + hl +
          '<span class="coin coin--1" aria-hidden="true">$</span><span class="coin coin--2" aria-hidden="true">$</span><span class="coin coin--3" aria-hidden="true">$</span>' +
        '</h1>' +
      '</div>' +
      '<div class="content">' + renderBlocks(s.blocks) + '</div>' +
      stickyCta(s.cta, 'data-action="next"', s.ctaNote) +
    '</section>';
  }

  function viewQuestion(s) {
    var sel = answers[s.id];
    var opts = s.options.map(function (o, i) {
      var on = sel === i;
      return '<button class="opt' + (on ? ' is-on' : '') + '" data-action="pick" data-i="' + i + '" role="radio" aria-checked="' + on + '" style="--i:' + i + '">' +
        '<span class="tile">' + icon(o.icon) + '</span>' +
        '<span class="opt__label">' + esc(o.label) + '</span>' +
        '<span class="opt__check">' + icon('check') + '</span>' +
      '</button>';
    }).join('');
    var qi = questionSteps.indexOf(s);
    return '<section class="screen q' + (s.tone ? ' q--' + s.tone : '') + '">' + topbar(s) +
      '<div class="content">' +
        '<p class="phase">' + icon('flame') + 'Fase ' + (qi + 1) + ' de ' + questionSteps.length + (s.sim ? '<b>+' + brl(s.sim) + '/dia</b>' : '') + '</p>' +
        renderBlocks(s.blocks) +
        '<div class="opts' + (s.layout === 'grid' ? ' opts--grid' : '') + '" role="radiogroup">' + opts + '</div>' +
      '</div>' +
    '</section>';
  }

  function viewInfo(s) {
    return '<section class="screen info">' + topbar(s) +
      '<div class="content">' + renderBlocks(s.blocks) + '</div>' +
      stickyCta(s.cta, 'data-action="next"') +
    '</section>';
  }

  function viewLoading(s) {
    return '<section class="screen loading">' +
      '<header class="hero__top">' + wordmark() + '</header>' +
      '<div class="ld">' +
        '<div class="badge badge--spin">' + icon('zap') + '</div>' +
        '<h2 class="title">' + rich(s.title) + '</h2>' +
        '<div class="group">' +
          '<ul class="ld__list">' + s.items.map(function (t) {
            return '<li><span class="ld__tick">' + icon('check') + '</span><span>' + rich(t) + '</span></li>';
          }).join('') + '</ul>' +
          '<div class="ld__meter"><div class="ld__row"><span class="ld__wait">' + esc(s.wait || '') + '</span><b class="ld__pct">0%</b></div><div class="ld__bar"><span></span></div></div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function viewFinal(s) {
    return '<section class="screen info final">' + topbar(s) +
      '<div class="content">' + renderBlocks(s.blocks) + '</div>' +
      '<div class="sticky-cta">' +
        '<a class="btn btn--wa" data-action="whatsapp" href="' + esc(waLink()) + '" target="_blank" rel="noopener">' + WA + esc(s.cta) + '</a>' +
        (s.note ? '<p class="note">' + rich(s.note) + '</p>' : '') +
      '</div>' +
    '</section>';
  }

  function waLink() {
    return 'https://wa.me/' + String(C.whatsappNumber || '').replace(/\D/g, '') +
      '?text=' + encodeURIComponent(C.whatsappMessage || '');
  }

  var VIEWS = { intro: viewIntro, question: viewQuestion, info: viewInfo, loading: viewLoading, final: viewFinal };

  /* ---------- navegação ---------- */

  function render(i, dir, gain) {
    current = i;
    var s = steps[i];
    app.innerHTML = VIEWS[s.type](s);
    app.firstElementChild.classList.add(dir === 'back' ? 'enter-back' : 'enter');
    window.scrollTo(0, 0);
    busy = false;

    // barra de progresso anima a partir da posição anterior
    var bar = app.querySelector('.progress span[data-to]');
    if (bar) {
      requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.width = bar.getAttribute('data-to') + '%'; }); });
      lastPct = Number(bar.getAttribute('data-to'));
    }
    if (gain) bumpXp(gain);
    if (s.type === 'intro') countUpMoney();
    var cel = app.querySelector('[data-celebrate]');
    if (cel) setTimeout(function () { burstFrom(cel, 46); }, 350);
    if (s.type === 'loading') runLoading(s);
    track('QuizStep', { step: s.id, index: i });
  }

  /* ---------- efeitos ---------- */

  function countTo(el, from, to, dur, fmt) {
    fmt = fmt || String;
    if (reduceMotion) { el.textContent = fmt(to); return; }
    var t0 = null;
    function f(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  function bumpXp(gain) {
    var chip = app.querySelector('.xp');
    if (!chip) return;
    countTo(chip.querySelector('.xp__n'), sim - gain, sim, 900, brl);
    chip.classList.remove('is-bump'); void chip.offsetWidth; chip.classList.add('is-bump');
    var f = document.createElement('span');
    f.className = 'xp__float';
    f.textContent = '+' + brl(gain) + '/dia';
    chip.appendChild(f);
    setTimeout(function () { f.remove(); }, 1300);
  }

  function countUpMoney() {
    var el = app.querySelector('.hl__line--money .box');
    if (!el) return;
    var m = el.textContent.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) return;
    var target = Number(m[2].replace(/\./g, ''));
    el.style.minWidth = el.offsetWidth + 'px';
    el.textContent = m[1] + '0' + m[3];
    setTimeout(function () {
      countTo(el, 0, target, 1300, function (n) { return m[1] + n + m[3]; });
      setTimeout(function () { el.classList.add('is-done'); burstFrom(el, 30); }, reduceMotion ? 0 : 1350);
    }, 450);
  }

  var CONFETTI = ['#ff6a00', '#ff9f43', '#ffc078', '#ffd8a8', '#2b1a10'];
  function burstFrom(el, n) {
    if (reduceMotion || !el) return;
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    for (var i = 0; i < n; i++) {
      var c = document.createElement('i');
      var a = Math.random() * Math.PI * 2;
      var d = 50 + Math.random() * 110;
      c.className = 'confetti' + (i % 3 === 0 ? ' confetti--round' : '');
      c.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + CONFETTI[i % CONFETTI.length] +
        ';--dx:' + (Math.cos(a) * d).toFixed(1) + 'px;--dy:' + (Math.sin(a) * d - 70).toFixed(1) + 'px;--r:' + Math.round(Math.random() * 720 - 360) + 'deg';
      document.body.appendChild(c);
      setTimeout(function (node) { return function () { node.remove(); }; }(c), 1200);
    }
  }

  function goTo(i, opts) {
    opts = opts || {};
    try {
      if (opts.replace) history.replaceState({ step: i }, '');
      else history.pushState({ step: i }, '');
    } catch (e) {}
    render(i, opts.dir, opts.gain);
  }

  function award(step) {
    var v = step.sim || 0;
    if (!v || awarded[step.id]) return 0;
    awarded[step.id] = v;
    sim += v;
    return v;
  }

  function next() {
    if (busy || current >= steps.length - 1) return;
    busy = true;
    goTo(current + 1, { gain: award(steps[current]) });
  }

  window.addEventListener('popstate', function (e) {
    var i = e.state && typeof e.state.step === 'number' ? e.state.step : 0;
    // a tela de processamento nunca é revisitada
    if (steps[i] && steps[i].type === 'loading') i = Math.max(0, i - 1);
    render(i, 'back');
  });

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    if (action === 'next') {
      if (current === 0) track('QuizStart');
      next();
    } else if (action === 'back') {
      if (current > 0) history.back();
    } else if (action === 'pick') {
      pick(steps[current], Number(el.getAttribute('data-i')), el);
    } else if (action === 'whatsapp') {
      track('Lead', { rede: answerLabel('rede'), meta: answerLabel('meta') });
      sendAnswers();
    }
  });

  function pick(s, i, el) {
    if (busy) return;
    vibrate();
    answers[s.id] = i;
    app.querySelectorAll('.opt').forEach(function (o) {
      var on = o === el;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-checked', String(on));
    });
    el.classList.add('is-pop');
    burstFrom(el, 16);
    busy = true;
    var wait = s.feedback ? showToast(s) : 520;
    setTimeout(function () { busy = false; if (steps[current] === s) next(); }, wait);
  }

  // aviso rápido depois da resposta: substitui telas de retorno e avança sozinho
  function showToast(s) {
    var dur = reduceMotion ? 1600 : 2300;
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.style.setProperty('--dur', dur + 'ms');
    t.innerHTML = '<span class="toast__ico">' + icon('check') + '</span>' +
      '<span class="toast__body"><b>' + rich(s.feedback.title) + '</b><span>' + rich(s.feedback.text) + '</span></span>' +
      (s.sim ? '<span class="toast__xp">+' + brl(s.sim) + '/dia<small>no simulador</small></span>' : '') + '<i class="toast__timer"></i>';
    app.firstElementChild.appendChild(t);
    return dur;
  }

  function sendAnswers() {
    if (!C.webhookUrl) return;
    var payload = { respostas: {}, params: {}, data: new Date().toISOString() };
    questionSteps.forEach(function (s) { payload.respostas[s.id] = answerLabel(s.id); });
    try {
      new URLSearchParams(location.search).forEach(function (v, k) { payload.params[k] = v; });
      fetch(C.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  function runLoading(s) {
    var pct = app.querySelector('.ld__pct');
    var bar = app.querySelector('.ld__bar span');
    var items = app.querySelectorAll('.ld__list li');
    var dur = s.duration || 4000;
    var t0 = null;
    var stepIndex = current;
    var n = items.length;

    function frame(ts) {
      if (current !== stepIndex) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 1.8);
      var v = Math.round(eased * 100);
      pct.textContent = v + '%';
      bar.style.width = v + '%';
      items.forEach(function (li, i) {
        li.classList.toggle('is-active', eased >= i / (n + 0.3));
        li.classList.toggle('is-done', eased >= (i + 1) / (n + 0.3));
      });
      if (p < 1) requestAnimationFrame(frame);
      else setTimeout(function () {
        if (current === stepIndex) goTo(stepIndex + 1, { replace: true });
      }, 500);
    }
    requestAnimationFrame(frame);
  }

  try { history.replaceState({ step: 0 }, ''); } catch (e) {}
  render(0);
})();
