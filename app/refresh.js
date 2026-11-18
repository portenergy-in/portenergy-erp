/* (c) 2026 Port Energy Private Limited. Smart Features menu: the header tools (PEPL AI, Smart tools, Meetings, Calculators) in one place. */
(function () {
  'use strict';
  var Q = function (s) { return document.querySelector(s); };
  var svg = function (p) { return '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; };
  var TOOLS = [
    ['#aiBtn', 'PEPL AI', 'Ask questions about your ERP data', 'linear-gradient(135deg,#F0006C,#7A1E8E)', svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>')],
    ['#peSmart', 'Smart tools', 'Item finder, voice indent, scan bill, ID card', 'linear-gradient(135deg,#0084F0,#00249C)', svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>')],
    ['#peMeet', 'Meetings', 'Schedule and follow up meetings', 'linear-gradient(135deg,#00B49C,#0084F0)', svg('<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3z"/>')],
    ['#peCalc', 'Calculators', 'Quick calculators for site and accounts', 'linear-gradient(135deg,#F59E0B,#E07B00)', svg('<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>')]
  ];
  var menu = null, btn = null;
  function place() {
    if (!menu || !btn) return;
    var r = btn.getBoundingClientRect(), w = menu.offsetWidth || 330;
    menu.style.top = Math.round(r.bottom + 8) + 'px';
    menu.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, Math.round(r.right - w))) + 'px';
  }
  function close() { if (menu) menu.classList.remove('on'); if (btn) btn.setAttribute('aria-expanded', 'false'); }
  function open() {
    var items = TOOLS.filter(function (t) { return Q(t[0]); });
    menu.innerHTML = '<div class="sf-h">Smart features</div>' + (items.length ? items.map(function (t, i) {
      return '<button type="button" class="sf-i" data-i="' + i + '"><i style="background:' + t[3] + '">' + t[4] + '</i><span><b>' + t[1] + '</b><small>' + t[2] + '</small></span></button>';
    }).join('') : '<div class="sf-none">No smart features for your role.</div>');
    Array.prototype.forEach.call(menu.querySelectorAll('.sf-i'), function (b) {
      b.onclick = function () { var t = items[+b.dataset.i], el = t && Q(t[0]); close(); if (el) el.click(); };
    });
    menu.classList.add('on'); btn.setAttribute('aria-expanded', 'true'); place();
  }
  function build() {
    if (Q('#peSF')) return true;
    var anchor = Q('.top #aiBtn') || Q('.top #refreshBtn');
    if (!anchor) return false;
    anchor.insertAdjacentHTML('beforebegin', '<button class="btn soft sm" id="peSF" type="button" aria-haspopup="true" aria-expanded="false" title="Smart features">' + svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>') + '<span class="sft">Smart features</span><svg class="sfc" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>');
    btn = Q('#peSF');
    menu = document.createElement('div'); menu.className = 'sf-menu'; menu.id = 'peSFMenu'; document.body.appendChild(menu);
    btn.onclick = function (e) { e.stopPropagation(); if (menu.classList.contains('on')) close(); else open(); };
    document.addEventListener('click', function (e) { if (menu.classList.contains('on') && !menu.contains(e.target) && !btn.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', place);
    return true;
  }
  var n = 0, t = setInterval(function () { if (build() || ++n > 40) clearInterval(t); }, 250);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
