/* Andaluz v2: movimento com GSAP + ScrollTrigger + SplitText, rolagem suave com Lenis.
   Um so arquivo para todas as paginas: cada bloco so roda se o elemento existir.
   Respeita prefers-reduced-motion: sem rolagem suave, sem animacao, sem cortina. */
(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]sem-movimento/.test(location.search);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var tem = function (s) { return !!$(s); };
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  var cortina = $('.cortina');
  if (cortina) cortina.style.animation = 'none';

  /* ---------- nav: fundo ao rolar, some ao descer, volta ao subir ---------- */
  var nav = $('#nav'), ultimo = 0;
  function navRolagem(y) {
    nav.classList.toggle('solido', y > 40);
    if (document.body.classList.contains('travado')) return;
    if (y > 240 && y > ultimo + 4) nav.classList.add('some');
    else if (y < ultimo - 4 || y < 240) nav.classList.remove('some');
    ultimo = y;
  }

  /* ---------- menu do celular ---------- */
  var bm = $('.nav-menu'), mm = $('#menu-movel');
  function abreMenu(abrir) {
    bm.setAttribute('aria-expanded', String(abrir));
    document.body.classList.toggle('travado', abrir);
    if (abrir) {
      mm.hidden = false; nav.classList.remove('some');
      if (window.lenis) window.lenis.stop();
      if (window.gsap && !reduz) gsap.from($$('nav a, .pill, p', mm), { y: 40, opacity: 0, duration: .7, stagger: .05, ease: 'expo.out' });
    } else {
      mm.hidden = true;
      if (window.lenis) window.lenis.start();
    }
  }
  if (bm) {
    bm.addEventListener('click', function () { abreMenu(bm.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mm.hidden) abreMenu(false); });
  }

  /* ---------- cortina entre paginas ---------- */
  function linkInterno(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!/\.html(#.*)?$/.test(href)) return false;
    var u = new URL(a.href, location.href);
    return u.origin === location.origin && u.pathname !== location.pathname;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!linkInterno(a) || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (reduz || !window.gsap || !cortina) return;
    e.preventDefault();
    try { sessionStorage.setItem('cortina', '1'); } catch (er) {}
    gsap.fromTo(cortina, { yPercent: 101 }, { yPercent: 0, duration: .6, ease: 'expo.inOut', onComplete: function () { location.href = a.href; } });
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted && cortina) { cortina.classList.add('fora'); if (window.gsap) gsap.set(cortina, { yPercent: -101 }); } });

  /* ---------- gergelim e zaatar flutuando no hero ---------- */
  function gergelim() {
    var cv = $('.gergelim'); if (!cv) return;
    var ctx = cv.getContext('2d'), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), ps = [], ativo = true;
    var cores = ['rgba(247,235,211,.75)', 'rgba(205,184,148,.6)', 'rgba(240,180,76,.7)', 'rgba(120,140,70,.55)'];
    function tam() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function novo(inicio) { return { x: Math.random() * W, y: inicio ? Math.random() * H : H + 20, r: 1.6 + Math.random() * 1.8, vy: .15 + Math.random() * .35, fase: Math.random() * 6.28, giro: Math.random() * 6.28, vg: (Math.random() - .5) * .02, c: cores[(Math.random() * cores.length) | 0] }; }
    tam(); var n = W < 700 ? 34 : 70; for (var i = 0; i < n; i++) ps.push(novo(true));
    function quadro() {
      if (!ativo) return;
      if (window.__gergelimPausa) { requestAnimationFrame(quadro); return; }
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i]; p.y -= p.vy; p.fase += .01; p.giro += p.vg; var x = p.x + Math.sin(p.fase) * 12;
        if (p.y < -20) ps[i] = novo(false);
        ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.giro); ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 2.2, 0, 0, 6.283); ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(quadro);
    }
    window.addEventListener('resize', tam);
    new IntersectionObserver(function (e) { var v = e[0].isIntersecting; if (v && !ativo) { ativo = true; requestAnimationFrame(quadro); } ativo = v; }).observe(cv);
    requestAnimationFrame(quadro);
  }

  /* ---------- horarios ao vivo (Visite) ---------- */
  function horarios() {
    var dias = $('#dias'), st = $$('.status');
    if (!dias && !st.length) return;
    var salao = { 0: [11, 15], 2: [11, 15], 3: [11, 15], 4: [11, 15], 5: [11, 15], 6: [11, 15] };
    var deli = { 0: [11, 15], 3: [11, 21.5], 4: [11, 21.5], 5: [11, 21.5], 6: [11, 21.5] };
    var curto = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], longo = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    var A = (function () { try { var o = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; }); return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), h: (+o.hour % 24) + (+o.minute) / 60 }; } catch (e) { var n = new Date(); return { d: n.getDay(), h: n.getHours() + n.getMinutes() / 60 }; } })();
    var ini = 10, fim = 22;
    function pos(h) { return ((h - ini) / (fim - ini) * 100).toFixed(2) + '%'; }
    function fmt(h) { var hh = Math.floor(h), mm = Math.round((h - hh) * 60); return hh + 'h' + (mm ? String(mm).padStart(2, '0') : ''); }
    if (dias) dias.innerHTML = [2, 3, 4, 5, 6, 0, 1].map(function (d) {
      var s = salao[d], e = deli[d], hoje = d === A.d, t = '';
      if (!s && !e) t = '<span class="fechado">Fechado</span>';
      if (s) t += '<span class="b s" style="left:' + pos(s[0]) + ';width:calc(' + pos(s[1]) + ' - ' + pos(s[0]) + ')"></span>';
      if (e) t += '<span class="b d" style="left:' + pos(e[0]) + ';width:calc(' + pos(e[1]) + ' - ' + pos(e[0]) + ')"></span>';
      if (hoje && A.h >= ini && A.h <= fim) t += '<span class="agora" style="left:' + pos(A.h) + '"></span>';
      var desc = (s ? 'salão ' + fmt(s[0]) + ' às ' + fmt(s[1]) : 'salão fechado') + (e ? ', iFood ' + fmt(e[0]) + ' às ' + fmt(e[1]) : '');
      return '<div class="dia' + (hoje ? ' hoje' : '') + '"><span class="nome">' + curto[d] + '</span><div class="trilho-h" role="img" aria-label="' + longo[d] + ': ' + desc + '">' + t + '</div></div>';
    }).join('');
    var sh = salao[A.d], dh = deli[A.d], txt, aberto = false;
    if (sh && A.h >= sh[0] && A.h < sh[1]) { aberto = true; txt = '<b>Salão aberto agora</b>, até as ' + fmt(sh[1]); }
    else if (dh && A.h >= dh[0] && A.h < dh[1]) { aberto = true; txt = '<b>Delivery aberto no iFood</b>, até as ' + fmt(dh[1]); }
    else if (sh && A.h < sh[0]) { txt = '<b>Abrimos hoje às ' + fmt(sh[0]) + '</b>, salão até as ' + fmt(sh[1]); }
    else { var p = A.d, c = 0; do { p = (p + 1) % 7; c++; } while (!salao[p] && c < 8); txt = '<b>Fechado agora.</b> Voltamos ' + (c === 1 ? 'amanhã' : longo[p]) + ' às ' + fmt(salao[p][0]); }
    st.forEach(function (s) { if (aberto) s.classList.add('aberto'); var t = $('.status-texto', s); if (t) t.innerHTML = txt; });
    var bt = $('#copiar');
    if (bt) bt.addEventListener('click', function () {
      function ok() { bt.textContent = 'Número copiado'; setTimeout(function () { bt.textContent = 'Copiar número'; }, 2000); }
      function sel() { var r = document.createRange(); r.selectNodeContents($('#fone')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); bt.textContent = 'Selecionado'; }
      try { navigator.clipboard.writeText('11988937499').then(ok, sel); } catch (e) { sel(); }
    });
  }

  /* ---------- marquee: duplica a trilha ---------- */
  $$('.faixa').forEach(function (f) { var t = $('.trilha', f); for (var i = 0; i < 2; i++) { var c = t.cloneNode(true); f.appendChild(c); } });

  /* ---------- mascara por linha ---------- */
  function mascaraLinhas(sel) {
    $$(sel).forEach(function (l) {
      if (l.querySelector('.linha-in')) return;
      l.innerHTML = '<span class="linha-in" style="display:inline-block">' + l.innerHTML + '</span>';
      l.style.overflow = 'hidden'; l.style.display = 'block'; l.style.paddingBottom = '.08em'; l.style.marginBottom = '-.08em';
    });
  }

  horarios();
  if (reduz || !window.gsap) {
    if (cortina) cortina.classList.add('fora');
    window.addEventListener('scroll', function () { navRolagem(window.scrollY); }, { passive: true });
    return;
  }
  gergelim();
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  /* ---------- Lenis ---------- */
  var lenis = window.lenis = new Lenis({ lerp: 0.1 });
  var faixasTw = [], escala = 1, loops = [];
  lenis.on('scroll', function (e) {
    ScrollTrigger.update(); navRolagem(e.scroll);
    if (!faixasTw.length || document.body.classList.contains('pausado')) return;
    var alvo = Math.round((1 + Math.min(Math.abs(e.velocity) / 6, 5)) * (e.direction < 0 ? -1 : 1) * 10) / 10;
    if (alvo === escala) return; escala = alvo;
    faixasTw.forEach(function (tw) { gsap.to(tw, { timeScale: alvo, duration: .6, overwrite: true }); });
  });
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var alvo = $(id); if (!alvo) return; ev.preventDefault();
      lenis.scrollTo(alvo, { offset: -90, duration: 1.4 });
    });
  });

  /* pausar animacoes continuas */
  var pb = $('#pausa');
  if (pb) pb.addEventListener('click', function () {
    var p = document.body.classList.toggle('pausado');
    pb.setAttribute('aria-pressed', String(p)); pb.textContent = p ? 'Retomar animações' : 'Pausar animações';
    faixasTw.concat(loops).forEach(function (tw) { p ? tw.pause() : tw.resume(); });
    window.__gergelimPausa = p;
  });

  $$('.faixa').forEach(function (f, i) {
    var ts = $$('.trilha', f);
    faixasTw.push(i === 0
      ? gsap.to(ts, { xPercent: -100, duration: 26, ease: 'none', repeat: -1 })
      : gsap.fromTo(ts, { xPercent: -100 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 }));
  });

  function iniciar() {
    mascaraLinhas('.hero-h1 .linha, .titulo-mask .linha, .final-h .linha');

    /* ---------- entrada da pagina: cortina sobe e o topo entra ---------- */
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    var chegando = document.documentElement.classList.contains('chegando');
    if (cortina && chegando) tl.to(cortina, { yPercent: -101, duration: .7, ease: 'expo.inOut' }, 0);
    var t0 = chegando ? .35 : 0;
    tl.from(nav, { autoAlpha: 0, duration: .8, ease: 'power2.out', clearProps: 'opacity,visibility' }, .4);
    if (tem('.hero')) {
      tl.from('.hero-h1 .linha-in', { yPercent: 105, duration: .6, stagger: .06 }, t0)
        .from('.hero-lede', { opacity: 0, y: 20, duration: .6 }, t0 + .2)
        .from('.hero-acoes > *', { opacity: 0, y: 20, duration: .6, stagger: .06 }, t0 + .3)
        .from('.prato', { scale: .92, rotation: -40, duration: .8 }, t0)
        .from('.ad-premio, .selo-giro, .ad-homus', { scale: .5, opacity: 0, duration: .7, stagger: .1, ease: 'back.out(1.8)' }, t0 + .5);
      loops.push(gsap.to('.hero .prato img', { rotation: 360, duration: 90, ease: 'none', repeat: -1 }));
      gsap.to('.hero-prato', { yPercent: 18, rotation: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-txt', { yPercent: -10, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });
    }
    if (tem('.cab-pag')) {
      tl.from('.cab-ar', { opacity: 0, y: 16, duration: .5 }, t0)
        .from('.cab-h .linha-in', { yPercent: 105, duration: .6, stagger: .06 }, t0)
        .from('.cab-lede, .cab-pag-txt .chips, .cab-pag-txt .hero-acoes, .cab-pag-txt .status', { opacity: 0, y: 20, duration: .6, stagger: .06 }, t0 + .2)
        .from('.cab-pag-visual > *:first-child', { scale: .92, rotation: -8, duration: .8 }, t0)
        .from('.ad-cab', { scale: .5, opacity: 0, rotation: -25, duration: .7, ease: 'back.out(1.8)' }, t0 + .45);
      if (tem('.prato-cab')) loops.push(gsap.to('.prato-cab img', { rotation: 360, duration: 90, ease: 'none', repeat: -1 }));
      gsap.to('.cab-pag-visual', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.cab-pag', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* ---------- titulos com mascara ao entrar (fora do topo) ---------- */
    $$('.titulo-mask, .final-h').forEach(function (h) {
      if (h.closest('.cab-pag') || h.closest('.hero')) return;
      gsap.from($$('.linha-in', h), { yPercent: 115, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 82%' } });
    });

    /* ---------- portas ---------- */
    if (tem('.portas-grade')) {
      gsap.from('.porta', { y: 90, rotation: function (i) { return [-4, 3, -2][i] || 0; }, opacity: 0, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.portas-grade', start: 'top 82%' } });
      gsap.from('.porta-seta', { scale: 0, rotation: -90, duration: .8, stagger: .12, delay: .4, ease: 'back.out(2)', scrollTrigger: { trigger: '.portas-grade', start: 'top 82%' } });
    }

    /* ---------- frases que acendem com a rolagem ---------- */
    $$('.prova-h, .manifesto-txt').forEach(function (h) {
      if (!window.SplitText) return;
      var sp = new SplitText(h, { type: 'words' });
      gsap.fromTo(sp.words, { opacity: .14 }, { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: h, start: 'top 80%', end: 'bottom 50%', scrub: true } });
    });

    /* ---------- premios e aspas ---------- */
    if (tem('.anos')) gsap.from('.anos li', { y: 30, opacity: 0, rotation: function (i) { return i % 2 ? 6 : -6; }, duration: .8, stagger: .07, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.anos', start: 'top 88%' } });
    if (tem('.prova')) {
      gsap.fromTo('.prova-foto', { yPercent: 10, rotation: 8 }, { yPercent: -6, rotation: 2, ease: 'none', scrollTrigger: { trigger: '.prova', start: 'top bottom', end: 'bottom top', scrub: true } });
      if (tem('.print-ig')) gsap.from('.print-ig', { y: 80, x: -40, rotation: -16, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.prova-visual', start: 'top 70%' } });
    }

    /* ---------- fotos da historia ---------- */
    $$('.ff').forEach(function (f, i) {
      gsap.fromTo(f, { y: 80 + i * 30, rotation: [-5, 4, -3][i] }, { y: -20 * i, rotation: 0, ease: 'none', scrollTrigger: { trigger: '.manifesto-fotos', start: 'top bottom', end: 'bottom 40%', scrub: true } });
    });

    /* ---------- cardapio: vitrine horizontal fixada (desktop) e categorias ---------- */
    if (tem('#trilho')) {
      gsap.matchMedia().add('(min-width: 768px)', function () {
        var trilho = $('#trilho');
        var dist = function () { return Math.max(0, trilho.scrollWidth - window.innerWidth); };
        var horiz = gsap.to(trilho, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.pratos', pin: '.pratos-pin', start: 'top top', end: function () { return '+=' + dist(); }, scrub: 1, invalidateOnRefresh: true } });
        $$('.card', trilho).forEach(function (c, i) {
          gsap.from($('img', c), { scale: 1.25, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: horiz, start: 'left right', end: 'center center', scrub: true } });
          gsap.from(c, { y: i % 2 ? 80 : -60, rotation: i % 2 ? 6 : -6, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: horiz, start: 'left right', end: 'left 60%', scrub: true } });
        });
      });
    }
    $$('.cat').forEach(function (c) {
      gsap.from(c, { y: 70, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
      gsap.from($$('li', c), { x: -20, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 75%' } });
    });

    /* ---------- noite arabe ---------- */
    if (tem('.sublinha')) gsap.from('.sublinha path', { strokeDashoffset: 320, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: '.sublinha', start: 'top 75%' } });
    if (tem('.nc')) gsap.from('.nc', { y: 70, rotation: function (i) { return [-6, 4, -3][i]; }, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.noite-cards', start: 'top 88%' } });
    if (tem('.chips-menu')) gsap.from('.chips-menu li', { scale: .6, opacity: 0, rotation: function () { return gsap.utils.random(-12, 12); }, duration: .7, stagger: .04, ease: 'back.out(2)', scrollTrigger: { trigger: '.chips-menu', start: 'top 85%' } });
    $$('.g').forEach(function (g, i) {
      gsap.fromTo(g, { y: 60 + i * 20 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.galeria-grade', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---------- visite ---------- */
    if (tem('.bloco')) gsap.from('.bloco', { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.info-grade', start: 'top 85%' } });
    if (tem('.trilho-h .b')) gsap.from('.trilho-h .b', { scaleX: 0, duration: .9, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.dias', start: 'top 85%' } });

    /* ---------- passos: caminho se desenha ---------- */
    if (tem('.passos-grade')) {
      var tampa = document.createElement('div'); tampa.className = 'tampa'; $('.passos-grade').insertBefore(tampa, $('.passos-grade .passo'));
      gsap.fromTo(tampa, { scaleX: 1 }, { scaleX: 0, ease: 'none', scrollTrigger: { trigger: '.passos-grade', start: 'top 80%', end: 'bottom 60%', scrub: true } });
      $$('.passo').forEach(function (p, i) {
        gsap.from($('.bola', p), { scale: .4, opacity: 0, duration: .7, ease: 'back.out(2)', scrollTrigger: { trigger: '.passos-grade', start: 'top ' + (80 - i * 10) + '%' } });
        gsap.from([$('h3', p), $('p', p)], { opacity: 0, y: 24, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.passos-grade', start: 'top ' + (78 - i * 10) + '%' } });
      });
    }

    /* ---------- chamadas finais ---------- */
    if (tem('.final')) {
      gsap.fromTo('.voa-1', { xPercent: -120, rotation: -200 }, { xPercent: 0, rotation: 0, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'center center', scrub: 1 } });
      gsap.fromTo('.voa-2', { xPercent: 120, rotation: 200 }, { xPercent: 0, rotation: 0, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'center center', scrub: 1 } });
      gsap.from('.final-acoes > *', { opacity: 0, y: 30, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.final-acoes', start: 'top 90%' } });
    }
    $$('.faixa-cta').forEach(function (f) {
      gsap.from(f.children, { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 85%' } });
    });

    ScrollTrigger.refresh();
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(iniciar); else window.addEventListener('load', iniciar);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
