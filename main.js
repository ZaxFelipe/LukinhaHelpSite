// "Salvar na agenda": baixa um cartão de contato (.vcf) da Lukinha Help.
document.querySelectorAll('[data-save-contact]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Lukinha Help',
      'ORG:Lukinha Help',
      'TITLE:Eletricista Profissional',
      'TEL;TYPE=CELL:+5519998643597',
      'URL:https://instagram.com/lukinha.help',
      'END:VCARD',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }));
    a.download = 'Lukinha-Help.vcf';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);

    const label = btn.textContent;
    btn.textContent = 'Contato baixado';
    setTimeout(() => { btn.textContent = label; }, 2200);
  });
});

// Camada de movimento. Sem GSAP, ou com movimento reduzido, a página aparece inteira e parada.
(function motion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const ease = 'expo.out';

  // As marcas "+" chegam de fora e se encaixam nos cantos, como um desenho sendo registrado.
  const register = (frame, delay = 0) => {
    const c = frame.querySelectorAll(':scope > .corner');
    if (!c.length) return null;
    return gsap.from(c, {
      x: (i) => (i % 2 ? 14 : -14),
      y: (i) => (i < 2 ? -14 : 14),
      opacity: 0,
      duration: .8,
      ease,
      delay,
      // a transição de hover do CSS brigaria com a animação; desliga durante o encaixe
      onStart: () => gsap.set(c, { transition: 'none' }),
      clearProps: 'transform,opacity,transition',
    });
  };

  // Entrada do primeiro ecrã.
  const intro = gsap.timeline({ defaults: { ease } });
  intro
    .from('.nav > *', { y: -14, opacity: 0, duration: .6, stagger: .05 }, 0)
    .from('.eyebrow', { opacity: 0, letterSpacing: '0.4em', duration: 1 }, .1)
    .from('.hero h1 .line > span', { yPercent: 105, duration: 1, stagger: .12 }, .2)
    .from('.lead', { y: 20, opacity: 0, duration: .8 }, .5)
    .from('.actions > *', { y: 16, opacity: 0, duration: .7, stagger: .08 }, .6)
    // o logo acende como uma lâmpada: duas piscadas e liga de vez
    .fromTo('.hero-logo img',
      { opacity: 0, scale: .96 },
      { keyframes: [
          { opacity: .55, duration: .06 },
          { opacity: .08, duration: .08 },
          { opacity: .8, duration: .05 },
          { opacity: .2, duration: .1 },
          { opacity: 1, scale: 1, duration: .6, ease },
        ], ease: 'none' }, .55);
  document.querySelectorAll('.actions .blueprint, .nav .blueprint').forEach((b) => intro.add(register(b), .7));

  // O logo se afasta devagar quando o primeiro ecrã sai.
  gsap.to('.hero-logo', {
    yPercent: 12,
    scale: .94,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Cada seção: o rótulo aparece, a régua se desenha da esquerda, depois o conteúdo.
  document.querySelectorAll('.section').forEach((section) => {
    const tl = gsap.timeline({ defaults: { ease }, scrollTrigger: { trigger: section, start: 'top 82%', once: true } });
    tl.from(section.querySelector('.label'), { x: -16, opacity: 0, duration: .7 }, 0)
      .from(section.querySelector('.rule'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, .05);
  });

  // Serviços: os cartões entram em sequência e as marcas se registram em cada um.
  gsap.utils.toArray('.service').forEach((card, i) => {
    const tl = gsap.timeline({ defaults: { ease }, scrollTrigger: { trigger: '.services', start: 'top 85%', once: true } });
    tl.from(card, { y: 32, opacity: 0, duration: .9 }, i * .09)
      .from(card.querySelectorAll('.num, h3, p'), { y: 14, opacity: 0, duration: .7, stagger: .06 }, i * .09 + .15)
      .add(register(card), i * .09 + .1);
  });

  // Diferenciais: a ficha técnica abre, as células acendem uma a uma.
  const sheet = gsap.timeline({ defaults: { ease }, scrollTrigger: { trigger: '.sheet', start: 'top 85%', once: true } });
  sheet
    .from('.sheet', { opacity: 0, y: 24, duration: .9 }, 0)
    .add(register(document.querySelector('.sheet')), .1)
    .from('.sheet-head > span', { opacity: 0, x: -12, duration: .6, stagger: .08 }, .25)
    .from('.perk', { opacity: 0, y: 18, duration: .7, stagger: .09 }, .35)
    .from('.perk .num', { color: '#f2f2f0', duration: .6, stagger: .09 }, .5)
    .from('.sheet-foot > span', { opacity: 0, y: 10, duration: .6, stagger: .08 }, .8);

  // Contato: o número rola dígito a dígito, como um contador.
  const phone = document.querySelector('.phone');
  const chars = [...phone.textContent].map((ch) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.display = 'inline-block';
    if (ch === ' ') s.style.width = '.25em';
    return s;
  });
  phone.setAttribute('aria-label', phone.textContent);
  phone.textContent = '';
  chars.forEach((s) => phone.appendChild(s));
  const contact = gsap.timeline({ defaults: { ease }, scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', once: true } });
  contact
    .from('.contact-title', { y: 24, opacity: 0, duration: .8 }, 0)
    .from(chars, { yPercent: 80, opacity: 0, duration: .7, stagger: .035 }, .15)
    .from('.contact-copy p', { y: 14, opacity: 0, duration: .7 }, .5)
    .from('.contact-actions > *', { x: 20, opacity: 0, duration: .7, stagger: .08 }, .3);
  contact.add(register(document.querySelector('.contact-actions .blueprint')), .45);

  gsap.from('.footer > *', {
    y: 12, opacity: 0, duration: .7, ease, stagger: .08,
    scrollTrigger: { trigger: '.footer', start: 'top 95%', once: true },
  });
})();
