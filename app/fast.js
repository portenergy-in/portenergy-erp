/* Fast mode switch (default ON). Stored per device. */
(function () {
  var root = document.documentElement;
  function on() { try { return localStorage.getItem('pe_fast') !== '0'; } catch (e) { return true; } }
  function apply() { root.classList.toggle('pe-fast', on()); var b = document.querySelector('#sideTools [data-fast]'); if (b) b.textContent = '⚡ Fast mode: ' + (on() ? 'On' : 'Off'); }
  window.PE_FAST = on;
  apply();
  function mount() {
    var t = document.getElementById('sideTools'); if (!t || t.querySelector('[data-fast]')) return !!t;
    var b = document.createElement('button'); b.setAttribute('data-fast', '1'); b.type = 'button';
    b.onclick = function (e) { e.stopPropagation(); try { localStorage.setItem('pe_fast', on() ? '0' : '1'); } catch (x) { } apply(); };
    t.appendChild(b); apply(); return true;
  }
  var n = 0, iv = setInterval(function () { if (mount() || ++n > 60) clearInterval(iv); }, 500);
})();
