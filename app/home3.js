/* (c) 2026 Port Energy Private Limited. All rights reserved. Proprietary and confidential. */
/**
 * PORT ENERGY ERP - HOME DASHBOARD v5
 * Draws the executive home exactly as designed: hero, KPI row, Projects at a Glance, This Month Summary,
 * Quick Actions, Work Progress, Ongoing Projects, Recent Activity.
 * Every number comes from the ERP (home data, Projects, Daily Site Reports, Bills, GRN, Payments).
 * Nothing is invented: a figure that cannot be read for the signed-in role shows "-".
 */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var P = {
    clip: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l2 2 4-4"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>',
    bill: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h6M9 14h6M9 17h3"/>',
    box: '<path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    helmet: '<path d="M4 17h16M5 17a7 7 0 0 1 14 0M12 6v5M3 20h18"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    fplus: '<path d="M6 3h9l4 4v14H6z"/><path d="M12 11v6M9 14h6"/>',
    rupee: '<path d="M7 5h10M7 9h10M7 5c5 0 7 1.6 7 4s-2 4-7 4l7 6"/>',
    hand: '<path d="M3 15h4l4 2h6a2 2 0 0 0 0-4h-4M7 15v5H3M14 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
    wallet: '<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h3"/>',
    uplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 5a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-3-5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5"/>',
    pipe: '<rect x="2" y="9" width="20" height="6" rx="3"/><path d="M8 9v6M16 9v6"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'
  };
  function ic(n, s) { s = s || 20; return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; }
  function money(n) { n = Number(n) || 0; var a = Math.abs(n); if (a >= 1e7) return '₹ ' + (n / 1e7).toFixed(2) + ' Cr'; if (a >= 1e5) return '₹ ' + (n / 1e5).toFixed(2) + ' L'; return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function ymd(v) { v = String(v || ''); if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10); var m = /^(\d{2})-([A-Za-z]{3})-(\d{4})/.exec(v); if (m) { var i = MON.indexOf(m[2]); if (i > -1) return m[3] + '-' + ('0' + (i + 1)).slice(-2) + '-' + m[1]; } return ''; }
  function daysAgo(d) { d = ymd(d); if (!d) return null; var t = new Date(); var a = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), b = Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)); return Math.round((a - b) / 864e5); }
  function ago(d) { var n = daysAgo(d); if (n == null) return ''; if (n <= 0) return 'Today'; if (n === 1) return 'Yesterday'; if (n < 31) return n + ' days ago'; return Math.round(n / 30) + ' mo ago'; }
  function call(fn, a) { return new Promise(function (ok, bad) { window.google.script.run.withSuccessHandler(ok).withFailureHandler(bad)[fn].apply(null, a); }); }
  function token() { try { return localStorage.getItem('pe_token'); } catch (x) { return null; } }
  function ent(k) { var s = window.PE_SESSION, l = (s && s.entities) || []; for (var i = 0; i < l.length; i++) if (l[i].key === k) return l[i]; return null; }
  function openNav(sel) { var b = document.querySelector('#nav .ni[' + sel + ']'); if (b) { b.click(); return true; } return false; }
  function openNew(k) { if (!openNav('data-k="' + k + '"')) return; var n = 0, t = setInterval(function () { var b = $('newBtn'); if (b || ++n > 30) { clearInterval(t); if (b) b.click(); } }, 120); }

  var QA = [['pr', 'Create PR', 'fplus', '#0B5BD3'], ['po', 'Create PO', 'cart', '#0B5BD3'], ['grn', 'Create GRN', 'box', '#0E9F6E'], ['bills', 'Vendor Bill', 'rupee', '#E0245E'],
    ['expenses', 'Expense', 'hand', '#E8830C'], ['dsr', 'Site Report', 'helmet', '#D99A00'], ['pettycash', 'Petty Cash', 'wallet', '#2563EB'], ['vendors', 'New Vendor', 'uplus', '#C026D3']];

  var cache = null;
  function load() {
    var tok = token(); if (!tok) return Promise.resolve(null);
    var safe = function (k) { return call('listRecords', [tok, k]).then(function (r) { return (r && r.rows) || []; }).catch(function () { return null; }); };
    return Promise.all([safe('projects'), safe('dsr'), safe('bills'), safe('grn'), safe('payments')]).then(function (r) { return { t: Date.now(), projects: r[0], dsr: r[1], bills: r[2], grn: r[3], pay: r[4] }; });
  }

  function hero(h) {
    var u = (window.PE_SESSION && window.PE_SESSION.user) || {}, n = new Date(), hr = n.getHours();
    var g = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    var first = String(u.name || '').split(' ').slice(-1)[0] || '';
    return '<section class="hx-hero"><div class="hx-eye"><b>E</b>XECUTIVE DASHBOARD</div><h2>Company Operations Overview</h2><p>' + ic('cal', 18) + DAY[n.getDay()] + ', ' + n.getDate() + ' ' + MON[n.getMonth()] + ' ' + n.getFullYear() + '<i></i>' + g + (first ? ', ' + esc(first) : '') + '</p><div class="hx-mot">Impossible can be <b>possible.</b></div></section>';
  }
  function kpis(h) {
    var k = h.kpi || {}, L = [];
    L.push(['pink', 'clip', 'Approvals', String((h.inbox || []).length), 'Pending for your action', 'data-v="inbox"']);
    if (k.poPending != null) L.push(['blue', 'cart', 'Purchase Orders', String(k.poPending), 'Awaiting approval', 'data-k="po"']);
    if (k.payables != null) {
      L.push(['green', 'bill', 'Payables', money(k.payables), 'Vendor bills outstanding', 'data-k="bills"']);
      L.push(['orange', 'box', 'Receivables', money(k.receivables), 'Customer invoices pending', 'data-k="clientbills"']);
      L.push(['red', 'alert', 'Overdue', money(k.overdue), money(k.dueWeek) + ' due in next 7 days', 'data-k="bills"']);
    }
    return '<div class="hx-k">' + L.map(function (x) { return '<button type="button" class="hx-kpi" data-c="' + x[0] + '" data-go=\'' + x[5] + '\'><span class="ico">' + ic(x[1], 28) + '</span><span class="tx"><span class="t">' + x[2] + '</span><span class="v">' + esc(x[3]) + '</span><span class="s">' + esc(x[4]) + '</span></span><span class="ch">' + ic('chev', 18) + '</span></button>'; }).join('') + '</div>';
  }
  function panel(cls, icn, title, body, link) {
    return '<section class="hx-p ' + cls + '"><div class="hx-ph">' + ic(icn, 22) + '<h3>' + title + '</h3>' + (link ? '<button type="button" class="hx-link" data-go=\'' + link + '\'>View All ' + ic('arrow', 15) + '</button>' : '') + '</div>' + body + '</section>';
  }
  function quick() {
    var q = QA.filter(function (x) { var e = ent(x[0]); return e && e.canCreate; });
    return q.length ? '<div class="hx-q">' + q.map(function (x) { return '<button type="button" data-new="' + x[0] + '" style="--c:' + x[3] + '">' + ic(x[2], 28) + '<span>' + x[1] + '</span></button>'; }).join('') + '</div>' : '<div class="hx-empty"><b>No quick actions</b>Nothing to create for your role.</div>';
  }
  function stats(d) {
    var pr = (d && d.projects) || [], latest = {};
    ((d && d.dsr) || []).forEach(function (r) { var p = r.project, dt = ymd(r.date); if (!p || !dt) return; if (!latest[p] || dt > latest[p].d) latest[p] = { d: dt, pg: Math.max(0, Math.min(100, Number(r.progress) || 0)), mp: Number(r.manpower) || 0 }; });
    var st = function (p) { return p.pstatus || 'Active'; };
    var act = pr.filter(function (p) { return st(p) === 'Active'; }), hold = pr.filter(function (p) { return st(p) === 'On Hold'; }), done = pr.filter(function (p) { return st(p) === 'Completed'; });
    var rep = act.filter(function (p) { return latest[p.name]; });
    var avg = rep.length ? Math.round(rep.reduce(function (s, p) { return s + latest[p.name].pg; }, 0) / rep.length) : null;
    var mp = rep.reduce(function (s, p) { return s + latest[p.name].mp; }, 0);
    return { all: pr, act: act, hold: hold, done: done, latest: latest, avg: avg, mp: mp, hasRep: rep.length > 0 };
  }
  function glance(S) {
    if (!S.ok) return '<div class="hx-empty"><b>Projects not available</b>Open Projects / Sites to view.</div>';
    return '<div class="hx-glance"><div class="hx-photo"></div><ul class="hx-stats">' +
      '<li>' + ic('helmet', 18) + '<span>Active Projects</span><b>' + S.act.length + '</b></li>' +
      '<li>' + ic('layers', 18) + '<span>Total Projects</span><b>' + S.all.length + '</b></li>' +
      '<li>' + ic('people', 18) + '<span>Manpower on Site</span><b>' + (S.hasRep ? S.mp : '-') + '</b></li>' +
      '<li class="pg">' + ic('chart', 18) + '<span>Work Progress</span><b>' + (S.avg == null ? '-' : S.avg + '%') + '</b><div class="hx-bar"><em style="width:' + (S.avg || 0) + '%"></em></div></li></ul></div>';
  }
  function month(h, d) {
    var n = new Date(), ym = n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2), k = h.kpi || {};
    var po = null; (k.poChart || []).forEach(function (x) { if (x.ym === ym) po = x.v; });
    var inM = function (v) { return ymd(v).slice(0, 7) === ym; };
    var bills = d && d.bills ? d.bills.filter(function (r) { return inM(r.billDate); }).reduce(function (s, r) { return s + (Number(r.total) || 0); }, 0) : null;
    var grn = d && d.grn ? d.grn.filter(function (r) { return inM(r.date); }).length : null;
    var pay = d && d.pay ? d.pay.filter(function (r) { return inM(r.date); }).reduce(function (s, r) { return s + (Number(r.amount) || 0); }, 0) : null;
    var row = function (i, l, v) { return '<li>' + ic(i, 20) + '<span>' + l + '</span><b>' + v + '</b></li>'; };
    return '<ul class="hx-sum">' + row('chart', 'PO Value (approved)', po == null ? '-' : money(po)) + row('box', 'GRNs Received', grn == null ? '-' : grn) + row('bill', 'Bills Received', bills == null ? '-' : money(bills)) + row('card', 'Payments Made', pay == null ? '-' : money(pay)) + '</ul>';
  }
  function work(S) {
    if (!S.ok) return '<div class="hx-empty"><b>Projects not available</b></div>';
    var R = 52, C = 2 * Math.PI * R, pc = S.avg == null ? 0 : S.avg, len = pc / 100 * C;
    return '<div class="hx-wp"><div class="hx-dn"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="' + R + '" fill="none" stroke="#E3E7EF" stroke-width="14"/>' + (pc ? '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="#16A34A" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + len.toFixed(1) + ' ' + (C - len).toFixed(1) + '" transform="rotate(-90 70 70)"/>' : '') + '</svg><div class="hx-dc"><b>' + (S.avg == null ? '-' : S.avg + '%') + '</b><span>' + (S.avg == null ? 'No reports yet' : 'Overall<br>Progress') + '</span></div></div>' +
      '<ul class="hx-lst"><li>Total Projects<b>' + S.all.length + '</b></li><li>Active<b style="--c:#0E9F6E">' + S.act.length + '</b></li><li>On Hold<b style="--c:#E8830C">' + S.hold.length + '</b></li><li>Completed<b style="--c:#1E6FE0">' + S.done.length + '</b></li></ul></div>';
  }
  function ongoing(S) {
    if (!S.ok) return '<div class="hx-empty"><b>Projects not available</b></div>';
    var list = S.act.concat(S.hold).slice(0, 5);
    if (!list.length) return '<div class="hx-empty"><b>No ongoing projects</b>Add sites under Projects / Sites.</div>';
    return '<table class="hx-tb"><thead><tr><th>#</th><th>Project / Site</th><th>Status</th><th>Progress</th></tr></thead><tbody>' + list.map(function (p, i) {
      var L = S.latest[p.name] || {}, a = daysAgo(L.d), st = p.pstatus || 'Active', cls, lab;
      if (st === 'On Hold') { cls = 'warn'; lab = 'On Hold'; } else if (L.d == null) { cls = 'mute'; lab = 'No reports'; } else if (a > 3) { cls = 'bad'; lab = 'No report ' + a + 'd'; } else { cls = 'ok'; lab = 'On track'; }
      var pg = L.pg || 0;
      return '<tr data-go=\'data-k="projects"\'><td>' + (i + 1) + '</td><td><b>' + esc(p.name) + '</b>' + (p.location ? '<small>' + esc(p.location) + '</small>' : '') + '</td><td><span class="hx-pill ' + cls + '">' + esc(lab) + '</span></td><td><div class="hx-pg"><b>' + (L.d ? pg + '%' : '-') + '</b><i><em style="width:' + pg + '%"></em></i></div></td></tr>';
    }).join('') + '</tbody></table>';
  }
  function activity(h) {
    var L = [];
    (h.mine || []).forEach(function (m) { L.push({ t: m.title || m.id, s: m.status || '', d: m.date, k: m.key, id: m.id }); });
    (h.inbox || []).forEach(function (m) { L.push({ t: m.title || m.id, s: 'Waiting for you', d: m.date, k: m.key, id: m.id }); });
    L.sort(function (a, b) { return String(ymd(b.d)).localeCompare(String(ymd(a.d))); });
    L = L.slice(0, 5);
    if (!L.length) return '<div class="hx-empty"><b>No recent activity</b>Your requests and approvals appear here.</div>';
    var col = function (s) { s = String(s).toLowerCase(); return /approv|complet|paid|done|closed|received/.test(s) ? '#16A34A' : /reject|cancel|overdue/.test(s) ? '#E5393B' : /wait|pending|submit|verif/.test(s) ? '#F59E0B' : '#1E6FE0'; };
    return '<ul class="hx-act">' + L.map(function (x) { return '<li style="--c:' + col(x.s) + '"><i></i><span><b>' + esc(x.t) + '</b>' + (x.s ? ' - ' + esc(x.s) : '') + '</span><small>' + esc(ago(x.d)) + '</small></li>'; }).join('') + '</ul>';
  }

  function fill(hx, h, d) {
    var S = stats(d); S.ok = !!(d && d.projects);
    var set = function (id, html) { var e = hx.querySelector('#' + id); if (e) e.innerHTML = html; };
    set('hxG', glance(S)); set('hxM', month(h, d)); set('hxW', work(S)); set('hxO', ongoing(S));
  }

  function build() {
    tidyNav();
    var c = $('content'); if (!c) return;
    var v = c.querySelector('.view');
    var isHome = !!(v && v.querySelector('.hero2'));
    document.body.classList.toggle('hx-home', isHome);
    var h = window.PE_HOME;
    if (!isHome || v.querySelector('.hx') || !h || !h.kpi || !window.PE_SESSION) return;
    var hx = document.createElement('div'); hx.className = 'hx';
    hx.innerHTML = hero(h) + kpis(h) +
      '<div class="hx-r2">' +
        panel('hx-gl', 'helmet', 'Projects at a Glance', '<div id="hxG"><div class="hx-empty">Loading...</div></div>', 'data-k="projects"') +
        panel('hx-sm', 'chart', 'This Month Summary <small>(' + MON[new Date().getMonth()] + ' ' + new Date().getFullYear() + ')</small>', '<div id="hxM"><div class="hx-empty">Loading...</div></div>') +
        panel('hx-qa', 'bolt', 'Quick Actions', quick()) +
      '</div><div class="hx-r3">' +
        panel('hx-wk', 'pipe', 'Work Progress', '<div id="hxW"><div class="hx-empty">Loading...</div></div>') +
        panel('hx-on', 'layers', 'Ongoing Projects', '<div id="hxO"><div class="hx-empty">Loading...</div></div>', 'data-k="projects"') +
        panel('hx-ac', 'cal', 'Recent Activity', activity(h), 'data-v="inbox"') +
      '</div>';
    v.insertBefore(hx, v.firstChild); v.classList.add('hx-on');
    hx.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]'); if (g) { openNav(g.getAttribute('data-go')); return; }
      var q = e.target.closest('[data-new]'); if (q) { openNew(q.getAttribute('data-new')); return; }
      if (e.target.closest('.hx-act li')) openNav('data-v="inbox"');
    });
    if (cache) fill(hx, h, cache);
    if (!cache || Date.now() - cache.t > 60000) {
      load().then(function (d) { if (d) cache = d; if (document.body.contains(hx)) fill(hx, h, d); });
    }
  }

  /* sidebar: group names in normal case, groups folded by default (like the design); a person's own open/close choice is kept afterwards */
  function tidyNav() {
    var n = $('nav'); if (!n || !n.querySelector('.ng')) return;
    n.querySelectorAll('.ngh').forEach(function (b) {
      var tn = b.firstChild; if (!tn || tn.nodeType !== 3) return;
      var s = tn.nodeValue.trim();
      if (s && s === s.toUpperCase()) tn.nodeValue = s.toLowerCase().replace(/(^|[\s&])([a-z])/g, function (m, a, c) { return a + c.toUpperCase(); });
    });
    var done = false; try { done = localStorage.getItem('pe_ng_init5') === '1'; } catch (x) { }
    if (!done) {
      n.querySelectorAll('.ng[data-g]:not(.closed) .ngh').forEach(function (b) { b.click(); });
      try { localStorage.setItem('pe_ng_init5', '1'); } catch (x) { }
    }
  }

  var tm = null;
  function soon() { clearTimeout(tm); tm = setTimeout(build, 80); }
  var c0 = $('content');
  if (c0) new MutationObserver(soon).observe(c0, { childList: true, subtree: true });
  setInterval(function () { tidyNav(); var v = c0 && c0.querySelector('.view'); if (v && v.querySelector('.hero2') && !v.querySelector('.hx')) build(); }, 1200);
  [300, 900, 1800, 3500].forEach(function (t) { setTimeout(build, t); });
  window.addEventListener('load', soon);
})();

;(function(){document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#refreshBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();b.disabled=true;b.style.opacity='.6';var go=false;var done=function(){if(go)return;go=true;location.replace(location.pathname+'?r='+Date.now()+location.hash);};var p=[];try{if(window.caches)p.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}));}));}catch(x){}try{if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister();}));}));}catch(x){}Promise.all(p).then(done,done);setTimeout(done,2500);},true);})();

;(function(){try{var d=document.documentElement,mem=navigator.deviceMemory||8,cores=navigator.hardwareConcurrency||8;if(mem<=2||cores<=3){d.classList.add('pe-lite');return;}if(!window.requestAnimationFrame)return;var n=0,t0=0;function f(t){if(!t0)t0=t;n++;if(t-t0<1800){requestAnimationFrame(f);}else{var avg=(t-t0)/n;if(avg>28&&document.visibilityState==='visible')d.classList.add('pe-lite');}}setTimeout(function(){if(document.visibilityState==='visible')requestAnimationFrame(f);},2500);}catch(e){}})();

;(function(){try{var c=document.getElementById('content')||document.querySelector('.main > .content');if(!c)return;var bar=document.createElement('i');bar.id='peNavBar';document.body.appendChild(bar);var failT=0,quietT=0,t0=0;
function off(){clearTimeout(failT);clearTimeout(quietT);document.body.classList.remove('pe-nav-wait');}
function on(){t0=Date.now();document.body.classList.remove('pe-nav-wait');void bar.offsetWidth;document.body.classList.add('pe-nav-wait');clearTimeout(failT);failT=setTimeout(off,7000);clearTimeout(quietT);quietT=setTimeout(off,650);}
document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('#nav .ni, .bnav button, .bnav a');if(el&&!el.classList.contains('on'))on();},true);
new MutationObserver(function(){if(!document.body.classList.contains('pe-nav-wait'))return;clearTimeout(quietT);quietT=setTimeout(off,450);}).observe(c,{childList:true,subtree:true});}catch(e){}})();
