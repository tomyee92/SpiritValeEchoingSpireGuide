/* Echoing Spire climb sheet.
 *
 * Each row has two independent hover/tap targets:
 *  - .b-main  (icon, name, level, DEF/MDEF pill) -> the full combat card:
 *    damage split, element resist, attack pacing, gear prep.
 *  - .tag-hot (each Silence/Freeze/Stun/Curse/debuff tag, always visible
 *    on the row - not hidden) -> a small tooltip with just that effect's
 *    duration/chance and what it does to you.
 */
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

  /* ---------- effect knowledge: what each tag's tooltip says ---------- */

  var CC_RANK = { Freeze: 4, Silence: 3, Stun: 2 };

  var CC_INFO = {
    Silence: "Priests can't heal while silenced.",
    Freeze: "Frozen = cannot act.",
    Stun: "Interrupts whatever you're doing."
  };

  var DEBUFF_INFO = {
    Curse: "Your heals damage you while it's active — the priest trap.",
    Blind: "Reduces your chance to land hits.",
    Vulnerability: "You take increased damage.",
    Weaken: "Reduces your own damage output.",
    Slow: "Reduces your movement speed.",
    Stagger: "Interrupts your current action.",
    Marked: "Flags you as a priority target for follow-up damage.",
    "Magic Exposure": "Increases Magic damage you take.",
    "Fire Exposure": "Increases Fire damage you take.",
    "Water Exposure": "Increases Water damage you take.",
    "Wind Exposure": "Increases Wind damage you take.",
    "Earth Exposure": "Increases Earth damage you take.",
    "Undead Exposure": "Increases damage you take from Undead sources."
  };

  function hasCurse(b) { return b.deb.indexOf("Curse") !== -1; }

  // Some Echo Masters (floor 101) have no icon on the source site either -
  // its own <img> tags for them 404. Fall back to a plain monogram so layout
  // stays aligned instead of guessing at an image that doesn't exist.
  function iconHTML(b, cls, size) {
    if (b.icon) {
      return '<img class="' + cls + '" src="' + esc(b.icon) + '" alt="" width="' + size + '" height="' + size + '" loading="lazy">';
    }
    var initials = b.name.split(" ").filter(function (w) { return w[0] === w[0].toUpperCase(); })
      .map(function (w) { return w[0]; }).join("").slice(0, 2);
    return '<span class="' + cls + ' icon-fallback" aria-hidden="true">' + esc(initials) + "</span>";
  }

  /* ---------- always-visible status tags on the row ---------- */

  function ccTags(b) {
    var byType = {};
    b.cc.forEach(function (c) {
      var t = c[0];
      if (!byType[t] || c[2] > byType[t][2]) byType[t] = c;
    });
    var tags = Object.keys(byType)
      .sort(function (a, c) { return (CC_RANK[c] || 0) - (CC_RANK[a] || 0); })
      .map(function (t) {
        var c = byType[t];
        var title = t + " " + c[1] + " · " + c[2] + "%";
        var body = t + " — " + c[1] + " at " + c[2] + "% per landed cast. " + (CC_INFO[t] || "");
        return tagHot("cc cc-" + t.toLowerCase(), title, title, body);
      });

    b.deb.forEach(function (d) {
      var title = d;
      var body = DEBUFF_INFO[d] ? d + " — " + DEBUFF_INFO[d] : d + " — applied by this boss.";
      var cls = d === "Curse" ? "cc cc-curse" : "tag";
      tags.push(tagHot(cls, title, title, body));
    });

    b.dot.forEach(function (d) {
      var title = d[0] + " " + d[1];
      var body = d[0] + " — ticks damage over " + d[1] + ".";
      tags.push(tagHot("tag", title, title, body));
    });

    if (!tags.length) return '<span class="none">No hard CC, no Curse</span>';
    return tags.join("");
  }

  function tagHot(cls, label, title, body) {
    return '<button type="button" class="tag-hot ' + cls + '" data-tip-title="' + esc(title) +
      '" data-tip-body="' + esc(body) + '">' + esc(label) + "</button>";
  }

  /* ---------- full combat card (hover the icon/name area) ---------- */

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

  function fullCardHTML(b) {
    var pace = '<div class="tip-sec"><h4>Attack pattern</h4><ul>' +
      "<li>" + b.autoPct + "% of output is auto-attack</li>" +
      "<li>~" + b.swings + " swings per 60s</li></ul></div>";

    var notes = b.notes
      ? '<div class="notes-slot" style="border-style:solid;color:var(--ink-2)">' + esc(b.notes) + "</div>"
      : '<div class="notes-slot">No strategy notes yet.</div>';

    return '<div class="tip-head">' +
        iconHTML(b, "tip-icon", 52) +
        '<div class="tip-title"><h3>' + esc(b.name) + "</h3>" +
        '<span class="pill pill-' + b.def.toLowerCase() + '">' + b.def + "</span>" +
        '<span class="lv">F' + b.floor + " · LV " + b.level + "</span></div>" +
      "</div>" +
      mixBar(b) + elementBar(b) + pace +
      '<div class="tip-sec"><p class="prepare">Prepare: ' + esc(b.prepare) +
        (b.multi ? "<em>* Element spread is too wide to fully resist — lean on raw mitigation instead of chasing a resist set.</em>" : "") +
      "</p>" + notes + "</div>";
  }

  function miniTipHTML(btn) {
    return '<div class="tip-mini"><h4>' + esc(btn.dataset.tipTitle) + "</h4><p>" +
      esc(btn.dataset.tipBody) + "</p></div>";
  }

  /* ---------- render rows ---------- */

  var floors = [];
  BOSSES.forEach(function (b, i) {
    b._i = i;
    var f = floors[floors.length - 1];
    if (!f || f.floor !== b.floor) { f = { floor: b.floor, level: b.level, bosses: [] }; floors.push(f); }
    f.bosses.push(b);
  });

  // One block per boss, in climb order: F5 › boss › swap call, then its
  // status tags on the line below. A floor with two bosses repeats its
  // number, so every block stands on its own.
  $("#list").innerHTML = floors.map(function (f) {
    return f.bosses.map(function (b, j) {
      return '<div class="boss' + (j === 0 ? " is-newfloor" : "") + '" data-def="' + b.def + '"' +
          (j === 0 ? ' id="floor-' + f.floor + '"' : "") + '>' +
        '<button type="button" class="b-main" data-i="' + b._i + '" aria-describedby="tip">' +
          '<span class="f-tag">F' + f.floor + "</span>" +
          iconHTML(b, "row-icon", 48) +
          '<span class="b-name">' + esc(b.name) + "</span>" +
          '<span class="b-lv">LV ' + b.level + "</span>" +
          '<span class="pill pill-' + b.def.toLowerCase() + '">' + b.def + "</span>" +
        "</button>" +
        '<div class="b-tags">' + ccTags(b) + "</div>" +
      "</div>";
    }).join("");
  }).join("");

  /* meta blocks */
  $("#build").textContent = DATA.meta.gameBuild;
  $("#src").href = DATA.meta.source;

  /* ---------- tooltip behaviour (shared by both target types) ---------- */

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

    var x = anchorRect.right + GAP;
    if (x + w > vw - 10) x = anchorRect.left - GAP - w;
    if (x < 10) x = Math.max(10, Math.min(vw - w - 10, anchorRect.left));

    var y = anchorRect.top + anchorRect.height / 2 - h / 2;
    y = Math.max(10, Math.min(vh - h - 10, y));

    tip.style.left = Math.round(x) + "px";
    tip.style.top = Math.round(y) + "px";
  }

  function show(el) {
    cancelHide();
    if (current === el) return;
    hide();
    current = el;

    var mainBtn = el.closest(".b-main");
    if (mainBtn) {
      tip.innerHTML = fullCardHTML(BOSSES[+mainBtn.dataset.i]);
      tip.classList.remove("tip--mini");
    } else {
      tip.innerHTML = miniTipHTML(el);
      tip.classList.add("tip--mini");
    }

    tip.classList.add("is-on");
    tip.setAttribute("aria-hidden", "false");
    el.classList.add("is-active");
    place(el.getBoundingClientRect());
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
  var TARGET_SEL = ".b-main, .tag-hot";

  // Touch browsers fire a synthetic mouseover right before click on first tap.
  // If both hover and click-toggle are wired unconditionally, that mouseover
  // opens the card and the very same tap's click then toggles it straight shut
  // - the card flashes and looks like it never appeared. Fix: pick ONE input
  // mode. Real hover (mouse/trackpad) gets hover behaviour; everything else
  // (touch, or a browser that can't tell) gets tap-to-toggle.
  var supportsHover = !window.matchMedia || matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsHover) {
    list.addEventListener("mouseover", function (e) {
      var el = e.target.closest(TARGET_SEL);
      if (el) show(el);
    });

    // Leaving a target closes its card — unless the cursor is heading into
    // the card itself, so a tall full-card stays readable and scrollable.
    list.addEventListener("mouseout", function (e) {
      var el = e.target.closest(TARGET_SEL);
      if (!el || el.contains(e.relatedTarget)) return;
      if (e.relatedTarget && tip.contains(e.relatedTarget)) return;
      scheduleHide();
    });

    tip.addEventListener("mouseenter", cancelHide);
    tip.addEventListener("mouseleave", scheduleHide);
  } else {
    // Touch: tap a target to open, tap it again (or elsewhere) to close.
    list.addEventListener("click", function (e) {
      var el = e.target.closest(TARGET_SEL);
      if (!el) return;
      e.preventDefault();
      if (current === el) hide(); else show(el);
    });

    document.addEventListener("click", function (e) {
      if (current && !e.target.closest(TARGET_SEL) && !tip.contains(e.target)) hide();
    });
  }

  // Keyboard focus always opens/closes the card, regardless of pointer type.
  list.addEventListener("focusin", function (e) {
    var el = e.target.closest(TARGET_SEL);
    if (el) show(el);
  });
  list.addEventListener("focusout", function (e) {
    var el = e.target.closest(TARGET_SEL);
    if (el) hide();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  window.addEventListener("scroll", function () {
    if (current) place(current.getBoundingClientRect());
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (current) place(current.getBoundingClientRect());
  });
})();
