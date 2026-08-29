# The Echoing Spire — Climb Sheet

A fan-made, floor-by-floor guide to the Echoing Spire (Eternal Tower) in **Spirit Vale** —
all 20 boss floors from 5 to 101.

The existing community guides present the data as one flat filterable table. This version is
organized the way you actually climb: **one block per floor, in climb order**.

Rows are deliberately minimal — boss name plus the single call that matters mid-fight,
**DEF or MDEF**. Everything else (element split, damage mix, every crowd control, DoTs,
debuffs, attack pacing, the gear call) appears in a **hover tooltip**: point at a boss to
get its full combat card. Tap on touch devices; keyboard focus works too.

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
index.html            markup + the static primer cards and legend
assets/css/style.css  all styling (light "paper" theme)
assets/js/app.js      renders floors from the data + the hover tooltip
data/bosses.js        the boss data (a plain script, not fetched JSON)
```

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
| `notes`, `drops`, `links` | **ours to fill in** — currently empty everywhere |

Adding a boss is just another object in the array; floors group themselves and the tooltip
content derives from the data automatically.

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
