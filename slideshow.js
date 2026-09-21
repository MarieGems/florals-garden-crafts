/* Auto-advancing photo slideshows for the shop cards.

   Markup: <div class="slideshow" data-slideshow>
             <img class="slide is-active" ...> <img class="slide" ...> ...
             <div class="slideshow-dots"></div>
           </div>
   The dots are built here from the slides. Autoplay crossfades every few seconds,
   pauses while a mouse hovers it or a dot has keyboard focus, while the tab is hidden and while the card is off screen,
   and is switched off entirely for visitors who prefer reduced motion (the dots
   still work). Cards start a little out of step so they don't all flip together. */
(function () {
  var INTERVAL = 3800;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-slideshow]').forEach(function (box, boxIndex) {
    var slides = Array.prototype.slice.call(box.querySelectorAll('.slide'));
    if (slides.length < 2) return;

    var dotsWrap = box.querySelector('.slideshow-dots');
    var current = 0;
    var timer = null;
    var hovering = false;      // a real mouse is over the card
    var focusPaused = false;   // keyboard focus is on a dot
    var onScreen = false;
    var preloaded = false;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { show(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function show(i) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current].classList.remove('is-active');
      dots[current].removeAttribute('aria-current');
      current = i;
      slides[current].classList.add('is-active');
      slides[current].removeAttribute('aria-hidden');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-current', 'true');
    }

    function tick() { show((current + 1) % slides.length); }

    function canPlay() { return !reduceMotion && !hovering && !focusPaused && onScreen && !document.hidden; }
    function start() { if (!timer && canPlay()) timer = setInterval(tick, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    // initial state: first slide visible, the rest hidden from assistive tech
    slides.forEach(function (s, i) { if (i !== 0) s.setAttribute('aria-hidden', 'true'); });
    dots[0].classList.add('is-active');
    dots[0].setAttribute('aria-current', 'true');

    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; stop(); } });
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovering = false; start(); } });
    box.addEventListener('focusin', function (e) {
      if (e.target.matches && e.target.matches(':focus-visible')) { focusPaused = true; stop(); }
    });
    box.addEventListener('focusout', function () { focusPaused = false; start(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) {
          if (!preloaded) {                       // once the card is near, load the other angles
            preloaded = true;
            slides.forEach(function (s) { s.loading = 'eager'; });
          }
          setTimeout(start, boxIndex * 600);      // start out of step with the other cards
        } else {
          stop();
        }
      }, { threshold: 0.25 }).observe(box);
    } else {
      onScreen = true;
      slides.forEach(function (s) { s.loading = 'eager'; });
      setTimeout(start, boxIndex * 600);
    }
  });
})();
