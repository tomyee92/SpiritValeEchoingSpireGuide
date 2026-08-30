# The Echoing Spire — Climb Sheet

A fan-made, floor-by-floor guide to the Echoing Spire (Eternal Tower) in **Spirit Vale** —
all 20 boss floors from 5 to 101.

The existing community guides present the data as one flat filterable table. This version is
organized the way you actually climb: **one line per boss, in climb order** — F5, then F10,
then F15, straight down the tower. A floor with two bosses repeats its number so every line
stands on its own.

Every boss block is three zones, left to right:

- **Left (identity)** — floor tag, icon, name.
- **Middle** — top: boss type, level, DEF/MDEF/SPLIT, Combat stats (Max HP,
  ATK/MATK, DEF/MDEF + flat, Hit/Flee, attack interval — the source site's
  own hover-only "combat card", scraped once into `bosses.js` and always
  visible here), and every status tag (Silence, Freeze, Stun, Curse, every
  debuff and DoT). Bottom: Element (icon + damage-share number per element)
  and the damage-type split.
- **Right** — the gear-prep line, plus a slot for future notes/tips.

The only thing still behind a point/tap: **a single status tag's own
explainer** — its exact duration/chance and what it does to you (e.g. what
"Curse" actually means). Tap does the same on touch; keyboard focus works too.

The climb list itself runs nearly full-width — there's a lot of data per row
now and the narrower centered column from earlier passes wasted the screen.
Below ~1100px the three zones stack instead of sitting side by side.

There is no search and no filtering by design — you scroll the tower the way you climb it.

## Running it

It's a static site with no build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 4321
```

## Deploying to GitHub Pages

Push to GitHub, then in **Settings → Pages** set the source to the `main` branch, root (`/`).
`.nojekyll` is present so Jekyll does not touch the `assets/` folder.

## Layout

```
index.html            markup + the legend line
assets/css/style.css  all styling (light "paper" theme)
assets/js/app.js      renders floors from the data + the hover tooltip
data/bosses.js        the boss data (a plain script, not fetched JSON)
```

## After every deploy: bump the cache-buster

`index.html` loads `style.css`, `bosses.js` and `app.js` with a `?v=YYYYMMDDNN`
query string. GitHub Pages serves everything with `Cache-Control: max-age=600`,
so without this, a visitor whose browser already cached those files won't see
a change for up to 10 minutes even after the page itself reloads - bump the
version string in `index.html` (all three tags, same value) on any commit
that changes `style.css`, `app.js`, or `bosses.js`.

## Editing the data

`data/bosses.js` assigns `window.SPIRE_DATA`. It's loaded with a `<script>` tag rather than
`fetch()` so the site works when opened straight from disk, without a server.

Each boss entry:

| field | meaning |
|---|---|
| `floor`, `level`, `name` | identity |
| `def` | the swap call: `DEF`, `MDEF`, or `SPLIT` |
| `multi` | element spread too wide to fully resist with armor |
| `elements` | `[name, percent]` pairs, highest first |
| `mix` | damage share by type — `mel` + `ran` are blocked by DEF, `mag` by MDEF |
| `autoPct`, `swings` | share of output that is auto-attack, and swings per 60s |
| `cc` | `[type, duration, chance%]` per landed cast |
| `dot` | `[type, duration]` |
| `deb` | debuff names |
| `prepare` | the one-line gear call |
| `icon` | path to a self-hosted boss icon, or `null` when none exists (see below) |
| `combat` | Max HP / ATK / MATK / DEF+flat / MDEF+flat / Hit / Flee / attack interval / STR-LUK |
| `notes`, `drops`, `links` | **ours to fill in** — currently empty everywhere; `notes` isn't rendered yet |

Adding a boss is just another object in the array; floors group themselves and the tooltip
content derives from the data automatically.

## Boss icons

`assets/img/bosses/*.webp` — 26 monster icons pulled from the SpiritValers guide and
self-hosted here (not hotlinked), one per boss. The 8 floor-101 "Echo … Master" bosses have
**no icon anywhere** — their `<img>` tags 404 on the source site itself (confirmed:
`complete: false` there too), not something broken on our end. Those render a plain
two-letter monogram instead, generated from the boss name at render time.

### Still to add

- `notes` — our own tactics, positioning and gear calls per boss
- `drops` — what each boss actually gives
- `links` — video references for the harder floors
- The 15 non-boss trash monsters, if we want them

## Data provenance

Boss damage profiles are adapted from the
[SpiritValers Echoing Spire guide](https://spiritvalers.com/eternal-tower) (game build 0.30.0 EA)
and reorganized here.

Those figures are **modeled estimates of damage composition** — what share of a boss's output is
which element and which type — not measured in-game numbers, and not the damage it deals you.
Treat them as planning guidance.

Fan project. Not affiliated with Spirit Vale or its developers; game data belongs to them.
