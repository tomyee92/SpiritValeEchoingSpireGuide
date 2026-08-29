/* Echoing Spire climb sheet — renders window.SPIRE_DATA into floor blocks. */
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

  var slug = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"); };

  /* ---------- derived helpers ---------- */

  // Worst CC on a boss, for the at-a-glance threat row: longest lockout first.
  var CC_RANK = { Freeze: 4, Silence: 3, Stun: 2 };

  function ccSummary(b) {
    var byType = {};
    b.cc.forEach(function (c) {
      var t = c[0];
      if (!byType[t] || c[2] > byType[t][2]) byType[t] = c;
    });
    return Object.keys(byType)
      .sort(function (a, c) { return (CC_RANK[c] || 0) - (CC_RANK[a] || 0); })
      .map(function (t) { return byType[t]; });
  }

  function hasCurse(b) { return b.deb.indexOf("Curse") !== -1; }

  function matchesFilter(b, f) {
    if (f === "all") return true;
    if (f === "DEF") return b.def === "DEF";
    if (f === "MDEF") return b.def === "MDEF";
    if (f === "Curse") return hasCurse(b);
    return b.cc.some(function (c) { return c[0] === f; });
  }

  function floorId(f) { return "floor-" + f; }

  /* ---------- fragments ---------- */

  function elementBar(b) {
    var bar = b.elements.map(function (e) {
      return '<span style="width:' + e[1] + '%;background:var(--el-' + e[0] + ',var(--ink-3))"></span>';
    }).join("");
    var legend = b.elements.map(function (e) {
      return '<i style="--sw:var(--el-' + e[0] + ',var(--ink-3))">' + esc(e[0]) + " " + e[1] + "</i>";
    }).join("");
    return '<div class="b-el"><p class="meter-label">Element</p><div class="bar">' + bar +
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
        (p[0] === "Ran" ? ";opacity:.62" : "") + '"></span>';
    }).join("");
    var legend = parts.map(function (p) {
      return '<i style="--sw:' + p[2] + '">' + p[0] + " " + p[1] + "</i>";
    }).join("");

    var phys = b.mix.mel + b.mix.ran;
    var call = phys > b.mix.mag ? phys + "% blocked by DEF" : b.mix.mag + "% blocked by MDEF";

    return '<div class="b-mix"><p class="meter-label">' + call +
      '</p><div class="bar">' + bar + '</div><div class="legend">' + legend + "</div></div>";
  }

  function threatRow(b) {
    var out = ccSummary(b).map(function (c) {
      return '<span class="cc cc-' + c[0].toLowerCase() + '">' + esc(c[0]) + " " + esc(c[1]) + " · " + c[2] + "%</span>";
    });
    if (hasCurse(b)) out.push('<span class="cc cc-curse">Curse</span>');
    if (!out.length) out.push('<span class="none">no hard CC, no Curse</span>');
    return '<div class="b-threat"><p class="meter-label" style="width:100%">Watch out for</p>' + out.join("") + "</div>";
  }

  function listBlock(title, items, curseAware) {
    if (!items.length) return "";
    var body = items.map(function (t) {
      var label = Array.isArray(t) ? t[0] + " · " + t[1] : t;
      var cls = curseAware && t === "Curse" ? ' class="tag is-curse"' : ' class="tag"';
      return "<span" + cls + ">" + esc(label) + "</span>";
    }).join("");
    return '<div class="dblock"><h4>' + esc(title) + "</h4><div>" + body + "</div></div>";
  }

  function detail(b) {
    var ccBlock = b.cc.length
      ? '<div class="dblock"><h4>Crowd control</h4><ul>' + b.cc.map(function (c) {
          return "<li>" + esc(c[0]) + " — " + esc(c[1]) + " at " + c[2] + "% per landed cast</li>";
        }).join("") + "</ul></div>"
      : '<div class="dblock"><h4>Crowd control</h4><ul><li>None.</li></ul></div>';

    var pace = '<div class="dblock"><h4>Attack pattern</h4><ul>' +
      "<li>" + b.autoPct + "% of output is auto-attack</li>" +
      "<li>~" + b.swings + " swings per 60s</li>" +
      "<li>Level " + b.level + "</li></ul></div>";

    var notes = b.notes
      ? '<div class="notes-slot" style="border-style:solid;color:var(--ink-2)">' + esc(b.notes) + "</div>"
      : '<div class="notes-slot">No strategy notes yet — this is where our own tactics, positioning and gear calls go.</div>';

    var elBlock = '<div class="dblock">' + elementBar(b) + "</div>";

    return '<div class="boss-detail">' +
      '<div class="detail-grid">' + elBlock + ccBlock + listBlock("DoTs", b.dot) +
        listBlock("Debuffs", b.deb, true) + pace +
      "</div>" +
      '<p class="prepare">Prepare: ' + esc(b.prepare) +
        (b.multi ? "<em>* Element spread is too wide to fully resist — lean on raw mitigation instead of chasing a resist set.</em>" : "") +
      "</p>" + notes +
      "</div>";
  }

  function bossCard(b) {
    var pillCls = "pill pill-" + b.def.toLowerCase();
    var resist = b.elements[0][0];
    return '<article class="boss" data-def="' + b.def + '" data-name="' + esc(b.name.toLowerCase()) + '">' +
      '<button class="boss-top" type="button" aria-expanded="false">' +
        '<div class="b-name">' +
          "<h3>" + esc(b.name) + "</h3>" +
          '<div class="b-swap"><span class="' + pillCls + '">' + b.def + "</span>" +
            '<span class="b-sub">resist ' + esc(resist) + (b.multi ? " *" : "") + "</span></div>" +
        "</div>" +
        mixBar(b) + threatRow(b) +
        '<span class="caret" aria-hidden="true">▾</span>' +
      "</button>" +
      detail(b) +
      "</article>";
  }

  /* ---------- render ---------- */

  var floors = [];
  BOSSES.forEach(function (b) {
    var f = floors[floors.length - 1];
    if (!f || f.floor !== b.floor) { f = { floor: b.floor, level: b.level, bosses: [] }; floors.push(f); }
    f.bosses.push(b);
  });

  var listEl = $("#list");
  var railEl = $("#rail");

  function railDot(fb) {
    var defs = fb.map(function (b) { return b.def; });
    if (defs.every(function (d) { return d === "MDEF"; })) return "var(--mdef)";
    if (defs.every(function (d) { return d === "DEF"; })) return "var(--def)";
    return "var(--split)";
  }

  listEl.innerHTML = floors.map(function (f) {
    var count = f.bosses.length;
    return '<section class="floor" id="' + floorId(f.floor) + '" data-floor="' + f.floor + '">' +
      '<div class="floor-head">' +
        '<p class="floor-no">Floor ' + f.floor + " <small>LV " + f.level + "</small></p>" +
        '<p class="floor-meta">' + count + (count > 1 ? " bosses" : " boss") + "</p>" +
      "</div>" +
      '<div class="bosses">' + f.bosses.map(bossCard).join("") + "</div>" +
      "</section>";
  }).join("");

  railEl.innerHTML = floors.map(function (f) {
    return '<li><a href="#' + floorId(f.floor) + '" data-floor="' + f.floor + '">' + f.floor +
      '<span class="dot" style="background:' + railDot(f.bosses) + '"></span></a></li>';
  }).join("");

  /* meta blocks */
  $("#build").textContent = DATA.meta.gameBuild;
  $("#rates").innerHTML = DATA.meta.currency.rates.map(function (r) {
    return "<li><span>" + esc(r.range) + "</span><b>" + esc(r.amount) + "</b></li>";
  }).join("");
  $("#exchange").textContent = DATA.meta.currency.exchange;
  $("#src").href = DATA.meta.source;

  /* threat floor lists */
  $$("[data-floors-for]").forEach(function (el) {
    var kind = el.getAttribute("data-floors-for");
    var hits = [];
    BOSSES.forEach(function (b) {
      var hit = kind === "Curse" ? hasCurse(b) : b.cc.some(function (c) { return c[0] === kind; });
      if (hit && hits.indexOf(b.floor) === -1) hits.push(b.floor);
    });
    el.innerHTML = hits.length
      ? hits.map(function (f) { return '<a href="#' + floorId(f) + '">F' + f + "</a>"; }).join("")
      : "<span>None.</span>";
  });

  /* ---------- interaction ---------- */

  listEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".boss-top");
    if (!btn) return;
    var card = btn.parentNode;
    var open = card.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  var state = { filter: "all", q: "" };

  function apply() {
    var q = state.q.trim().toLowerCase();
    var anyFloor = false;

    $$(".floor").forEach(function (sec) {
      var floorNo = sec.getAttribute("data-floor");
      var shown = 0;

      $$(".boss", sec).forEach(function (card) {
        var b = BOSSES.filter(function (x) {
          return x.name.toLowerCase() === card.getAttribute("data-name");
        })[0];
        var ok = matchesFilter(b, state.filter) &&
          (!q || b.name.toLowerCase().indexOf(q) !== -1 || floorNo.indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown++;
      });

      sec.hidden = shown === 0;
      if (shown) anyFloor = true;

      var rl = railEl.querySelector('a[data-floor="' + floorNo + '"]');
      if (rl) rl.parentNode.hidden = shown === 0;
    });

    $("#empty").hidden = anyFloor;
  }

  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$(".chip").forEach(function (c) { c.classList.remove("is-on"); });
      chip.classList.add("is-on");
      state.filter = chip.getAttribute("data-filter");
      apply();
    });
  });

  $("#search").addEventListener("input", function (e) {
    state.q = e.target.value;
    apply();
  });

  var expandBtn = $("#expandAll");
  expandBtn.addEventListener("click", function () {
    var open = expandBtn.getAttribute("aria-pressed") !== "true";
    expandBtn.setAttribute("aria-pressed", String(open));
    expandBtn.textContent = open ? "Collapse all" : "Expand all";
    $$(".boss").forEach(function (card) {
      card.classList.toggle("is-open", open);
      $(".boss-top", card).setAttribute("aria-expanded", String(open));
    });
  });

  apply();
})();
