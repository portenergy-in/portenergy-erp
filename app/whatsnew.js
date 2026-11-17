/* © 2026 Port Energy Private Limited. All rights reserved.
   PORT ENERGY ERP - "What's new": after an update, every employee sees once what changed and how it helps them.
   TO ADD A RELEASE: put a new object at the TOP of RELEASES (new id, date, items). Old ones stay for the history list. */
(function () {
  'use strict';
  var RELEASES = [
    { id: '2026-11-17c', date: '17 Nov 2026', title: 'PEPL Intelligence now works for you', items: [
      { i: '🤖', t: 'AI operates the ERP', d: 'Tell the AI what you need. It opens the form and fills it while you watch.' },
      { i: '📎', t: 'Attach and say', d: 'Attach a quotation, invoice or GST certificate and say what to do, for example: fill this vendor form.' },
      { i: '🔍', t: 'Asks your ERP', d: 'Ask for pending POs, a vendor or a bill status. The AI searches the records you can see.' },
      { i: '✅', t: 'You stay in control', d: 'AI never saves. Check the form, then press Save.' }
    ] },
    { id: '2026-11-17b', date: '17 Nov 2026', title: 'New: AI that fills your forms', items: [
      { i: '🤖', t: 'Attach and auto-fill', d: 'In PEPL Intelligence, attach a quotation, invoice, GST certificate or visiting card and tap Fill. The ERP form opens with the details already typed in.' },
      { i: '✅', t: 'You check, then save', d: 'AI never saves anything. Check every field, then tap Save.' },
      { i: '🔍', t: 'Smart checks', d: 'It warns about a wrong GSTIN, a PAN mismatch, a vendor already in the master, a duplicate invoice and wrong GST type.' },
      { i: '📚', t: 'Smarter answers', d: 'The AI now knows the Port Energy ERP flow, procurement, GST / TDS, payroll, tenders and letters.' }
    ] },
    { id: '2026-11-17', date: '17 Nov 2026', title: 'What\'s new in Procurement', items: [
      { i: '📝', t: 'Purchase Indent', d: 'Purchase Request is now called Purchase Indent. Raise your indent in the same easy way.' },
      { i: '✅', t: 'MD approval only', d: 'Vendor, Purchase Indent and PO are now approved by the MD only. No other approver is needed.' },
      { i: '🔢', t: 'Automatic codes', d: 'Vendor code and Item code are now 6-digit numbers given by the system. The vendor code comes when the MD approves.' },
      { i: '🏢', t: 'Simpler vendor form', d: 'No OTP now. GSTIN and PAN are checked automatically, so wrong entries are caught at once.' },
      { i: '📋', t: 'Clear approval table', d: 'The approval channel is now a simple table: name, role, status, date and time.' },
      { i: '📦', t: 'Post GRN (MIGO)', d: 'Receiving goods is now shown as Post GRN (MIGO).' }
    ] },
    { id: '2026-11-16', date: '16 Nov 2026', title: 'What\'s new in Port Energy ERP', items: [
      { i: '🔔', t: 'Notifications with sound', d: 'Approvals, status changes and team chat now alert you on phone, web and laptop, with sound. Tap Allow when asked, once.' },
      { i: '🎂', t: 'Birthday and festival wishes', d: 'The sign-in page wishes colleagues on their birthday and on festivals like Pongal and Diwali. Please add your date of birth when asked, one time only.' },
      { i: '👥', t: 'My Team', d: 'Pick your regular team members once under System > My Team, so you can choose them quickly when assigning or sharing work.' },
      { i: '⚡', t: 'Faster and steadier', d: 'Slow server moments are retried automatically, so screens hang less.' },
      { i: '🎨', t: 'Cleaner home screen', d: 'The home banner is now calm and plain, with no moving effects.' }
    ] }
  ];
  var KEY = 'pe_rel_seen';
  function P() { return window.PE; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(list) {
    if (document.getElementById('peWhatsNew')) return;
    var rel = list || RELEASES.slice(0, 1);
    var b = document.createElement('div'); b.id = 'peWhatsNew';
    b.style.cssText = 'position:fixed;inset:0;z-index:99997;background:rgba(10,16,48,.55);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.45 system-ui,sans-serif';
    var h = '<div style="background:#fff;color:#14205E;border-radius:20px;max-width:420px;width:100%;max-height:86vh;overflow:auto;padding:20px 18px;box-shadow:0 24px 60px rgba(0,0,0,.4)">';
    rel.forEach(function (r) {
      h += '<div style="font-weight:800;font-size:19px">' + esc(r.title) + '</div><div style="color:#7A86B0;font-size:12px;margin:2px 0 12px">Updated ' + esc(r.date) + '</div>';
      r.items.forEach(function (x) { h += '<div style="display:flex;gap:11px;margin:0 0 12px"><div style="font-size:24px;line-height:1.1">' + x.i + '</div><div><b>' + esc(x.t) + '</b><div style="color:#4a557f;font-size:14px">' + esc(x.d) + '</div></div></div>'; });
    });
    h += '<button id="peWnOk" style="width:100%;margin-top:6px;background:linear-gradient(100deg,#0084F0,#F0006C);color:#fff;border:0;border-radius:12px;padding:12px;font-weight:700;font-size:15px">Got it</button></div>';
    b.innerHTML = h; document.body.appendChild(b);
    document.getElementById('peWnOk').onclick = function () { try { localStorage.setItem(KEY, RELEASES[0].id); } catch (x) { } b.remove(); };
  }
  function check() {
    var p = P(); if (!p || !p.S || !p.S.sess) return;
    var seen = ''; try { seen = localStorage.getItem(KEY) || ''; } catch (x) { }
    if (seen === RELEASES[0].id) return;
    if (document.getElementById('pePushBar')) return setTimeout(check, 4000);   // let the notification question come first
    setTimeout(function () { if (!document.getElementById('pePushBar') && !document.getElementById('peDob')) show(); else setTimeout(check, 4000); }, 3500);
  }
  var prev = window.PE_NAV;
  window.PE_NAV = function () { if (prev) try { prev(); } catch (x) { } check(); };
  window.PE_WHATSNEW = { show: show, releases: RELEASES };
})();
