(function () {
  'use strict';

  var C = window.QUIZ_CONFIG;
  var app = document.getElementById('app');
  var steps = C.steps;
  var answers = {};
  var current = 0;
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

  // {id} → resposta; *x* → destaque; [x] → caixa; (x) → círculo
  function rich(str) {
    var out = esc(String(str || '').replace(/\{([\w-]+)\}/g, function (_, id) { return answerLabel(id) || '—'; }));
    return out
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]/g, '<span class="box">$1</span>')
      .replace(/\((.+?)\)/g, '<span class="ring">$1' + DD.ring + '</span>');
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

  /* ---------- peças visuais ---------- */

  var SHAPES = {
    asterisk:
      '<rect x="37" y="0" width="26" height="100" rx="4"/>' +
      '<rect x="37" y="0" width="26" height="100" rx="4" transform="rotate(60 50 50)"/>' +
      '<rect x="37" y="0" width="26" height="100" rx="4" transform="rotate(120 50 50)"/>',
    eight: '<ellipse cx="50" cy="29" rx="44" ry="29"/><ellipse cx="50" cy="71" rx="44" ry="29"/>',
    arch: '<path d="M8 100V46a42 42 0 0 1 84 0v54z"/>',
    clover:
      '<circle cx="50" cy="27" r="27"/><circle cx="27" cy="50" r="27"/>' +
      '<circle cx="73" cy="50" r="27"/><circle cx="50" cy="73" r="27"/><circle cx="50" cy="50" r="30"/>',
    circle: '<circle cx="50" cy="50" r="50"/>'
  };

  function face(f) {
    return /\.(png|jpe?g|webp|gif|svg)$/i.test(f)
      ? '<img class="blob__img" src="' + esc(f) + '" alt="">'
      : '<span class="blob__face">' + f + '</span>';
  }

  function blob(shape, fill, f, cls) {
    return '<div class="blob ' + (cls || '') + '" aria-hidden="true">' +
      '<svg viewBox="0 0 100 100" fill="' + fill + '">' + SHAPES[shape] + '</svg>' + face(f) + '</div>';
  }

  function av(i) { return (C.avatars || [])[i] || '🙂'; }

  function wordmark() {
    return '<div class="wordmark"><span class="wordmark__dot"></span>' + esc(C.brand) + '</div>';
  }

  var DD = {
    spark: '<svg class="dd dd--spark" viewBox="0 0 60 60" aria-hidden="true"><path d="M12 16 46 44M44 14 16 46" stroke="var(--blue-300)" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="52" cy="7" r="5" fill="none" stroke="var(--blue-300)" stroke-width="3"/></svg>',
    plane: '<svg class="dd dd--plane" viewBox="0 0 80 70" aria-hidden="true"><path d="M6 26 58 6 44 44 34 32Z M34 32 58 6" fill="#fff" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/><path d="M40 48c-2 10-10 16-24 18" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="3 4" stroke-linecap="round"/></svg>',
    phone: '<svg class="dd dd--phone" viewBox="0 0 60 90" aria-hidden="true"><rect x="8" y="4" width="44" height="82" rx="9" fill="#fff" stroke="var(--ink)" stroke-width="1.6"/><path d="M24 11h12" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/><path d="M30 57c-11-8-12-19-5-21 3-1 5 2 5 4 0-2 2-5 5-4 7 2 6 13-5 21z" fill="var(--blue)"/><path d="M18 74h24" stroke="var(--blue-200)" stroke-width="3" stroke-linecap="round"/></svg>',
    ring: '<svg class="ring__svg" viewBox="0 0 120 80" preserveAspectRatio="none" aria-hidden="true"><path d="M98 16C78 0 20 4 9 34c-9 28 52 46 92 30 21-9 17-38-11-50" fill="none" stroke="var(--blue)" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="1"/></svg>',
    arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    wa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  function dots(list) {
    return list.map(function (d) {
      return '<i class="dot" style="top:' + d[0] + ';left:' + d[1] + ';--d:' + d[2] + 'px;background:' + d[3] + ';animation-delay:' + (d[4] || 0) + 's"></i>';
    }).join('');
  }

  /* ---------- blocos de conteúdo ---------- */

  var BLOCKS = {
    kicker: function (b) { return '<p class="kicker">' + rich(b.text) + '</p>'; },
    title: function (b) { return '<h2 class="title' + (b.size ? ' title--' + b.size : '') + '">' + rich(b.text) + '</h2>'; },
    lead: function (b) { return '<p class="lead">' + rich(b.text) + '</p>'; },
    p: function (b) { return '<p class="p' + (b.center ? ' is-center' : '') + '">' + rich(b.text) + '</p>'; },
    big: function (b) { return '<p class="big' + (b.center ? ' is-center' : '') + '">' + rich(b.text) + '</p>'; },
    divider: function () { return '<hr class="divider">'; },

    money: function (b) {
      return '<div class="money"><div class="money__ticket">' +
        '<span class="money__pre">' + esc(b.pre) + '</span>' +
        '<span class="money__val">' + esc(b.value) + '</span>' +
        '<span class="money__suf">' + esc(b.suffix) + '</span>' +
        '</div>' + DD.spark + '</div>';
    },

    checks: function (b) {
      var v = b.variant || 'yes';
      var icon = v === 'no' ? DD.x : DD.check;
      return '<ul class="checks checks--' + v + '">' + b.items.map(function (t, i) {
        return '<li style="--i:' + i + '"><span class="checks__ico">' + icon + '</span><span>' + rich(t) + '</span></li>';
      }).join('') + '</ul>';
    },

    steps: function (b) {
      return '<ol class="steps">' + b.items.map(function (t, i) {
        return '<li style="--i:' + i + '"><span class="steps__n">' + (i + 1) + '</span><span>' + rich(t) + '</span></li>';
      }).join('') + '</ol>';
    },

    quote: function (b) {
      return '<div class="chat">' +
        (b.pre ? '<p class="chat__pre">' + rich(b.pre) + '</p>' : '') +
        '<div class="chat__row">' +
          '<span class="chat__av">' + blob('circle', 'var(--blue)', '🏷️') + '</span>' +
          '<div class="chat__bubble"><small>' + esc(b.from) + '</small>' +
            '<span class="chat__typing" aria-hidden="true"><i></i><i></i><i></i></span>' +
            '<span class="chat__text">' + rich(b.text) + '</span>' +
          '</div>' +
        '</div></div>';
    },

    versus: function (b) {
      return '<div class="versus">' +
        (b.pre ? '<p class="versus__label">' + rich(b.pre) + '</p>' : '') +
        '<div class="versus__card versus__card--from">' + rich(b.from) + '</div>' +
        '<div class="versus__mid">' + DD.down + (b.mid ? '<span>' + rich(b.mid) + '</span>' : '') + '</div>' +
        '<div class="versus__card versus__card--to">' + rich(b.to) + DD.spark + '</div>' +
        '</div>';
    },

    features: function (b) {
      return '<ul class="features">' + b.items.map(function (f, i) {
        return '<li style="--i:' + i + '"><span class="tile">' + f.icon + '</span>' +
          '<span><b>' + rich(f.title) + '</b><small>' + rich(f.text) + '</small></span></li>';
      }).join('') + '</ul>';
    },

    stat: function (b) {
      return '<div class="stat">' +
        '<span class="stat__label">📱 ' + rich(b.label) + '</span>' +
        (b.pre ? '<span class="stat__pre">' + rich(b.pre) + '</span>' : '') +
        '<span class="stat__value">' + esc(b.value) + '</span>' +
        '<span class="stat__unit">' + rich(b.unit) + '</span>' +
        (b.text ? '<p class="stat__text">' + rich(b.text) + '</p>' : '') +
        dots([['9%', '90%', 10, 'var(--blue-300)'], ['22%', '80%', 6, '#fff', 1]]) +
        '</div>';
    },

    highlight: function (b) { return '<div class="highlight">' + rich(b.text) + '</div>'; },

    tags: function (b) {
      return '<div class="tags">' + b.items.map(function (t) { return '<span class="tag">' + rich(t) + '</span>'; }).join('') + '</div>';
    },

    brand: function () {
      return '<div class="brandmark"><span class="brandmark__a">Postou</span><span class="box">ganhou</span></div>';
    },

    art: function (b) {
      if (b.kind === 'avatars') {
        return '<div class="art art--group">' +
          dots([['10%', '10%', 8, 'var(--blue-300)'], ['78%', '88%', 10, 'var(--blue)', 1], ['18%', '90%', 6, 'var(--blue)', 2]]) +
          blob('arch', 'var(--blue-100)', av(2), 'art__av art__av--1') +
          blob('asterisk', 'var(--blue)', av(0), 'art__av art__av--2') +
          blob('eight', 'var(--blue-200)', av(1), 'art__av art__av--3') +
          DD.plane + '</div>';
      }
      return '<div class="art' + (b.confetti ? ' art--confetti' : '') + '">' +
        dots([['8%', '22%', 9, 'var(--blue-300)'], ['70%', '16%', 7, 'var(--blue)', 1], ['16%', '76%', 8, 'var(--blue)', 2], ['78%', '80%', 11, 'var(--blue-200)', .6]]) +
        blob(b.shape || 'circle', b.fill || 'var(--blue)', b.emoji, 'art__main') + DD.spark + '</div>';
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
        ? '<button class="iconbtn" data-action="back" aria-label="Voltar">' + DD.back + '</button>'
        : '<span class="iconbtn iconbtn--ghost"></span>') +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
      '<span class="qbar__count">' + (qi !== -1 ? (qi + 1) + '/' + questionSteps.length : '') + '</span>' +
      '</header>';
  }

  function stickyCta(label, attrs, extraCls, note, icon) {
    return '<div class="sticky-cta">' +
      '<button class="btn ' + (extraCls || '') + '" ' + attrs + '>' + esc(label) + (icon || DD.arrow) + '</button>' +
      (note ? '<p class="note">' + rich(note) + '</p>' : '') + '</div>';
  }

  /* ---------- telas ---------- */

  function viewIntro(s) {
    var hl = s.headline.map(function (l, i) {
      return '<span class="hl__line" style="--i:' + i + '">' + rich(l) + '</span>';
    }).join('');
    return '<section class="screen hero">' +
      '<header class="hero__top">' + wordmark() + '</header>' +
      '<div class="hero__stage">' +
        dots([['4%', '46%', 9, 'var(--blue-300)'], ['46%', '1%', 8, 'var(--blue)', 1], ['56%', '95%', 7, 'var(--blue-300)', 2], ['92%', '28%', 6, 'var(--blue)', .5], ['88%', '70%', 10, 'var(--blue-200)', 1.5]]) +
        blob('asterisk', 'var(--blue)', av(0), 'hero__av hero__av--1') +
        blob('eight', 'var(--blue-200)', av(1), 'hero__av hero__av--2') +
        blob('arch', 'var(--blue-100)', av(2), 'hero__av hero__av--3') +
        blob('clover', 'var(--blue-300)', av(3), 'hero__av hero__av--4') +
        '<h1 class="hl">' + hl + DD.spark + DD.plane + '</h1>' +
        DD.phone +
      '</div>' +
      '<div class="content">' + renderBlocks(s.blocks) + '</div>' +
      stickyCta(s.cta, 'data-action="next"', 'btn--pill') +
    '</section>';
  }

  function viewQuestion(s) {
    var sel = answers[s.id];
    var opts = s.options.map(function (o, i) {
      var on = sel === i;
      return '<button class="opt' + (on ? ' is-on' : '') + '" data-action="pick" data-i="' + i + '" role="radio" aria-checked="' + on + '" style="--i:' + i + '">' +
        '<span class="tile">' + o.icon + '</span>' +
        '<span class="opt__label">' + esc(o.label) + '</span>' +
        '<span class="opt__check">' + DD.check + '</span>' +
      '</button>';
    }).join('');
    return '<section class="screen q">' + topbar(s) +
      '<div class="content">' + renderBlocks(s.blocks) +
        '<div class="opts' + (s.layout === 'grid' ? ' opts--grid' : '') + '" role="radiogroup">' + opts + '</div>' +
      '</div>' +
      '<div class="q__deco" aria-hidden="true">' + blob('arch', 'var(--blue-100)', av(2), 'q__av--1') + DD.spark + blob('asterisk', 'var(--blue-200)', av(3), 'q__av--2') + '</div>' +
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
        '<div class="ld__art">' +
          dots([['6%', '14%', 9, 'var(--blue-300)'], ['76%', '6%', 7, 'var(--blue)', 1], ['12%', '86%', 8, 'var(--blue)', 2]]) +
          blob('clover', 'var(--blue-100)', '⚙️', 'ld__blob') +
        '</div>' +
        '<h2 class="title title--center">' + rich(s.title) + '</h2>' +
        '<ul class="ld__list">' + s.items.map(function (t) {
          return '<li><span class="ld__tick">' + DD.check + '</span><span>' + rich(t) + '</span></li>';
        }).join('') + '</ul>' +
        '<div class="ld__bar"><span></span></div>' +
        '<div class="ld__foot"><span>' + esc(s.wait || '') + '</span><b class="ld__pct">0%</b></div>' +
      '</div>' +
    '</section>';
  }

  function viewFinal(s) {
    return '<section class="screen info final">' + topbar(s) +
      '<div class="content">' +
        '<div class="blk" style="--i:0">' + BLOCKS.art({ shape: 'asterisk', emoji: '🚀', fill: 'var(--blue)', confetti: true }) + '</div>' +
        renderBlocks(s.blocks) +
      '</div>' +
      '<div class="sticky-cta">' +
        '<a class="btn btn--wa btn--pulse" data-action="whatsapp" href="' + esc(waLink()) + '" target="_blank" rel="noopener">' + DD.wa + esc(s.cta) + '</a>' +
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

  function render(i, dir) {
    current = i;
    var s = steps[i];
    app.innerHTML = VIEWS[s.type](s);
    app.firstElementChild.classList.add(dir === 'back' ? 'enter-back' : 'enter');
    window.scrollTo(0, 0);
    busy = false;
    if (s.type === 'loading') runLoading(s);
    track('QuizStep', { step: s.id, index: i });
  }

  function goTo(i, opts) {
    opts = opts || {};
    try {
      if (opts.replace) history.replaceState({ step: i }, '');
      else history.pushState({ step: i }, '');
    } catch (e) {}
    render(i, opts.dir);
  }

  function next() {
    if (busy || current >= steps.length - 1) return;
    busy = true;
    goTo(current + 1);
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
    busy = true;
    setTimeout(function () { busy = false; next(); }, 320);
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
