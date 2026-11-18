/* © 2026 Port Energy Private Limited. All rights reserved. Proprietary and confidential. */
/**
 * PORT ENERGY ERP - install as an app (phone + laptop)
 *  Android / Windows / Mac (Chrome, Edge): "Install app" button -> real app icon, own window
 *  iPhone / iPad (Safari): shows the 2 steps (Share -> Add to Home Screen)
 * Button appears in the login card and in the profile menu. Hidden once installed.
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var installed = function () { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; };
  var deferred = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () { }); });
  }

  var ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><rect x="4" y="17" width="16" height="4" rx="1.5"/></svg>';

  function buttons() {
    var show = !installed() && (deferred || ios);
    // profile menu (phone + desktop)
    var menu = $('menu'), mb = $('peInstallM');
    if (menu && !mb) { mb = document.createElement('button'); mb.id = 'peInstallM'; mb.type = 'button'; mb.innerHTML = 'Install app on this device'; mb.onclick = install; menu.insertBefore(mb, menu.firstChild); }
    if (mb) mb.style.display = show ? '' : 'none';
    // login card
    var card = document.querySelector('#login .auth'), lb = $('peInstallL');
    if (card && !lb) { lb = document.createElement('button'); lb.id = 'peInstallL'; lb.type = 'button'; lb.className = 'pe-inst'; lb.innerHTML = ICON + '<span>Install Port Energy app</span>'; lb.onclick = install; card.appendChild(lb); }
    if (lb) lb.style.display = show ? '' : 'none';
  }

  function install() {
    var m = $('menu'); if (m) m.classList.remove('open');
    if (deferred) {
      var d = deferred; deferred = null;
      d.prompt();
      d.userChoice.then(function () { buttons(); }).catch(function () { buttons(); });
      return;
    }
    if (ios) guide();
  }

  function guide() {
    var modal = $('modal'), box = $('mbox');
    if (!modal || !box) return;
    box.innerHTML = '<h3 style="margin-bottom:6px">Install on iPhone / iPad</h3><p class="note" style="margin:0 0 16px">Open this page in <b>Safari</b>, then:</p>' +
      '<ol class="pe-steps"><li><span class="n">1</span><div>Tap the <b>Share</b> button <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg> at the bottom</div></li>' +
      '<li><span class="n">2</span><div>Choose <b>Add to Home Screen</b>, then <b>Add</b></div></li></ol>' +
      '<button class="btn primary block" type="button" id="peGuideOk" style="margin-top:18px">OK</button>';
    modal.classList.add('open');
    $('peGuideOk').onclick = function () { modal.classList.remove('open'); };
  }

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; buttons(); });
  window.addEventListener('appinstalled', function () { deferred = null; buttons(); });
  document.addEventListener('DOMContentLoaded', buttons);
  if (document.readyState !== 'loading') buttons();
})();

/* In-app update: when a new version is published, ask the person to update (like Play Store apps) */
(function () {
  if (!('serviceWorker' in navigator)) return;
  var had = !!navigator.serviceWorker.controller, shown = false;
  function bar() {
    if (shown || !had) return; shown = true;
    var d = document.createElement('div');
    d.id = 'peUpd';
    d.setAttribute('style', 'position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:9999;max-width:460px;margin:0 auto;background:#0A2E8A;color:#fff;border-radius:16px;padding:14px 14px 14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 18px 40px -12px rgba(0,0,0,.45);font:500 14px/1.35 system-ui,sans-serif');
    d.innerHTML = '<div style="flex:1"><b style="display:block;font-size:15px">Update available</b>A new version of Port Energy ERP is ready.</div>' +
      '<button id="peUpdL" style="border:0;background:transparent;color:#C9D6FF;font-weight:600;padding:8px">Later</button>' +
      '<button id="peUpdN" style="border:0;background:#fff;color:#0A2E8A;font-weight:700;border-radius:10px;padding:10px 14px">Update</button>';
    document.body.appendChild(d);
    document.getElementById('peUpdN').onclick = function () { this.textContent = 'Updating…'; location.reload(); };
    document.getElementById('peUpdL').onclick = function () { d.remove(); };
  }
  navigator.serviceWorker.addEventListener('controllerchange', bar);
  /* check for a new version every time the app comes back to the screen, and every 30 min */
  function check() { navigator.serviceWorker.getRegistration().then(function (r) { if (r) r.update(); }).catch(function () { }); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); });
  setInterval(check, 30 * 60 * 1000);
  window.addEventListener('focus', check);
  setTimeout(check, 5000);
})();

/* Update watcher: while the app stays open (desktop window / phone), look for a newer version every 3 minutes and when the window gets focus.
   New version found -> clear banner at the TOP; on the sign-in screen it updates by itself. */
(function () {
  if (!window.fetch || location.protocol !== 'https:') return;
  var shown = false;
  function hard() {
    var p = [];
    try { if (window.caches) p.push(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })); } catch (e) { }
    try { if (navigator.serviceWorker) p.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })); } catch (e) { }
    var go = function () { location.replace(location.pathname + '?u=' + Date.now() + location.hash); };
    Promise.all(p).then(go, go);
  }
  function banner(v) {
    if (shown) return; shown = true;
    var lg = document.getElementById('login');
    if (lg && lg.style.display && lg.style.display !== 'none') { try { localStorage.setItem('pe_appver', v); } catch (e) { } return hard(); }
    var d = document.createElement('div');
    d.setAttribute('style', 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:99999;max-width:min(94vw,520px);background:#0A2E8A;color:#fff;border-radius:16px;padding:12px 14px 12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 18px 40px -12px rgba(10,46,138,.6);font:500 14px Poppins,system-ui,sans-serif');
    d.innerHTML = '<div style="flex:1"><b style="display:block;font-size:15px">New version ready</b>Tap Update to get the latest Port Energy ERP.</div><button id="peUp2L" style="border:0;background:transparent;color:#C9D6FF;font-weight:600;padding:8px">Later</button><button id="peUp2N" style="border:0;background:#fff;color:#0A2E8A;font-weight:700;border-radius:10px;padding:10px 14px">Update</button>';
    document.body.appendChild(d);
    document.getElementById('peUp2N').onclick = function () { this.textContent = 'Updating…'; try { localStorage.setItem('pe_appver', v); } catch (e) { } hard(); };
    document.getElementById('peUp2L').onclick = function () { d.remove(); setTimeout(function () { shown = false; }, 10 * 60 * 1000); };
  }
  function check() {
    fetch('sw.js?c=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
      var m = t.match(/pe-app-v[0-9]+/); if (!m) return;
      var cur = null; try { cur = localStorage.getItem('pe_appver'); } catch (e) { }
      if (cur && cur !== m[0]) banner(m[0]);
    }).catch(function () { });
  }
  setInterval(check, 3 * 60 * 1000);
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); });
  setTimeout(check, 20000);
})();
