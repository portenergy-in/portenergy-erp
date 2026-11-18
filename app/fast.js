/* Fast mode switch (default ON). Stored per device. */
(function () {
  var root = document.documentElement;
  function on() { try { return localStorage.getItem('pe_fast') !== '0'; } catch (e) { return true; } }
  window.PE_FAST = on;
  apply();
  function label(b) { b.innerHTML = '\u26A1'; b.title = 'Fast mode: ' + (on() ? 'ON (no animations)' : 'OFF'); b.setAttribute('aria-pressed', on() ? 'true' : 'false'); b.className = 'pe-fastbtn' + (on() ? ' on' : ''); }
  function apply() { root.classList.toggle('pe-fast', on()); var b = document.getElementById('peFast'); if (b) label(b); }
  function mount() {
    if (document.getElementById('peFast')) return true;
    var dn = document.getElementById('peDN') || document.getElementById('refreshBtn'); if (!dn) return false;
    var b = document.createElement('button'); b.id = 'peFast'; b.type = 'button';
    b.onclick = function (e) { e.stopPropagation(); try { localStorage.setItem('pe_fast', on() ? '0' : '1'); } catch (x) { } apply(); if (window.toast) { } };
    dn.parentNode.insertBefore(b, dn); label(b); return true;
  }
  var n = 0, iv = setInterval(function () { if (mount() || ++n > 120) clearInterval(iv); }, 500);
})();
