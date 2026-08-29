/* Echoing Spire boss data.
 * Loaded as a plain script (window.SPIRE_DATA) rather than fetched JSON so the
 * site works both on GitHub Pages and when opened directly from disk.
 *
 * mix      = share of damage by type, percent (mel/ran/mag). Mel+Ran are stopped by DEF, Mag by MDEF.
 * elements = [name, percent] pairs, highest first.
 * cc       = [type, duration, chance%] per landed cast.
 * def      = the swap call: DEF | MDEF | SPLIT.
 * multi    = element spread too wide to fully resist with armor.
 * notes / drops / links are intentionally empty - filled in as we go.
 */
window.SPIRE_DATA = {
  meta: {
    gameBuild: "0.30.0 EA",
    source: "https://spiritvalers.com/eternal-tower",
    disclaimer:
      "Damage figures are modeled estimates of composition (what share is which element / type), not measured in-game numbers. Expect a point or two of wobble.",
    currency: {
      name: "Umbral Fragment",
      rates: [
        { range: "Floors 1-49", amount: "+1" },
        { range: "Floors 50-99", amount: "+2" },
        { range: "Floors 100+", amount: "+3" }
      ],
      exchange: "500 Umbral Fragment each, at The Echoing Spire, for 17 tower-exclusive items."
    }
  },

  bosses: [
    { floor: 5, level: 105, name: "Vorpal Hare", icon: "assets/img/bosses/hare.webp", def: "DEF", multi: false,
      elements: [["Neutral", 100]], mix: { mel: 88, ran: 0, mag: 12 }, autoPct: 58, swings: 123,
      cc: [["Stun", "3s", 75], ["Stun", "3s", 100]], dot: [], deb: [],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 10, level: 110, name: "Vespa", icon: "assets/img/bosses/sting.webp", def: "DEF", multi: false,
      elements: [["Neutral", 93], ["Wind", 7]], mix: { mel: 53, ran: 33, mag: 14 }, autoPct: 53, swings: 124,
      cc: [], dot: [], deb: ["Blind"],
      prepare: "DEF Neutral", notes: "", drops: [], links: [] },

    { floor: 15, level: 115, name: "Lycanthrope", icon: "assets/img/bosses/werewolf.webp", def: "DEF", multi: false,
      elements: [["Neutral", 91], ["Undead", 9]], mix: { mel: 56, ran: 29, mag: 15 }, autoPct: 37, swings: 122,
      cc: [], dot: [["Bleed", "10s"]], deb: [],
      prepare: "DEF Neutral", notes: "", drops: [], links: [] },

    { floor: 20, level: 120, name: "Raiju", icon: "assets/img/bosses/cat-bolt.webp", def: "SPLIT", multi: true,
      elements: [["Wind", 58], ["Neutral", 37], ["Water", 5]], mix: { mel: 47, ran: 0, mag: 53 }, autoPct: 47, swings: 86,
      cc: [["Freeze", "10s", 100]], dot: [], deb: ["Water Exposure", "Blind"],
      prepare: "Split Wind/Neutral/Water* · +anti-Freeze", notes: "", drops: [], links: [] },

    { floor: 25, level: 125, name: "Cactus King", icon: "assets/img/bosses/cactus-king.webp", def: "DEF", multi: false,
      elements: [["Neutral", 74], ["Earth", 20], ["Poison", 6]], mix: { mel: 70, ran: 4, mag: 26 }, autoPct: 40, swings: 57,
      cc: [["Stun", "3s", 75], ["Stun", "3s", 50]], dot: [["Poison", "10s"]],
      deb: ["Stagger", "Vulnerability", "Fire Exposure"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 30, level: 130, name: "Lady Fey", icon: "assets/img/bosses/sunflora-pixie.webp", def: "MDEF", multi: true,
      elements: [["Neutral", 42], ["Earth", 38], ["Ghost", 20]], mix: { mel: 24, ran: 0, mag: 76 }, autoPct: 24, swings: 65,
      cc: [["Silence", "5s", 100], ["Silence", "5s", 100]], dot: [], deb: ["Slow", "Fire Exposure"],
      prepare: "MDEF Neutral/Earth/Ghost* · +anti-Silence", notes: "", drops: [], links: [] },

    { floor: 35, level: 135, name: "Hermit King", icon: "assets/img/bosses/hermit-king.webp", def: "DEF", multi: false,
      elements: [["Neutral", 77], ["Water", 23]], mix: { mel: 77, ran: 0, mag: 23 }, autoPct: 30, swings: 55,
      cc: [["Freeze", "10s", 100], ["Freeze", "10s", 100]], dot: [], deb: ["Wind Exposure"],
      prepare: "DEF Neutral · +anti-Freeze", notes: "", drops: [], links: [] },

    { floor: 35, level: 135, name: "Scorpion King", icon: "assets/img/bosses/scorpion-king.webp", def: "DEF", multi: false,
      elements: [["Neutral", 80], ["Fire", 20]], mix: { mel: 75, ran: 0, mag: 25 }, autoPct: 57, swings: 125,
      cc: [["Stun", "3s", 75]], dot: [["Burn", "10s"], ["Bleed", "10s"]], deb: ["Earth Exposure"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 40, level: 140, name: "Naga", icon: "assets/img/bosses/snake-naga.webp", def: "DEF", multi: false,
      elements: [["Neutral", 82], ["Ghost", 18]], mix: { mel: 47, ran: 27, mag: 25 }, autoPct: 47, swings: 124,
      cc: [["Silence", "5s", 100]], dot: [], deb: ["Blind"],
      prepare: "DEF Neutral · +anti-Silence", notes: "", drops: [], links: [] },

    { floor: 40, level: 140, name: "Night Baron", icon: "assets/img/bosses/bat-lord.webp", def: "DEF", multi: false,
      elements: [["Neutral", 86], ["Poison", 14]], mix: { mel: 77, ran: 9, mag: 14 }, autoPct: 60, swings: 124,
      cc: [], dot: [["Poison", "10s"]], deb: ["Blind"],
      prepare: "DEF Neutral", notes: "", drops: [], links: [] },

    { floor: 45, level: 145, name: "Zombie Orc Lord", icon: "assets/img/bosses/zombie-goblin-lord.webp", def: "DEF", multi: false,
      elements: [["Neutral", 68], ["Holy", 14], ["Undead", 9], ["Shadow", 8]], mix: { mel: 68, ran: 0, mag: 32 }, autoPct: 12, swings: 33,
      cc: [["Stun", "3s", 75]], dot: [["Decay", "5s"]],
      deb: ["Vulnerability", "Magic Exposure", "Curse"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 45, level: 145, name: "Orc King", icon: "assets/img/bosses/goblin-king.webp", def: "DEF", multi: false,
      elements: [["Neutral", 92], ["Earth", 8]], mix: { mel: 90, ran: 0, mag: 10 }, autoPct: 30, swings: 67,
      cc: [["Stun", "3s", 75], ["Stun", "3s", 50]], dot: [["Bleed", "10s"]],
      deb: ["Stagger", "Vulnerability", "Fire Exposure", "Slow"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 50, level: 150, name: "Ice Mage", icon: "assets/img/bosses/ice-mage.webp", def: "MDEF", multi: false,
      elements: [["Water", 63], ["Neutral", 20], ["Wind", 17]], mix: { mel: 20, ran: 3, mag: 77 }, autoPct: 20, swings: 64,
      cc: [["Freeze", "10s", 100], ["Freeze", "10s", 50], ["Freeze", "10s", 100], ["Freeze", "10s", 100]], dot: [],
      deb: ["Wind Exposure", "Water Exposure", "Vulnerability"],
      prepare: "MDEF Water · +anti-Freeze", notes: "", drops: [], links: [] },

    { floor: 55, level: 155, name: "Seraphim Arbiter", icon: "assets/img/bosses/angel-mage.webp", def: "MDEF", multi: false,
      elements: [["Holy", 82], ["Neutral", 14], ["Shadow", 5]], mix: { mel: 14, ran: 0, mag: 86 }, autoPct: 14, swings: 65,
      cc: [["Stun", "1.5s", 25]], dot: [],
      deb: ["Blind", "Vulnerability", "Magic Exposure", "Curse"],
      prepare: "MDEF Holy · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 60, level: 160, name: "Broodmother", icon: "assets/img/bosses/queen-worm.webp", def: "SPLIT", multi: true,
      elements: [["Ghost", 48], ["Poison", 41], ["Neutral", 11]], mix: { mel: 11, ran: 35, mag: 54 }, autoPct: 11, swings: 37,
      cc: [], dot: [["Poison", "10s"]], deb: ["Slow", "Vulnerability", "Curse"],
      prepare: "Split Ghost/Poison/Neutral*", notes: "", drops: [], links: [] },

    { floor: 60, level: 160, name: "Devourer", icon: "assets/img/bosses/worm-creep.webp", def: "DEF", multi: true,
      elements: [["Neutral", 42], ["Ghost", 35], ["Poison", 24]], mix: { mel: 42, ran: 18, mag: 40 }, autoPct: 35, swings: 124,
      cc: [], dot: [["Poison", "10s"]], deb: ["Slow", "Vulnerability", "Blind"],
      prepare: "DEF Neutral/Ghost/Poison*", notes: "", drops: [], links: [] },

    { floor: 65, level: 165, name: "Demon Lord", icon: "assets/img/bosses/imp-devil.webp", def: "MDEF", multi: true,
      elements: [["Fire", 54], ["Neutral", 32], ["Ghost", 9], ["Shadow", 4]], mix: { mel: 30, ran: 9, mag: 61 }, autoPct: 30, swings: 86,
      cc: [["Stun", "3s", 100], ["Stun", "3s", 100]], dot: [["Burn", "10s"]],
      deb: ["Earth Exposure", "Curse"],
      prepare: "MDEF Fire/Neutral/Ghost* · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 70, level: 170, name: "Abyss Archon", icon: "assets/img/bosses/death-mage.webp", def: "MDEF", multi: true,
      elements: [["Shadow", 49], ["Neutral", 39], ["Ghost", 8], ["Holy", 3]], mix: { mel: 13, ran: 15, mag: 72 }, autoPct: 10, swings: 61,
      cc: [["Silence", "5s", 100]], dot: [], deb: ["Blind"],
      prepare: "MDEF Shadow/Neutral/Ghost* · +anti-Silence", notes: "", drops: [], links: [] },

    { floor: 75, level: 175, name: "Orc Warchief", icon: "assets/img/bosses/goblin-warchief.webp", def: "SPLIT", multi: false,
      elements: [["Neutral", 64], ["Earth", 14], ["Wind", 13], ["Fire", 9]], mix: { mel: 59, ran: 0, mag: 41 }, autoPct: 23, swings: 78,
      cc: [["Stun", "3s", 50], ["Stun", "3s", 75], ["Stun", "3s", 100]], dot: [["Bleed", "10s"], ["Burn", "1s"]],
      deb: ["Blind", "Water Exposure", "Fire Exposure", "Earth Exposure"],
      prepare: "Split Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 80, level: 180, name: "Ice Titan", icon: "assets/img/bosses/mega-ice-golem.webp", def: "DEF", multi: true,
      elements: [["Neutral", 48], ["Water", 43], ["Earth", 8]], mix: { mel: 60, ran: 0, mag: 40 }, autoPct: 46, swings: 62,
      cc: [["Stun", "3s", 75], ["Freeze", "10s", 50], ["Stun", "3s", 50], ["Freeze", "10s", 100], ["Stun", "3s", 100]], dot: [],
      deb: ["Wind Exposure", "Slow", "Stagger", "Vulnerability", "Fire Exposure"],
      prepare: "DEF Neutral/Water/Earth* · +anti-Stun/Freeze", notes: "", drops: [], links: [] },

    { floor: 85, level: 185, name: "Turtle Champion", icon: "assets/img/bosses/turtle-champion.webp", def: "SPLIT", multi: true,
      elements: [["Neutral", 44], ["Holy", 28], ["Water", 13], ["Earth", 8], ["Fire", 7]], mix: { mel: 53, ran: 0, mag: 47 }, autoPct: 53, swings: 129,
      cc: [["Stun", "3s", 50], ["Freeze", "10s", 100], ["Stun", "3s", 100]], dot: [["Burn", "10s"]],
      deb: ["Fire Exposure", "Slow"],
      prepare: "Split Neutral/Holy/Water* · +anti-Stun/Freeze", notes: "", drops: [], links: [] },

    { floor: 85, level: 185, name: "Kraken", icon: "assets/img/bosses/kraken.webp", def: "SPLIT", multi: true,
      elements: [["Neutral", 50], ["Water", 29], ["Earth", 17], ["Shadow", 3]], mix: { mel: 43, ran: 7, mag: 50 }, autoPct: 41, swings: 83,
      cc: [["Freeze", "10s", 50], ["Freeze", "10s", 100], ["Stun", "3s", 50], ["Freeze", "10s", 100]], dot: [],
      deb: ["Stagger", "Vulnerability", "Wind Exposure", "Fire Exposure", "Curse"],
      prepare: "Split Neutral/Water/Earth* · +anti-Freeze/Stun", notes: "", drops: [], links: [] },

    { floor: 90, level: 190, name: "Cosmic Entity", icon: "assets/img/bosses/cosmic-entity.webp", def: "SPLIT", multi: true,
      elements: [["Neutral", 47], ["Holy", 35], ["Shadow", 18]], mix: { mel: 16, ran: 29, mag: 55 }, autoPct: 16, swings: 80,
      cc: [["Silence", "5s", 100]], dot: [],
      deb: ["Vulnerability", "Magic Exposure", "Curse"],
      prepare: "Split Neutral/Holy/Shadow* · +anti-Silence", notes: "", drops: [], links: [] },

    { floor: 90, level: 190, name: "Wraith King", icon: "assets/img/bosses/wraith.webp", def: "SPLIT", multi: false,
      elements: [["Neutral", 61], ["Undead", 35], ["Shadow", 4]], mix: { mel: 46, ran: 13, mag: 41 }, autoPct: 12, swings: 66,
      cc: [["Silence", "5s", 100]], dot: [["Decay", "5s"]],
      deb: ["Stagger", "Vulnerability", "Slow", "Undead Exposure", "Curse"],
      prepare: "Split Neutral · +anti-Silence", notes: "", drops: [], links: [] },

    { floor: 95, level: 195, name: "Suphara", icon: "assets/img/bosses/spider-queen.webp", def: "DEF", multi: false,
      elements: [["Neutral", 69], ["Ghost", 24], ["Poison", 7]], mix: { mel: 24, ran: 49, mag: 27 }, autoPct: 24, swings: 122,
      cc: [["Silence", "1s", 100], ["Stun", "3s", 100]], dot: [["Poison", "10s"]],
      deb: ["Vulnerability", "Slow", "Blind"],
      prepare: "DEF Neutral · +anti-Silence/Stun", notes: "", drops: [], links: [] },

    { floor: 95, level: 195, name: "Robot Dragon", icon: "assets/img/bosses/robot-dragon.webp", def: "DEF", multi: false,
      elements: [["Neutral", 64], ["Fire", 36]], mix: { mel: 47, ran: 29, mag: 23 }, autoPct: 22, swings: 80,
      cc: [["Stun", "3s", 100], ["Stun", "3s", 75], ["Stun", "3s", 100]], dot: [["Burn", "10s"], ["Bleed", "10s"]],
      deb: ["Earth Exposure"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Paladin Master", icon: null, def: "MDEF", multi: false,
      elements: [["Holy", 90], ["Neutral", 10]], mix: { mel: 10, ran: 0, mag: 90 }, autoPct: 6, swings: 58,
      cc: [], dot: [], deb: ["Stagger", "Vulnerability"],
      prepare: "MDEF Holy", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Gunslinger Master", icon: null, def: "DEF", multi: false,
      elements: [["Neutral", 100]], mix: { mel: 2, ran: 98, mag: 0 }, autoPct: 2, swings: 9,
      cc: [], dot: [], deb: ["Vulnerability", "Weaken", "Marked", "Slow"],
      prepare: "DEF Neutral", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Wizard Master", icon: null, def: "MDEF", multi: true,
      elements: [["Water", 26], ["Wind", 24], ["Fire", 18], ["Earth", 15], ["Neutral", 13], ["Ghost", 5]], mix: { mel: 13, ran: 0, mag: 87 }, autoPct: 13, swings: 65,
      cc: [["Stun", "3s", 100], ["Freeze", "10s", 50], ["Stun", "3s", 50]], dot: [["Burn", "10s"]],
      deb: ["Wind Exposure", "Blind", "Water Exposure", "Earth Exposure", "Fire Exposure"],
      prepare: "MDEF Water/Wind/Fire* · +anti-Stun/Freeze", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Priest Master", icon: null, def: "MDEF", multi: false,
      elements: [["Holy", 73], ["Neutral", 27]], mix: { mel: 27, ran: 0, mag: 73 }, autoPct: 27, swings: 65,
      cc: [["Silence", "5s", 100], ["Stun", "1s", 13]], dot: [], deb: ["Magic Exposure"],
      prepare: "MDEF Holy · +anti-Silence/Stun", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Shinobi Master", icon: null, def: "DEF", multi: false,
      elements: [["Neutral", 100]], mix: { mel: 31, ran: 54, mag: 14 }, autoPct: 9, swings: 68,
      cc: [["Stun", "3s", 100], ["Freeze", "10s", 100]], dot: [["Burn", "10s"]], deb: ["Blind"],
      prepare: "DEF Neutral · +anti-Stun/Freeze", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Necromancer Master", icon: null, def: "SPLIT", multi: true,
      elements: [["Neutral", 53], ["Undead", 47]], mix: { mel: 53, ran: 0, mag: 47 }, autoPct: 5, swings: 28,
      cc: [], dot: [["Decay", "10s"]],
      deb: ["Stagger", "Vulnerability", "Undead Exposure", "Slow"],
      prepare: "Split Neutral/Undead*", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Berserker Master", icon: null, def: "DEF", multi: false,
      elements: [["Neutral", 100]], mix: { mel: 100, ran: 0, mag: 0 }, autoPct: 13, swings: 91,
      cc: [["Stun", "3s", 75], ["Stun", "3s", 100]], dot: [["Bleed", "5s"]], deb: ["Stagger", "Slow"],
      prepare: "DEF Neutral · +anti-Stun", notes: "", drops: [], links: [] },

    { floor: 101, level: 201, name: "Echo Weaver Master", icon: null, def: "SPLIT", multi: true,
      elements: [["Neutral", 44], ["Fire", 19], ["Ghost", 17], ["Wind", 10], ["Water", 7], ["Earth", 4]], mix: { mel: 40, ran: 4, mag: 56 }, autoPct: 25, swings: 77,
      cc: [["Freeze", "10s", 100]], dot: [["Burn", "10s"]],
      deb: ["Wind Exposure", "Earth Exposure", "Water Exposure", "Slow", "Fire Exposure"],
      prepare: "Split Neutral/Fire/Ghost* · +anti-Freeze", notes: "", drops: [], links: [] }
  ]
};
