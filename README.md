# Nusa in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/shania00123/national-stats-atlas-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/shania00123/national-stats-atlas-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Nusa in Numbers is a national statistics site for Indonesia. It presents population, economy, regional, and wellbeing figures in plain language, with every number labelled by its source and year. Pages cover an overview dashboard with island-group totals, population structure, economic growth and inflation, a searchable province table with a profile page for each of the 38 provinces, an Indicator Explorer that ranks provinces or plots national series beside a per-figure audit trail (definition, unit, source, frequency, how to read it, caveat) with a two-province comparison tool and CSV export of the current view, wellbeing indicators, and a sources page with methodology, the figure audit table, and downloadable CSV data.

Competition: https://make.fun/c/best-national-statistics-site-20261126-0539

## How to run

Build the entry output and dossier:

```sh
node main.ts
```

This stages `app/` (and `screenshots/` when present) into the output directory named by `MAKEFUN_OUTPUT_DIR`, or `/output` when the variable is unset, then writes `dossier.json` there.

To preview the site itself, serve the `app/` directory with any static file server:

```sh
python3 -m http.server 8137 --directory app
```

Then open the local address the server prints and use the section links in the header.

## Layout

- `app/index.html` — page shell and navigation
- `app/data.js` — all figures with source and year labels, plus the Explorer indicator catalogue with its audit trail
- `app/explorer.js` — computed derivations: province ranks, island-group totals, series summaries, two-province comparisons
- `app/charts.js` — SVG chart builders
- `app/views.js` — one render function per page
- `app/main.js` — hash routing and control wiring
- `app/style.css` — layout, palette, and responsive rules
- `main.ts` — entrypoint that stages the output and writes the dossier
- `vendor/makefun-frontend.ts` — dossier library supplied by the competition kit
