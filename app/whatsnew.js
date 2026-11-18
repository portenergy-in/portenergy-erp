/* © 2026 Port Energy Private Limited. All rights reserved.
   PORT ENERGY ERP - "What's new": after an update, every employee sees once what changed and how it helps them.
   TO ADD A RELEASE: put a new object at the TOP of RELEASES (new id, date, items). Old ones stay for the history list. */
(function () {
  'use strict';
  var RELEASES = [
    { id: '2026-11-18c', date: '18 Nov 2026', title: 'Quotation Comparison: faster and clearer', items: [
      { i: '📄', t: 'Extract from PDF', d: 'Choose the vendor, tap Extract from PDF and attach the quotation. Items, HSN, quantity, rate and GST fill in for you.' },
      { i: '🚚', t: 'Freight and landed cost', d: 'Enter freight / P&F for each vendor. L1 is now decided on the final cost: basic + GST + freight.' },
      { i: '📋', t: 'Pull items from an Indent', d: 'Tap Pull items from Indent, choose an approved PR and its items, HSN and quantity load into the comparison.' },
      { i: '📊', t: 'Paste rates from Excel', d: 'Copy a rate column in Excel, click the first rate cell and press Ctrl+V. All rows below fill together.' }
    ] },
    { id: '2026-11-18b', date: '18 Nov 2026', title: 'New: Vendor Quotations register', items: [
      { i: '🗂️', t: 'Every vendor quotation in one place', d: 'Enter each quotation with its vendor quotation number, offer ref, validity, sections, items, rates, terms and the PDF.' },
      { i: '🔁', t: 'Offers and revisions', d: 'A vendor can send offer A, B and C. Each is saved separately and the newest offer is marked Latest.' },
      { i: '✨', t: 'AI fills it', d: 'Attach the PDF in PEPL AI and say: enter this quotation. It reads vendor, offer ref, sections and rates.' },
      { i: '⚖️', t: 'Compare and order', d: 'In Quotation Comparison tap Fill rates from quotations. From a quotation you can create the PO or add new items to the Item master.' }
    ] },
    { id: '2026-11-18', date: '18 Nov 2026', title: 'Quotations: same vendor, sections', items: [
      { i: '📑', t: 'Many offers from one vendor', d: 'Put the same vendor in two columns of a Quotation Comparison. Give each column its own offer ref, for example 5403-B and 5403-C.' },
      { i: '🧱', t: 'Sections with subtotals', d: 'Add a Section to each line, for example Hot Dip or Machinery. The comparison, the PO and the printouts show a heading and a subtotal for each section.' },
      { i: '🏆', t: 'PO from the right offer', d: 'Create PO from L1 now picks the winning offer and keeps its sections.' }
    ] },
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
    h += '<button id="peWnOk" style="width:100%;margin-top:6px;background:linear-gradient(100deg,#0084F0,#F0006C);color:#fff;border:0;border-radius:12px;padding:12px;font-weight:700;font-size:15px">Got it</button><button id="peWnAll" style="width:100%;margin-top:8px;background:#fff;color:#0084F0;border:0;font-weight:700;font-size:14px;padding:8px">See all updates and how to use them</button></div>';
    b.innerHTML = h; document.body.appendChild(b);
    document.getElementById('peWnOk').onclick = function () { try { localStorage.setItem(KEY, RELEASES[0].id); } catch (x) { } b.remove(); try { navItem(); } catch (x) { } };
    document.getElementById('peWnAll').onclick = function () { b.remove(); try { P().go({ v: 'whatsnew' }); } catch (x) { } };
  }
  function check() {
    var p = P(); if (!p || !p.S || !p.S.sess) return;
    var seen = ''; try { seen = localStorage.getItem(KEY) || ''; } catch (x) { }
    if (seen === RELEASES[0].id) return;
    if (document.getElementById('pePushBar')) return setTimeout(check, 4000);   // let the notification question come first
    setTimeout(function () { if (!document.getElementById('pePushBar') && !document.getElementById('peDob')) show(); else setTimeout(check, 4000); }, 3500);
  }
  var HOW = {
    '2026-11-18c': { go: { v: 'list', k: 'quotes' }, goLabel: 'Open Quotation Comparison', steps: ['Open Quotation Comparison and tap New. Pick the vendors in the columns.', 'Tap Pull items from Indent to load items from an approved PR, or add the lines by hand.', 'Tap Extract from PDF for each vendor and attach that vendor quotation. Check the rates it filled.', 'Or copy a rate column from Excel, click the first rate cell for that vendor and press Ctrl+V.', 'Type each vendor freight / P&F. The summary shows the final cost and marks L1.', 'Save, then create the PO from L1.'] },
    '2026-11-18b': { go: { v: 'list', k: 'vq' }, goLabel: 'Open Vendor Quotations', steps: ['Open Procurement > Vendor Quotations and tap New.', 'Pick the vendor, type the vendor quotation number and the offer ref, for example 5403-C.', 'Add the items with Section, quantity and rate. Or attach the PDF in PEPL AI and say: enter this quotation.', 'Press Save. A newer offer from the same vendor and subject becomes the latest.', 'In Quotation Comparison pick the vendors, type the offer ref if needed, then tap Fill rates from quotations.', 'Open a quotation to create the PO from it, or add its new items to the Item master.'] },
    '2026-11-18': { go: { v: 'list', k: 'quotes' }, goLabel: 'Open Quotation Comparison', steps: ['Open Procurement > Quotation Comparison and tap New.', 'Pick the vendors. The same vendor can sit in two columns: give each column its own offer ref, for example 5403-B and 5403-C.', 'Type a Section on each line, for example Hot Dip or Machinery, then enter the rates.', 'Save. The comparison, the print and the PO show a heading and a subtotal for every section.', 'Create PO from L1 keeps the winning offer and its sections.'] },
    '2026-11-17c': { steps: ['Tap the PEPL AI button.', 'Attach a quotation, invoice or GST certificate.', 'Type what you need, for example: fill this vendor form.', 'Watch the form fill. Check it, then press Save. The AI never saves for you.'] },
    '2026-11-17b': { steps: ['Open PEPL AI and attach the document.', 'Say what to fill. The AI reads it and opens the right form.', 'Check every field, then press Save.'] },
    '2026-11-16': { steps: ['Tap Allow when the app asks about notifications, one time.', 'Open System > My Team and tick your regular team members.', 'Add your date of birth when asked, one time only.'] }
  };
  function pageSeen() { try { localStorage.setItem(KEY, RELEASES[0].id); } catch (x) { } }
  function isNew() { var s = ''; try { s = localStorage.getItem(KEY) || ''; } catch (x) { } return s !== RELEASES[0].id; }
  function page(v) {
    P().setTitle('What\'s new', 'Every update to Port Energy ERP');
    var h = '<div class="glass panel" style="max-width:780px"><p class="note" style="margin-top:0">All updates, newest first. Tap an update to see what changed and how to use it.</p>';
    RELEASES.forEach(function (r, i) {
      var w = HOW[r.id] || {};
      h += '<details style="border:1px solid #E2E8F5;border-radius:14px;padding:12px 14px;margin:0 0 10px;background:#fff"' + (i === 0 ? ' open' : '') + '><summary style="cursor:pointer"><b style="font-size:16px">' + esc(r.title) + '</b>' + (i === 0 ? ' <span class="badge b-ok">Latest</span>' : '') + '<div class="note">' + esc(r.date) + '</div></summary><div style="margin-top:12px">';
      r.items.forEach(function (x) { h += '<div style="display:flex;gap:11px;margin:0 0 10px"><div style="font-size:22px;line-height:1.1">' + x.i + '</div><div><b>' + esc(x.t) + '</b><div class="note">' + esc(x.d) + '</div></div></div>'; });
      if (w.steps) h += '<div style="background:#F3F6FF;border-radius:12px;padding:10px 14px;margin-top:6px"><b>How to use</b><ol style="margin:6px 0 0;padding-left:20px">' + w.steps.map(function (s) { return '<li style="margin:3px 0">' + esc(s) + '</li>'; }).join('') + '</ol>' + (w.go ? '<button class="btn primary" style="margin-top:10px" data-go="' + esc(JSON.stringify(w.go)) + '">' + esc(w.goLabel || 'Open') + '</button>' : '') + '</div>';
      h += '</div></details>';
    });
    v.innerHTML = h + '</div>';
    v.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { try { P().go(JSON.parse(b.dataset.go)); } catch (x) { } }; });
    pageSeen();
  }
  window.PE_VIEWS = window.PE_VIEWS || {};
  window.PE_VIEWS.whatsnew = page;
  function navItem() {
    var p = P(); if (!p || !p.$) return; var nav = p.$('nav'); if (!nav) return;
    var g = nav.querySelector('.ng[data-g="System"]'); var box = g && g.querySelector('.items > div'); if (!box) return;
    var old = box.querySelector('[data-v="whatsnew"]'); if (old) old.remove();
    var b = document.createElement('button'); b.className = 'ni'; b.dataset.v = 'whatsnew';
    b.innerHTML = p.icon('pulse') + 'What\'s new' + (isNew() ? '<span class="tc" style="background:#F0006C;color:#fff;border-radius:8px;padding:1px 7px">NEW</span>' : '');
    b.onclick = function () { p.closeSide(); p.go({ v: 'whatsnew' }); };
    box.insertBefore(b, box.firstChild);
  }
  var prev = window.PE_NAV;
  window.PE_NAV = function () { if (prev) try { prev(); } catch (x) { } try { navItem(); } catch (x) { } check(); };
  window.PE_WHATSNEW = { show: show, releases: RELEASES };
})();
