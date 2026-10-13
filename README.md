# HLTV REST API (`hltv-api`)

A serverless REST API for [HLTV.org](https://www.hltv.org/) built with [API Anything](https://github.com/goodnight000/api-anything) extraction recipes and deployed on **Cloudflare Workers** with **Cloudflare Browser Rendering** (`@cloudflare/puppeteer`).

- **Live Base URL:** `https://hltv-api.bdrrhmnhnn.workers.dev`
- **Spec File:** [`src/spec.json`](./src/spec.json) (also installed locally at `~/.api-anything/sites/hltv.json`)
- **Worker Entrypoint:** [`src/index.js`](./src/index.js)

---

## Architecture

1. **Extraction Spec (`src/spec.json`):** Contains 12 declarative HTML/CSS extraction recipes (`items`, `fields`, `extract`, and regex `pick` transforms) learned from HLTV.org via `api-anything`.
2. **Cloudflare Browser Rendering (`env.BROWSER`):** Direct `fetch()` requests from Cloudflare Worker IPs carry a `CF-Worker` header and are challenged (`403`) by HLTV's Cloudflare Bot Management. The Worker uses Cloudflare Browser Rendering with warm session reuse (`keep_alive: 120000`) and fast in-page `fetch()` on warm `https://www.hltv.org` tabs.
3. **Edge Caching:** `GET` responses with HTTP `200` are cached at the Cloudflare edge for **60 seconds** (`Cache-Control: public, max-age=60`). Append `?nocache=1` or `?fresh=1` to any request to bypass the cache.
4. **CORS Enabled:** All endpoints return `Access-Control-Allow-Origin: *`.

---

## Endpoints Overview

| Method & Path | Operation | Parameters | Description |
|---|---|---|---|
| `GET /` or `GET /health` | — | — | Health check and endpoint directory |
| `GET /ops` | — | — | Lists all 12 operations, parameters, triggers, and returned fields |
| `GET /search?query={query}` | `search` | `query` (required) | Search teams, players, events, and news articles |
| `GET /matches` | `matches` | — | List live and upcoming Counter-Strike matches |
| `GET /matches/:matchId/:slug` | `getMatch` | `matchId`, `slug` | Get match details, scores, time, format, maps, and vetoes |
| `GET /results` | `results` | — | List recent completed match results |
| `GET /rankings` | `rankings` | — | Get current HLTV world team rankings |
| `GET /teams/:teamId/:slug` | `getTeam` | `teamId`, `slug` | Get team profile, Valve/HLTV rank, coach, roster, and trophies |
| `GET /players` | `topPlayers` | — | List top-rated players with maps, rounds, K-D diff, K/D, and rating |
| `GET /players/:playerId/:slug` | `getPlayer` | `playerId`, `slug` | Get player career stats overview (rating, KPR, ADR, KAST, impact) |
| `GET /events` | `events` | — | List ongoing and upcoming tournaments and events |
| `GET /events/:eventId/:slug` | `getEvent` | `eventId`, `slug` | Get tournament details, dates, prize pool, attending teams, and placements |
| `GET /news` | `news` | — | List latest Counter-Strike news from the HLTV front page |
| `GET /news/:newsId/:slug` | `getArticle` | `newsId`, `slug` | Get full news article headline, author, date, description, and body paragraphs |
| `GET /call/:op` | Any `<op>` | Operation query params | Generic operation caller by operation name |

> **Chaining IDs and Slugs:** List and search endpoints (`matches`, `results`, `rankings`, `topPlayers`, `events`, `news`, `search`) extract and return both the numeric ID (`matchId`, `teamId`, `playerId`, `eventId`, `newsId`) and `slug` so you can pass them directly to the detail endpoints.

---

## Endpoint Reference & Examples

### 1. Search (`GET /search`)

Search HLTV teams, players, events, and news articles by keyword.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/search?query=zywoo"
```

```json
{
  "ok": true,
  "op": "search",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/search?query=zywoo",
  "ms": 5492,
  "data": [
    {
      "category": "PLAYER",
      "id": "11893",
      "name": "Mathieu 'ZywOo' Herbaut",
      "url": "/player/11893/zywoo"
    },
    {
      "category": "NEWS",
      "id": "45702",
      "name": "ZywOo: \"I love Cache too much\"",
      "url": "/news/45702/zywoo-i-love-cache-too-much"
    }
  ]
}
```

---

### 2. Live & Upcoming Matches (`GET /matches`)

Returns all live and scheduled matches on HLTV.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/matches"
```

```json
{
  "ok": true,
  "op": "matches",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/matches",
  "ms": 590,
  "data": [
    {
      "matchId": "2399174",
      "slug": "just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3",
      "teams": ["Just Swing", "Alter Ego"],
      "time": "15:00",
      "meta": ["bo3"],
      "event": "ESL Challenger League Season 52 Asia-Pacific Cup 3",
      "eventId": "9383",
      "live": "false",
      "url": "/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3"
    }
  ]
}
```

---

### 3. Match Details (`GET /matches/:matchId/:slug`)

Fetch full details, scores, map picks, and vetoes for a specific match.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3"
```

```json
{
  "ok": true,
  "op": "getMatch",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3",
  "ms": 2228,
  "data": {
    "team1": "Just Swing",
    "team1Url": "/team/13053/just-swing",
    "team2": "Alter Ego",
    "team2Url": "/team/9958/alter-ego",
    "time": "13:00",
    "date": "13th of October 2026",
    "event": "ESL Challenger League Season 52 Asia-Pacific Cup 3",
    "eventUrl": "/events/9383/esl-challenger-league-season-52-asia-pacific-cup-3",
    "status": "14h : 23m : 22s",
    "format": "Best of 3 (Online) * Consolidation final",
    "maps": ["TBA", "TBA", "TBA"],
    "mapScores": [],
    "vetoes": []
  }
}
```

---

### 4. Recent Match Results (`GET /results`)

Returns the 100 most recent completed matches.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/results"
```

```json
{
  "ok": true,
  "op": "results",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/results",
  "ms": 835,
  "data": [
    {
      "matchId": "2399454",
      "slug": "ex-rustec-vs-the-golden-horde-pgl-bucharest-2027-open-qualifier-1",
      "team1": "ex-RUSTEC",
      "team2": "The Golden Horde",
      "score": "2 - 0",
      "event": "PGL Bucharest 2027 Open Qualifier 1",
      "format": "bo3",
      "timestamp": "1791838696000",
      "url": "/matches/2399454/ex-rustec-vs-the-golden-horde-pgl-bucharest-2027-open-qualifier-1"
    }
  ]
}
```

---

### 5. World Team Rankings (`GET /rankings`)

Returns the current HLTV world team rankings, points, rank changes, and active lineups.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/rankings"
```

```json
{
  "ok": true,
  "op": "rankings",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/ranking/teams",
  "ms": 870,
  "data": [
    {
      "rank": "#1",
      "teamId": "7020",
      "slug": "spirit",
      "name": "Spirit",
      "points": "972",
      "change": "-",
      "players": ["sh1ro", "magixx", "tN1R", "zont1x", "donk"],
      "url": "/team/7020/spirit"
    }
  ]
}
```

---

### 6. Team Profile (`GET /teams/:teamId/:slug`)

Fetch a team's rankings, coach, active roster, and trophy history.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/teams/9958/alter-ego"
```

```json
{
  "ok": true,
  "op": "getTeam",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/team/9958/alter-ego",
  "ms": 890,
  "data": {
    "name": "Alter Ego",
    "country": "Asia",
    "valveRank": "#137",
    "worldRank": "#120",
    "stats": [
      "Valve rankingVRS#137(ASIA#14)",
      "World ranking#120(#9)",
      "Weeks in top30 for core0",
      "Average player age26.2",
      "Coach Andrew 'bali' Joseph"
    ],
    "coach": "Andrew 'bali' Joseph",
    "coachUrl": "/coach/993/bali",
    "roster": ["BnTeT", "PokemoN", "shadiy", "adeX", "laxiee"],
    "rosterUrls": [
      "/player/7131/bntet",
      "/player/18223/pokemon",
      "/player/20003/shadiy",
      "/player/21211/adex",
      "/player/23458/laxiee"
    ],
    "recentTrophies": []
  }
}
```

---

### 7. Top Players Leaderboard (`GET /players`)

List top-rated Counter-Strike players on HLTV.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/players"
```

```json
{
  "ok": true,
  "op": "topPlayers",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/stats/players",
  "ms": 1407,
  "data": [
    {
      "playerId": "11893",
      "slug": "zywoo",
      "nick": "ZywOo",
      "country": "France",
      "team": "Vitality",
      "maps": "1727",
      "rounds": "43078",
      "kdDiff": "+10476",
      "kd": "1.41",
      "rating": "1.27",
      "url": "/stats/players/11893/zywoo"
    }
  ]
}
```

---

### 8. Player Stats Overview (`GET /players/:playerId/:slug`)

Fetch individual career statistics for a player.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/players/21167/donk"
```

```json
{
  "ok": true,
  "op": "getPlayer",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/stats/players/21167/donk",
  "ms": 672,
  "data": {
    "nick": "donk",
    "realName": "Danil Kryshkovets",
    "age": "19 years",
    "country": "Russia",
    "team": "Spirit",
    "teamUrl": "/stats/teams/7020/spirit",
    "profileUrl": "/player/21167/donk",
    "rating": "1.32",
    "maps": "820 maps",
    "totalKills": "16819",
    "headshotPct": "61.2%",
    "totalDeaths": "12954",
    "kd": "1.30",
    "dpr": "91.2",
    "mapsPlayed": "820",
    "roundsPlayed": "19296",
    "kpr": "0.87",
    "apr": "0.18",
    "deathsPerRound": "0.67",
    "impact": "1.50"
  }
}
```

---

### 9. Ongoing & Upcoming Events (`GET /events`)

List active and upcoming Counter-Strike tournaments.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/events"
```

```json
{
  "ok": true,
  "op": "events",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/events",
  "ms": 904,
  "data": [
    {
      "eventId": "8932",
      "slug": "thunderpick-world-championship-2026",
      "name": "Thunderpick World Championship 2026",
      "dates": "Oct 14th - Oct 18th",
      "location": "Malta",
      "prizePool": "$1,000,000",
      "teamsCount": "8",
      "url": "/events/8932/thunderpick-world-championship-2026"
    }
  ]
}
```

---

### 10. Event Details (`GET /events/:eventId/:slug`)

Fetch tournament details, prize pool, location, attending teams, and prize distribution.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/events/8050/pgl-masters-bucharest-2026"
```

```json
{
  "ok": true,
  "op": "getEvent",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/events/8050/pgl-masters-bucharest-2026",
  "ms": 952,
  "data": {
    "name": "PGL Masters Bucharest 2026",
    "status": "Upcoming",
    "dates": "Oct 24th - Oct 31st 2026",
    "prizePool": "$1,250,000",
    "teamsCount": "16",
    "location": "Bucharest, Romania",
    "teams": ["Spirit", "Vitality", "MOUZ", "FURIA", "Aurora", "Legacy", "G2", "FUT", "Natus Vincere", "BETBOOM", "9z", "The MongolZ", "Nemiga", "Liquid", "TYLOO", "DENDELE"],
    "teamUrls": ["/team/7020/spirit", "/team/9565/vitality"],
    "placements": ["1st$225,000+ Club share: $225,000", "2nd$100,000+ Club share: $100,000"]
  }
}
```

---

### 11. Front-Page News (`GET /news`)

List the latest Counter-Strike news articles from the HLTV front page.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/news"
```

---

### 12. News Article (`GET /news/:newsId/:slug`)

Fetch an article's headline, author, timestamp, description, and body paragraphs.

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/news/45711/falcons-announce-m0nesy-contract-extension"
```

```json
{
  "ok": true,
  "op": "getArticle",
  "tier": 2,
  "targetUrl": "https://www.hltv.org/news/45711/falcons-announce-m0nesy-contract-extension",
  "ms": 1025,
  "data": {
    "title": "Falcons announce m0NESY contract extension",
    "author": "Sumljiv",
    "authorUrl": "/author/920331/sumljiv",
    "date": "12-10-2026 18:36",
    "description": "The Russian sniper has committed his future to the Saudi organization.",
    "paragraphs": [
      "Falcons have announced a multi-year contract extension with Ilya \"⁠m0NESY⁠\" Osipov, set to run until 2030, the organization announced on Monday."
    ]
  }
}
```

---

### Generic Operation Endpoint (`GET /call/:op`)

You can also invoke any operation in `src/spec.json` by name:

```bash
curl "https://hltv-api.bdrrhmnhnn.workers.dev/call/search?query=vitality"
curl "https://hltv-api.bdrrhmnhnn.workers.dev/call/getTeam?teamId=9565&slug=vitality"
curl "https://hltv-api.bdrrhmnhnn.workers.dev/call/getMatch?matchId=2399174&slug=just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3"
```

---

## Local CLI Usage (`api-anything`)

The same 12 operations are installed locally in `~/.api-anything/sites/hltv.json` and can be called directly from the terminal or via the `api-anything` MCP server:

```bash
api-anything ops hltv
api-anything call hltv matches
api-anything call hltv results
api-anything call hltv getMatch matchId=2399174 slug=just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3
api-anything call hltv rankings
api-anything call hltv getTeam teamId=9958 slug=alter-ego
api-anything call hltv topPlayers
api-anything call hltv getPlayer playerId=21167 slug=donk
api-anything call hltv events
api-anything call hltv getEvent eventId=8050 slug=pgl-masters-bucharest-2026
api-anything call hltv news
api-anything call hltv getArticle newsId=45711 slug=falcons-announce-m0nesy-contract-extension
api-anything call hltv search query=zywoo
api-anything verify hltv
```

---

## Development & Deployment

```bash
# Install dependencies
npm install

# Run locally with Wrangler
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```
