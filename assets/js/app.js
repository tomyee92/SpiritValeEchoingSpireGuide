/* Echoing Spire climb sheet.
 *
 * Everything about a boss is visible on its row - element (icon + % chips,
 * matching the source guide), damage-type split, attack pacing, gear prep,
 * and every status tag. The only thing still behind a point/tap is what a
 * single status tag (Silence, Curse, Blind, ...) actually does - .tag-hot.
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

  /* ---------- always-visible skill/element info, middle-bottom ---------- */

  // One chip per element: its own icon (self-hosted, same set the source
  // site uses) plus its damage-share number - not a single blended bar,
  // which got unreadable once a boss had 4+ elements.
  function elementChips(elements) {
    return elements.map(function (e) {
      return '<span class="el-chip"><img class="el-icon" src="assets/img/elements/' + esc(e[0]) +
        '.webp" alt="" width="14" height="14" loading="lazy">' + e[1] + "</span>";
    }).join("");
  }

  // Every skill the boss actually casts, scraped from its monster page, each
  // tagged with the skill's own element (from the skill's own page) - this is
  // what actually predicts what element you'll get hit by next, not a single
  // "X% auto-attack" composite that told you nothing you could act on.
  function skillChips(b) {
    return b.skills.map(function (sk) {
      var title = sk.name + (sk.lv ? " · Lv " + sk.lv : "");
      var effects = sk.applies.length ? sk.applies.join(", ") : "No status effect.";
      var body = sk.element + " " + sk.dmgType + " skill. " + effects;
      return '<button type="button" class="tag-hot tag skill-chip" data-tip-title="' + esc(title) +
        '" data-tip-body="' + esc(body) + '">' +
        '<img class="skill-el-icon" src="assets/img/elements/' + esc(sk.element) +
        '.webp" alt="' + esc(sk.element) + '" width="20" height="20" loading="lazy">' +
        esc(sk.name) + "</button>";
    }).join("");
  }

  // The source site's "combat card" - Max HP, ATK/MATK, DEF/MDEF (+flat),
  // Hit/Flee, attack interval - only ever showed on hover there. Scraped
  // once and stored in bosses.js as `combat`; shown here as small chips so
  // it never needs a hover at all.
  function combatChips(c) {
    return [
      ["HP", c.hp], ["ATK", c.atk], ["MATK", c.matk],
      ["DEF", c.def + "+" + c.defFlat], ["MDEF", c.mdef + "+" + c.mdefFlat],
      ["Hit", c.hit], ["Flee", c.flee], ["SPD", c.atkSpeed]
    ].map(function (p) {
      return '<span class="cstat"><b>' + p[0] + "</b>" + esc(String(p[1])) + "</span>";
    }).join("");
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

  // Three zones per boss row:
  //   left:          icon, floor tag, name
  //   middle-top:    type, level, DEF/MDEF, combat stats, status tags
  //   middle-bottom: element, and every skill the boss casts (own element each)
  //   right:         Prepare - and where future notes/tips go
  // A floor with two bosses repeats its number, so every block stands alone.
  $("#list").innerHTML = floors.map(function (f) {
    return f.bosses.map(function (b, j) {
      return '<div class="boss' + (j === 0 ? " is-newfloor" : "") + '" data-def="' + b.def + '"' +
          (j === 0 ? ' id="floor-' + f.floor + '"' : "") + '>' +

        '<div class="b-id">' +
          '<span class="floor-badge" style="--depth:' + ((f.floor - 5) / 96).toFixed(2) + '">' +
            '<b>' + f.floor + "</b>" +
          "</span>" +
          iconHTML(b, "row-icon", 48) +
          '<span class="b-name">' + esc(b.name) + "</span>" +
        "</div>" +

        '<div class="b-mid">' +
          '<div class="b-mid-top">' +
            '<div class="b-head-row">' +
              '<span class="b-type">' + esc(b.combat.type) + "</span>" +
              '<span class="b-lv">LV ' + b.level + "</span>" +
              '<span class="pill pill-' + b.def.toLowerCase() + '">' + b.def + "</span>" +
            "</div>" +
            '<div class="cstats">' + combatChips(b.combat) + "</div>" +
            '<div class="b-tags">' + ccTags(b) + "</div>" +
          "</div>" +
          '<div class="b-mid-bottom">' +
            '<div class="stat"><span class="stat-label">Element</span>' +
              '<div class="el-chips">' + elementChips(b.elements) + "</div></div>" +
            '<div class="stat"><span class="stat-label">Skills</span>' +
              '<div class="skill-chips">' + skillChips(b) + "</div></div>" +
          "</div>" +
        "</div>" +

        '<div class="b-side">' +
          '<span class="stat-label">Prepare</span>' +
          '<span class="stat-prep-text">' + esc(b.prepare) + "</span>" +
          (b.reflect ? '<div class="reflect-note">⚠ ' + esc(b.reflect) + "</div>" : "") +
          '<div class="b-side-more">More notes and tips coming soon.</div>' +
        "</div>" +

      "</div>";
    }).join("");
  }).join("");

  /* meta blocks */
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

    tip.innerHTML = miniTipHTML(el);
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
  var TARGET_SEL = ".tag-hot";

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
