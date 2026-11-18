/* © 2026 Port Energy Private Limited. All rights reserved.
   PORT ENERGY ERP - login v3 helpers: shield badge, 3D tilt that follows the pointer / phone tilt, PIN boxes.
   Pure add-on: does not change how sign-in works (the real inputs stay in place). */
(function () {
  'use strict';
  var lg = document.getElementById('login');
  if (!lg) return;
  var card = lg.querySelector('.lg-card');
  if (!card) return;
  var root = document.documentElement;

  /* ---- shield badge ---- */
  if (!card.querySelector('.l3-badge')) {
    var b = document.createElement('div');
    b.className = 'l3-badge'; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<div class="l3-bi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8 4.6 5.6v5.7c0 4.6 3.1 8.1 7.4 9.9 4.3-1.8 7.4-5.3 7.4-9.9V5.6z" fill="rgba(255,255,255,.14)"/><rect x="8.6" y="10.8" width="6.8" height="5.4" rx="1.2" fill="currentColor" stroke="none"/><path d="M10 10.8V9.3a2 2 0 0 1 4 0v1.5"/></svg></div>';
    card.insertBefore(b, card.firstChild);
  }

  /* ---- 3D tilt ---- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = { rx: 0, ry: 0, gx: 25, gy: 0 }, tgt = { rx: 0, ry: 0, gx: 25, gy: 0 }, raf = 0;
  function clamp(v, m) { return Math.max(-m, Math.min(m, v)); }
  function apply() {
    raf = 0;
    var moving = false;
    for (var k in cur) { var d = tgt[k] - cur[k]; if (Math.abs(d) > 0.01) { cur[k] += d * 0.14; moving = true; } else cur[k] = tgt[k]; }
    card.style.setProperty('--l3rx', cur.rx.toFixed(2) + 'deg');
    card.style.setProperty('--l3ry', cur.ry.toFixed(2) + 'deg');
    card.style.setProperty('--l3gx', cur.gx.toFixed(1) + '%');
    card.style.setProperty('--l3gy', cur.gy.toFixed(1) + '%');
    var bd = card.querySelector('.l3-badge');
    if (bd) { bd.style.setProperty('--l3bx', (cur.ry * -1.6).toFixed(1) + 'px'); bd.style.setProperty('--l3by', (cur.rx * 1.4).toFixed(1) + 'px'); }
    if (moving) raf = requestAnimationFrame(apply);
  }
  function go() { if (!raf) raf = requestAnimationFrame(apply); }
  function enabled() { return !reduce && !root.classList.contains('pe-lite') && lg.offsetParent !== null; }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || !enabled()) return;
    var r = card.getBoundingClientRect();
    var nx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), 1);
    var ny = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), 1);
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    var f = inside ? 0.35 : 1;                 /* calmer while the pointer is on the card, so clicking stays easy */
    tgt.ry = nx * 7 * f; tgt.rx = -ny * 5 * f;
    tgt.gx = clamp(((e.clientX - r.left) / r.width) * 100, 140) ; tgt.gy = clamp(((e.clientY - r.top) / r.height) * 100, 140);
    go();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { tgt.rx = 0; tgt.ry = 0; tgt.gx = 25; tgt.gy = 0; go(); });
  window.addEventListener('blur', function () { tgt.rx = 0; tgt.ry = 0; go(); });

  /* phone: very gentle tilt with the device (skipped where the browser asks permission, e.g. iPhone) */
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function' && window.matchMedia && matchMedia('(hover: none)').matches) {
    var b0 = null, g0 = null;
    window.addEventListener('deviceorientation', function (e) {
      if (!enabled() || e.beta == null || e.gamma == null) return;
      if (b0 === null) { b0 = e.beta; g0 = e.gamma; }
      tgt.ry = clamp((e.gamma - g0) * 0.25, 5); tgt.rx = clamp(-(e.beta - b0) * 0.2, 4);
      tgt.gx = 50 + tgt.ry * 8; tgt.gy = 30 - tgt.rx * 8; go();
    }, { passive: true });
  }

  /* ---- PIN boxes around the real PIN input ---- */
  var EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  function boxes(inp) {
    if (inp.getAttribute('data-l3')) return;
    inp.setAttribute('data-l3', '1');
    var wrap = document.createElement('div'); wrap.className = 'l3-pins';
    inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
    var cells = [], i;
    for (i = 0; i < 6; i++) { var c = document.createElement('i'); c.className = 'l3-pb'; wrap.insertBefore(c, inp); cells.push(c); }
    var eye = document.createElement('button'); eye.type = 'button'; eye.className = 'l3-eye'; eye.setAttribute('aria-label', 'Show or hide PIN'); eye.innerHTML = EYE; wrap.appendChild(eye);
    var focused = false, last = null;
    function paint() {
      var v = inp.value || '';
      if (v === last && !paint.force) return; last = v; paint.force = false;
      var n = 6;                                           /* always 6 boxes; a PIN of 4 to 6 digits is fine */
      wrap.style.setProperty('--n', n);
      for (var j = 0; j < 6; j++) {
        var ch = v.charAt(j);
        cells[j].classList.toggle('h', j >= n);
        cells[j].classList.toggle('f', !!ch);
        if (ch) cells[j].setAttribute('data-c', ch); else cells[j].removeAttribute('data-c');
        cells[j].classList.toggle('on', focused && j === Math.min(v.length, n - 1));
      }
    }
    inp.addEventListener('input', paint);
    inp.addEventListener('focus', function () { focused = true; paint.force = true; paint(); });
    inp.addEventListener('blur', function () { focused = false; paint.force = true; paint(); });
    eye.addEventListener('click', function () { wrap.classList.toggle('rev'); try { inp.focus(); } catch (x) { } });
    /* value cleared by the app after a wrong PIN, and the shake effect */
    var t = setInterval(function () { if (!document.body.contains(wrap)) { clearInterval(t); return; } paint(); }, 160);
    if (window.MutationObserver) new MutationObserver(function () {
      if (inp.classList.contains('shake')) { wrap.classList.remove('shake'); void wrap.offsetWidth; wrap.classList.add('shake'); setTimeout(function () { wrap.classList.remove('shake'); }, 450); }
    }).observe(inp, { attributes: true, attributeFilter: ['class'] });
    focused = document.activeElement === inp; paint.force = true; paint();
  }
  function scan() { var p = document.getElementById('lpin'); if (p) boxes(p); }
  var host = document.getElementById('stepPhone') || lg;
  if (window.MutationObserver) new MutationObserver(scan).observe(host, { childList: true, subtree: true });
  scan();
})();
