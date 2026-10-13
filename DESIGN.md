# Design Direction: Alter Ego VRS Major Radar

> Notice: Drafted by agent upon user request. Agent-generated direction carries risk of default AI taste and monotony. Grounded strictly in the Esports Tactical / Command Center brief.

## Identity & Purpose
A live telemetry dashboard and scenario simulator tracking Alter Ego's Counter-Strike 2 squad (PokemoN (IGL), BnTeT, adeX, laxiee, shadiy / Gratisfaction) on their mathematical road to the PGL Major Singapore 2026 via Valve Regional Standings (VRS).

- **Audience**: CS2 fans, analysts, and esports followers tracking cutoff thresholds, match deltas, and tournament run-outs.
- **Mood**: Esports Tactical / Command Center. Sharp, data-dense, high-contrast, broadcast-grade telemetry.

## Dials
`Dial: ENERGY 2 / RHYTHM 2 / MOTION 1`
- **ENERGY 2**: Balanced esports telemetry. Clear focal metrics, decisive Alter Ego crimson accent, zero neon soup.
- **RHYTHM 2**: Structured command-center layout with clear rhythm shifts between executive cutoff tracker, scenario calculator, and regional leaderboard.
- **MOTION 1**: Functional motion only. Instant state transitions, clear keyboard focus indicators, no gratuitous bounces or floating cards.

## Palette & Visual System (HLTV Night Standard)
Strict high-information telemetry palette matching HLTV.org dark mode:
- **Base Canvas**: `#101418` (HLTV deep carbon background)
- **Panel Surface**: `#171c22` (HLTV panel container)
- **Card Surface**: `#1f252d` (HLTV secondary module & table strip)
- **Hairline Borders**: `#2c3440` (1px crisp dividing lines, zero blur or glow)
- **Subtle Dividers**: `#222832` (row separators)
- **Primary Text**: `#ffffff` (pure white titles and high-contrast values)
- **Secondary Body**: `#c5cbd5` (clean readable metadata)
- **Muted Labels**: `#8892a0` (supporting telemetry and timestamps)
- **Brand Accent**: `#ff6b78` (Alter Ego Crimson text, 5.60:1 WCAG AA on `#1f252d`; `#e63946` solid surface accent)
- **Interactive Control Boundary**: `#677487` (3.25:1 non-text contrast against `#1f252d`)
- **Semantic Indicators**:
  - Win / Major Slot / Positive Rating: `#22c55e` (HLTV green)
  - Snapshot / Bubble / Event LAN: `#f59e0b` (HLTV amber gold)
  - Loss / Hazard: `#ff6b78` (Crimson)
  - Matchday Blue: `#38bdf8` (Tournament tag blue)
- **Corner Radii**: 2px sharp corners (`rounded-[2px]`). Zero bubbly rounded-xl.
## Typography
- System sans-serif stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`
- Tabular figures (`font-variant-numeric: tabular-nums`) across all points, deltas, and rankings to avoid layout jitter during updates.
- Controlled hierarchy: prominent numerical figures (28px - 36px), readable uppercase telemetry labels (11px - 12px, letter-spacing: 0.05em). No oversized terminal fonts (R-06).

- **Focal Point**: Live VRS qualification status (current 866 pts, #13 Asia, #133 World VRS vs 1,191 pts target threshold) with countdown to the November 2, 2026 cutoff.
- **Whitespace**: Structural margins separating distinct modules (Roster status, ECL Cup 3 run-out, DFRAG LAN multiplier, Asia VRS standings).
- **Interactive Controls**: Real scenario toggles, filterable standings, accessible keyboard navigation, and functional calculators (R-26, R-32).
- **No Slop Guarantee**: No em dashes (R-02), no fake statistics (R-17), no generic badge sprawl (R-09), no pill overload (R-11).

## Visual Assets & Player Profiles (R-23 & R-38 Compliant)
- **Organization Emblem**: Official Alter Ego Esports high-resolution logo (`assets/alter_ego_logo.png`) rendered in the header brand identity and active standings row.
- **Active Squad Profiles**: 5 core player cutouts (400x417 RGBA) and 1 ECL substitute profile:
  - **PokemoN (IGL / Captain)**: Saad Ahmad, Pakistan (`assets/pokemon.png`, Rating: 1.11, DPR: 80.5, KPR: 0.73, HLTV `stats/players/18223/pokemon`)
  - **BnTeT (Rifler / Support)**: Hansel Ferdinand, Indonesia (`assets/bntet.png`, Rating: 1.13, DPR: 81.8, KPR: 0.75, HLTV `stats/players/7131/bntet`)
  - **adeX (AWPer)**: Adelin Nica, Romania (`assets/adex.png`, Rating: 1.15, DPR: 77.9, KPR: 0.77, HLTV `stats/players/21211/adex`)
  - **laxiee (Rifler)**: Maks Andryei, Mongolia (`assets/laxiee.png`, Rating: 1.11, DPR: 78.8, KPR: 0.74, HLTV `stats/players/23458/laxiee`)
  - **shadiy (Rifler)**: Mārtiņš Gūtmanis, Latvia (`assets/shadiy.png`, Rating: 1.18, DPR: 80.6, KPR: 0.75, HLTV `stats/players/20003/shadiy`)
- **Bloody (ECL Substitute)**: Zain Talha, Pakistan (`assets/bloody.png`, Rating: 1.17, DPR: 85.4, KPR: 0.79, HLTV `stats/players/23956/bloody`)
- **National Flags**: Official vector SVG country flags (`assets/flags/{pk,id,ro,mn,lv}.svg`) rendered alongside player nationalities in squad profile cards and executive roster chips.
