/* Echoing Spire climb sheet.
 * Rows carry only name + armor call; the full combat card is a hover tooltip
 * (tap on touch, focus for keyboard). */
(function () {
  "use strict";

  var DATA = window.SPIRE_DATA;
  if (!DATA) return;

  var BOSSES = DATA.bosses;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };

  /* ---------- tooltip content ---------- */

  var CC_RANK = { Freeze: 4, Silence: 3, Stun: 2 };

  function hasCurse(b) { return b.deb.indexOf("Curse") !== -1; }

  function elementBar(b) {
    var bar = b.elements.map(function (e) {
      return '<span style="width:' + e[1] + '%;background:var(--el-' + e[0] + ',var(--ink-3))"></span>';
    }).join("");
    var legend = b.elements.map(function (e) {
      return '<i style="--sw:var(--el-' + e[0] + ',var(--ink-3))">' + esc(e[0]) + " " + e[1] + "</i>";
    }).join("");
    return '<div class="tip-sec"><h4>Element</h4><div class="bar">' + bar +
      '</div><div class="legend">' + legend + "</div></div>";
  }

  function mixBar(b) {
    var parts = [
      ["Mel", b.mix.mel, "var(--def)"],
      ["Ran", b.mix.ran, "var(--def)"],
      ["Mag", b.mix.mag, "var(--mdef)"]
    ].filter(function (p) { return p[1] > 0; });

    var bar = parts.map(function (p) {
      return '<span style="width:' + p[1] + "%;background:" + p[2] +
        (p[0] === "Ran" ? ";opacity:.6" : "") + '"></span>';
    }).join("");
    var legend = parts.map(function (p) {
      return '<i style="--sw:' + p[2] + '">' + p[0] + " " + p[1] + "</i>";
    }).join("");

    var phys = b.mix.mel + b.mix.ran;
    var call = phys > b.mix.mag ? phys + "% blocked by DEF" : b.mix.mag + "% blocked by MDEF";

    return '<div class="tip-sec"><h4>Damage type · ' + call + '</h4><div class="bar">' + bar +
      '</div><div class="legend">' + legend + "</div></div>";
  }

  function threatSec(b) {
    var byType = {};
    b.cc.forEach(function (c) {
      var t = c[0];
      if (!byType[t] || c[2] > byType[t][2]) byType[t] = c;
    });
    var out = Object.keys(byType)
      .sort(function (a, c) { return (CC_RANK[c] || 0) - (CC_RANK[a] || 0); })
      .map(function (t) {
        var c = byType[t];
        return '<span class="cc cc-' + t.toLowerCase() + '">' + esc(t) + " " + esc(c[1]) + " · " + c[2] + "%</span>";
      });
    if (hasCurse(b)) out.push('<span class="cc cc-curse">Curse</span>');
    if (!out.length) return '<div class="tip-sec"><h4>Watch out for</h4><ul><li>No hard CC, no Curse.</li></ul></div>';
    return '<div class="tip-sec"><h4>Watch out for</h4><div class="tags">' + out.join("") + "</div></div>";
  }

  function ccList(b) {
    if (!b.cc.length) return "";
    return '<div class="tip-sec"><h4>Every crowd control</h4><ul>' + b.cc.map(function (c) {
      return "<li>" + esc(c[0]) + " — " + esc(c[1]) + " at " + c[2] + "% per landed cast</li>";
    }).join("") + "</ul></div>";
  }

  function tagSec(title, items, curseAware) {
    if (!items.length) return "";
    var body = items.map(function (t) {
      var label = Array.isArray(t) ? t[0] + " · " + t[1] : t;
      var cls = curseAware && t === "Curse" ? "tag is-curse" : "tag";
      return '<span class="' + cls + '">' + esc(label) + "</span>";
    }).join("");
    return '<div class="tip-sec"><h4>' + esc(title) + '</h4><div class="tags">' + body + "</div></div>";
  }

  function tipHTML(b) {
    var pace = '<div class="tip-sec"><h4>Attack pattern</h4><ul>' +
      "<li>" + b.autoPct + "% of output is auto-attack</li>" +
      "<li>~" + b.swings + " swings per 60s</li></ul></div>";

    var notes = b.notes
      ? '<div class="notes-slot" style="border-style:solid;color:var(--ink-2)">' + esc(b.notes) + "</div>"
      : '<div class="notes-slot">No strategy notes yet.</div>';

    return '<div class="tip-head">' +
        "<h3>" + esc(b.name) + "</h3>" +
        '<span class="pill pill-' + b.def.toLowerCase() + '">' + b.def + "</span>" +
        '<span class="lv">F' + b.floor + " · LV " + b.level + "</span>" +
      "</div>" +
      threatSec(b) + mixBar(b) + elementBar(b) + ccList(b) +
      tagSec("DoTs", b.dot) + tagSec("Debuffs", b.deb, true) + pace +
      '<div class="tip-sec"><p class="prepare">Prepare: ' + esc(b.prepare) +
        (b.multi ? "<em>* Element spread is too wide to fully resist — lean on raw mitigation instead of chasing a resist set.</em>" : "") +
      "</p>" + notes + "</div>";
  }

  /* ---------- render rows ---------- */

  var floors = [];
  BOSSES.forEach(function (b, i) {
    b._i = i;
    var f = floors[floors.length - 1];
    if (!f || f.floor !== b.floor) { f = { floor: b.floor, level: b.level, bosses: [] }; floors.push(f); }
    f.bosses.push(b);
  });

  // One line per boss, in climb order: F5 › boss › swap call.
  // A floor with two bosses simply repeats its number, so every line stands alone.
  $("#list").innerHTML = floors.map(function (f) {
    return f.bosses.map(function (b, j) {
      return '<button type="button" class="boss' + (j === 0 ? " is-newfloor" : "") +
          '" data-def="' + b.def + '" data-i="' + b._i + '"' +
          (j === 0 ? ' id="floor-' + f.floor + '"' : "") + ' aria-describedby="tip">' +
        '<span class="f-tag">F' + f.floor + "</span>" +
        '<span class="b-name">' + esc(b.name) + "</span>" +
        '<span class="b-lv">LV ' + b.level + "</span>" +
        '<span class="pill pill-' + b.def.toLowerCase() + '">' + b.def + "</span>" +
      "</button>";
    }).join("");
  }).join("");

  /* meta blocks */
  $("#build").textContent = DATA.meta.gameBuild;
  $("#src").href = DATA.meta.source;

  /* ---------- tooltip behaviour ---------- */

  var tip = $("#tip");
  var current = null;
  var GAP = 12;
  var hideTimer = null;

  function cancelHide() { clearTimeout(hideTimer); hideTimer = null; }
  function scheduleHide() { cancelHide(); hideTimer = setTimeout(hide, 130); }

  function place(anchorRect) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var r = tip.getBoundingClientRect();
    var w = r.width, h = r.height;

    // Prefer the right of the row; fall back to the left; then clamp inside.
    var x = anchorRect.right + GAP;
    if (x + w > vw - 10) x = anchorRect.left - GAP - w;
    if (x < 10) x = Math.max(10, Math.min(vw - w - 10, anchorRect.left));

    // Vertically centre on the row, clamped to the viewport.
    var y = anchorRect.top + anchorRect.height / 2 - h / 2;
    y = Math.max(10, Math.min(vh - h - 10, y));

    tip.style.left = Math.round(x) + "px";
    tip.style.top = Math.round(y) + "px";
  }

  function show(btn) {
    cancelHide();
    if (current === btn) return;
    hide();
    current = btn;
    tip.innerHTML = tipHTML(BOSSES[+btn.dataset.i]);
    tip.classList.add("is-on");
    tip.setAttribute("aria-hidden", "false");
    btn.classList.add("is-active");
    place(btn.getBoundingClientRect());
  }

  function hide() {
    cancelHide();
    if (current) current.classList.remove("is-active");
    tip.scrollTop = 0;
    current = null;
    tip.classList.remove("is-on");
    tip.setAttribute("aria-hidden", "true");
  }

  var list = $("#list");

  list.addEventListener("mouseover", function (e) {
    var btn = e.target.closest(".boss");
    if (btn) show(btn);
  });

  // Leaving a row closes the card — unless the cursor is heading into the card
  // itself, so tall ones stay readable and scrollable.
  list.addEventListener("mouseout", function (e) {
    var btn = e.target.closest(".boss");
    if (!btn || btn.contains(e.relatedTarget)) return;
    if (e.relatedTarget && tip.contains(e.relatedTarget)) return;
    scheduleHide();
  });

  tip.addEventListener("mouseenter", cancelHide);
  tip.addEventListener("mouseleave", scheduleHide);

  // Keyboard: focus opens, blur closes.
  list.addEventListener("focusin", function (e) {
    var btn = e.target.closest(".boss");
    if (btn) show(btn);
  });
  list.addEventListener("focusout", function (e) {
    var btn = e.target.closest(".boss");
    if (btn) hide();
  });

  // Touch / click: toggle, since there is no hover.
  list.addEventListener("click", function (e) {
    var btn = e.target.closest(".boss");
    if (!btn) return;
    e.preventDefault();
    if (current === btn) hide(); else show(btn);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  // Dismiss on outside tap (touch devices).
  document.addEventListener("click", function (e) {
    if (current && !e.target.closest(".boss") && !tip.contains(e.target)) hide();
  });

  window.addEventListener("scroll", function () {
    if (current) place(current.getBoundingClientRect());
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (current) place(current.getBoundingClientRect());
  });
})();
