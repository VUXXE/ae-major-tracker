const HLTV_API_BASE = 'https://hltv-api.bdrrhmnhnn.workers.dev';
const CACHE_TTL_MS = 30000;

const BASELINE_TELEMETRY = {
  team: {
    id: '9958',
    slug: 'alter-ego',
    name: 'Alter Ego',
    country: 'Indonesia',
    vrsPoints: 866,
    asiaRank: 13,
    worldRank: 133,
    hltvWorldRank: 120,
    hltvPeakRank: 9,
    avgPlayerAge: 26.2,
    coach: "Andrew 'bali' Joseph",
    coachUrl: '/coach/993/bali',
    roster: ['BnTeT', 'PokemoN', 'shadiy', 'adeX', 'laxiee'],
    targetPoints: 1191,
    deficit: 325,
    cutoffRank: 5
  },
  opponents: {
    chinggisWarriors: { id: '12646', slug: 'chinggis-warriors', name: 'Chinggis Warriors', vrsRank: 58, asiaRank: 4, hltvRank: 61, vrsPoints: 1201 },
    justSwing: { id: '13053', slug: 'just-swing', name: 'Just Swing', vrsRank: 172, asiaRank: 17, hltvRank: 158, vrsPoints: 773 },
    lynnVision: { id: '8840', slug: 'lynn-vision', name: 'Lynn Vision', vrsRank: 69, asiaRank: 7, hltvRank: 39, vrsPoints: 1154 }
  },
  players: {
    pokemon: { playerId: '18223', slug: 'pokemon', nick: 'PokemoN', realName: 'Saad Ahmad', role: 'IGL / Captain', rating: '1.11', dpr: '80.5', kpr: '0.73', kd: '1.04', impact: '1.20', headshotPct: '60.0%', mapsPlayed: '302', url: 'https://www.hltv.org/stats/players/18223/pokemon' },
    bntet: { playerId: '7131', slug: 'bntet', nick: 'BnTeT', realName: 'Hansel Ferdinand', role: 'Rifler / Support', rating: '1.13', dpr: '81.8', kpr: '0.75', kd: '1.20', impact: '1.13', headshotPct: '40.2%', mapsPlayed: '1213', url: 'https://www.hltv.org/stats/players/7131/bntet' },
    adex: { playerId: '21211', slug: 'adex', nick: 'adeX', realName: 'Adelin Nica', role: 'AWPer', rating: '1.15', dpr: '77.9', kpr: '0.77', kd: '1.14', impact: '1.30', headshotPct: '34.1%', mapsPlayed: '291', url: 'https://www.hltv.org/stats/players/21211/adex' },
    laxiee: { playerId: '23458', slug: 'laxiee', nick: 'laxiee', realName: 'Maks Andryei', role: 'Rifler', rating: '1.11', dpr: '78.8', kpr: '0.74', kd: '1.04', impact: '1.19', headshotPct: '56.1%', mapsPlayed: '365', url: 'https://www.hltv.org/stats/players/23458/laxiee' },
    shadiy: { playerId: '20003', slug: 'shadiy', nick: 'shadiy', realName: 'Mārtiņš Gūtmanis', role: 'Rifler', rating: '1.18', dpr: '80.6', kpr: '0.75', kd: '1.15', impact: '1.22', headshotPct: '48.5%', mapsPlayed: '383', url: 'https://www.hltv.org/stats/players/20003/shadiy' },
    bloody: { playerId: '23956', slug: 'bloody', nick: 'Bloody', realName: 'Zain Talha', role: 'ECL Stand-in', rating: '1.17', dpr: '85.4', kpr: '0.79', kd: '1.08', impact: '1.26', headshotPct: '61.8%', mapsPlayed: '154', url: 'https://www.hltv.org/stats/players/23956/bloody' }
  },
  snapshotDeadline: '2026-11-02T00:00:00Z',
  tournaments: {
    ecl_cup3: {
      eventId: '9383',
      slug: 'esl-challenger-league-season-52-asia-pacific-cup-3',
      name: 'ESL Challenger League Season 52 Asia-Pacific Cup 3',
      type: 'Online',
      location: 'Asia (Online)',
      dates: 'Oct 7th - Oct 14th 2026',
      prize: '$10,000',
      teamsCount: '15',
      status: 'Live',
      currentStage: 'Consolidation Final',
      placements: [
        '1st: $5,000 + Season 52 Asia-Pacific Finals',
        '2nd: $2,500',
        '3rd: $1,500',
        '4th: Chinggis Warriors ($1,000)'
      ],
      url: 'https://www.hltv.org/events/9383/esl-challenger-league-season-52-asia-pacific-cup-3'
    },
    dfrag_lan: {
      name: 'DFRAG Invitational 2026 (Brisbane)',
      type: 'LAN',
      dates: 'Oct 26 - Nov 1, 2026',
      prize: '$28,440',
      status: 'Upcoming',
      currentStage: 'Group Stage'
    }
  },
  matches: {
    m1: {
      id: 'm1',
      matchId: '2399173',
      slug: 'alter-ego-vs-chinggis-warriors-esl-challenger-league-season-52-asia-pacific-cup-3',
      hltvUrl: 'https://www.hltv.org/matches/2399173/alter-ego-vs-chinggis-warriors-esl-challenger-league-season-52-asia-pacific-cup-3',
      stage: 'Lower Bracket Final vs. Chinggis Warriors',
      team1: 'Alter Ego',
      team2: 'Chinggis Warriors',
      score1: '2',
      score2: '0',
      opponent: 'Chinggis Warriors',
      opponentRank: 58,
      opponentAsiaRank: 4,
      opponentHltvRank: 61,
      opponentVrs: 1201,
      mapScores: ['13', '9', '13', '9', '-', '-'],
      mapSummary: 'Inferno 13-9, Dust2 13-9',
      vetoes: [
        '1. Chinggis Warriors removed Anubis',
        '2. Alter Ego removed Nuke',
        '3. Chinggis Warriors picked Inferno',
        '4. Alter Ego picked Dust2',
        '5. Chinggis Warriors removed Mirage',
        '6. Alter Ego removed Cache',
        '7. Ancient was left over'
      ],
      winDelta: 36,
      lossDelta: -3
    },
    m2: {
      id: 'm2',
      matchId: '2399174',
      slug: 'just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3',
      hltvUrl: 'https://www.hltv.org/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3',
      stage: 'Consolidation Final vs. Just Swing',
      team1: 'Just Swing',
      team2: 'Alter Ego',
      score1: null,
      score2: null,
      opponent: 'Just Swing',
      opponentRank: 172,
      opponentAsiaRank: 17,
      opponentHltvRank: 158,
      opponentVrs: 773,
      date: '13th of October 2026',
      time: '15:00',
      status: 'scheduled',
      hltvStatus: 'Scheduled',
      result: null,
      outcome: null,
      format: 'Best of 3 (Online) * Consolidation final',
      maps: ['TBA', 'TBA', 'TBA'],
      mapScores: [],
      mapSummary: 'Maps TBA (Bo3)',
      vetoes: [],
      winDelta: 14,
      lossDelta: -19,
      projectedWorldRankWin: 129,
      projectedWorldRankLoss: 139
    },
    m3: {
      id: 'm3',
      matchId: '2399175',
      slug: 'lynn-vision-vs-tba-esl-challenger-league-season-52-asia-pacific-cup-3',
      hltvUrl: 'https://www.hltv.org/matches/2399175/lynn-vision-vs-tba-esl-challenger-league-season-52-asia-pacific-cup-3',
      stage: 'Cup 3 Grand Final vs. Lynn Vision',
      team1: 'Lynn Vision',
      team2: 'Just Swing/Alter Ego winner',
      score1: null,
      score2: null,
      opponent: 'Lynn Vision',
      opponentRank: 69,
      opponentAsiaRank: 7,
      opponentHltvRank: 39,
      opponentVrs: 1154,
      date: '14th of October 2026',
      time: '15:00',
      status: 'pending',
      hltvStatus: 'Scheduled',
      result: null,
      outcome: null,
      format: 'Best of 3 (Online) * Grand final. Winner qualifies for Season 52 Asia-Pacific Finals.',
      maps: ['TBA', 'TBA', 'TBA'],
      mapScores: [],
      mapSummary: 'Maps TBA (Bo3)',
      vetoes: [],
      winDelta: 72,
      lossDelta: 20
    }
  }
};

let memoryCache = {
  payload: null,
  timestamp: 0
};

function parseRankNumber(str) {
  if (!str) return null;
  const m = /#(\d+)/.exec(String(str));
  return m ? parseInt(m[1], 10) : null;
}

function parseTeamStatsArray(stats) {
  const out = {};
  if (!Array.isArray(stats)) return out;
  for (const line of stats) {
    const vrsMatch = /VRS#(\d+)\((?:ASIA|[\w-]+)#(\d+)\)/i.exec(line);
    if (vrsMatch) {
      out.vrsWorldRank = parseInt(vrsMatch[1], 10);
      out.asiaRank = parseInt(vrsMatch[2], 10);
    }
    const worldMatch = /World ranking#(\d+)(?:\(#(\d+)\))?/i.exec(line);
    if (worldMatch) {
      out.hltvWorldRank = parseInt(worldMatch[1], 10);
      if (worldMatch[2]) out.hltvPeakRank = parseInt(worldMatch[2], 10);
    }
    const ageMatch = /Average player age([\d.]+)/i.exec(line);
    if (ageMatch) {
      out.avgPlayerAge = parseFloat(ageMatch[1]);
    }
  }
  return out;
}

function buildMapSummary(maps, mapScores) {
  if (!Array.isArray(maps) || maps.length === 0) return 'Maps TBA';
  if (maps.every((m) => m === 'TBA')) return `Maps TBA (${maps.length} maps)`;
  const parts = [];
  for (let i = 0; i < maps.length; i++) {
    const mapName = maps[i];
    const s1 = Array.isArray(mapScores) ? mapScores[i * 2] : undefined;
    const s2 = Array.isArray(mapScores) ? mapScores[i * 2 + 1] : undefined;
    if (s1 && s2 && s1 !== '-' && s2 !== '-') {
      parts.push(`${mapName} ${s1}-${s2}`);
    } else if (mapName && mapName !== 'TBA') {
      parts.push(mapName);
    }
  }
  return parts.length > 0 ? parts.join(', ') : 'Maps TBA';
}

function normalizeMatchPayload(baseMatch, liveData) {
  if (!liveData || typeof liveData !== 'object') return { ...baseMatch };
  const merged = {
    ...baseMatch,
    team1: liveData.team1 || baseMatch.team1,
    team2: liveData.team2 || baseMatch.team2,
    score1: liveData.score1 ?? baseMatch.score1,
    score2: liveData.score2 ?? baseMatch.score2,
    time: liveData.time || baseMatch.time,
    date: liveData.date || baseMatch.date,
    format: liveData.format || baseMatch.format,
    hltvStatus: liveData.status || baseMatch.hltvStatus,
    maps: Array.isArray(liveData.maps) && liveData.maps.length > 0 ? liveData.maps : baseMatch.maps,
    mapScores: Array.isArray(liveData.mapScores) && liveData.mapScores.length > 0 ? liveData.mapScores : baseMatch.mapScores,
    vetoes: Array.isArray(liveData.vetoes) && liveData.vetoes.length > 0 ? liveData.vetoes : baseMatch.vetoes
  };

  merged.mapSummary = buildMapSummary(merged.maps, merged.mapScores);

  const rawStatus = String(merged.hltvStatus || '').toLowerCase();
  const s1 = merged.score1 != null ? parseInt(merged.score1, 10) : NaN;
  const s2 = merged.score2 != null ? parseInt(merged.score2, 10) : NaN;

  if (rawStatus.includes('match over') || (!Number.isNaN(s1) && !Number.isNaN(s2) && (s1 >= 2 || s2 >= 2))) {
    merged.status = 'completed';
    const aeIsTeam1 = String(merged.team1 || '').toLowerCase().includes('alter ego');
    const aeIsTeam2 = String(merged.team2 || '').toLowerCase().includes('alter ego');
    if (!Number.isNaN(s1) && !Number.isNaN(s2)) {
      if (aeIsTeam1) {
        merged.result = `${s1}-${s2}`;
        merged.outcome = s1 > s2 ? 'win' : 'loss';
      } else if (aeIsTeam2) {
        merged.result = `${s2}-${s1}`;
        merged.outcome = s2 > s1 ? 'win' : 'loss';
      } else {
        merged.result = `${s1}-${s2}`;
      }
    }
  } else if (rawStatus.includes('live')) {
    merged.status = 'live';
  }

  return merged;
}

async function fetchHltvEndpoint(step, env, forceUpstreamFresh = false) {
  const { path, op, args } = step;
  const sep = path.includes('?') ? '&' : '?';
  const targetUrl = `${HLTV_API_BASE}${path}${forceUpstreamFresh ? `${sep}fresh=1` : ''}`;
  const req = new Request(targetUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });

  try {
    const res = env?.HLTV_API ? await env.HLTV_API.fetch(req) : await fetch(req);
    if (res.ok) {
      const body = await res.json();
      if (body && body.ok) {
        return body;
      }
    }
    throw new Error(`HLTV API ${path} HTTP ${res.status}`);
  } catch (upstreamErr) {
    if (typeof env?.LOCAL_API_ANYTHING === 'function' && op) {
      return await env.LOCAL_API_ANYTHING(op, args || {});
    }
    throw upstreamErr;
  }
}

async function buildLiveTelemetry(env, options = {}) {
  const { forceUpstreamFresh = false, includePlayers = false } = options;
  const t0 = Date.now();
  const baseSource = memoryCache.payload || BASELINE_TELEMETRY;
  const payload = {
    team: JSON.parse(JSON.stringify(baseSource.team || BASELINE_TELEMETRY.team)),
    opponents: JSON.parse(JSON.stringify(baseSource.opponents || BASELINE_TELEMETRY.opponents)),
    players: JSON.parse(JSON.stringify(baseSource.players || BASELINE_TELEMETRY.players)),
    snapshotDeadline: BASELINE_TELEMETRY.snapshotDeadline,
    tournaments: JSON.parse(JSON.stringify(baseSource.tournaments || BASELINE_TELEMETRY.tournaments)),
    matches: JSON.parse(JSON.stringify(baseSource.matches || BASELINE_TELEMETRY.matches))
  };
  const fetchedEndpoints = [];
  const failedEndpoints = [];

  // Poll active match and team operations sequentially so hltv-api reuses one warm browser tab.
  const steps = [
    {
      key: 'm2',
      path: '/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3',
      op: 'getMatch',
      args: { matchId: '2399174', slug: 'just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3' },
      apply: (data) => {
        payload.matches.m2 = normalizeMatchPayload(payload.matches.m2, data);
      }
    },
    {
      key: 'team',
      path: '/teams/9958/alter-ego',
      op: 'getTeam',
      args: { teamId: '9958', slug: 'alter-ego' },
      apply: (data) => {
        const parsed = parseTeamStatsArray(data.stats);
        const vrsRank = parsed.vrsWorldRank || parseRankNumber(data.valveRank) || payload.team.worldRank;
        const hltvRank = parsed.hltvWorldRank || parseRankNumber(data.worldRank) || payload.team.hltvWorldRank;
        payload.team.worldRank = vrsRank;
        payload.team.hltvWorldRank = hltvRank;
        if (parsed.asiaRank) payload.team.asiaRank = parsed.asiaRank;
        if (parsed.hltvPeakRank) payload.team.hltvPeakRank = parsed.hltvPeakRank;
        if (parsed.avgPlayerAge) payload.team.avgPlayerAge = parsed.avgPlayerAge;
        if (data.coach) payload.team.coach = data.coach;
        if (Array.isArray(data.roster) && data.roster.length > 0) payload.team.roster = data.roster;
      }
    },
    {
      key: 'm3',
      path: '/matches/2399175/lynn-vision-vs-tba-esl-challenger-league-season-52-asia-pacific-cup-3',
      op: 'getMatch',
      args: { matchId: '2399175', slug: 'lynn-vision-vs-tba-esl-challenger-league-season-52-asia-pacific-cup-3' },
      apply: (data) => {
        payload.matches.m3 = normalizeMatchPayload(payload.matches.m3, data);
      }
    }
  ];

  if (includePlayers) {
    for (const [key, p] of Object.entries(payload.players)) {
      steps.push({
        key: `player_${key}`,
        path: `/players/${p.playerId}/${p.slug}`,
        op: 'getPlayer',
        args: { playerId: p.playerId, slug: p.slug },
        apply: (data) => {
          payload.players[key] = {
            ...payload.players[key],
            rating: data.rating || payload.players[key].rating,
            dpr: data.dpr || payload.players[key].dpr,
            kpr: data.kpr || payload.players[key].kpr,
            kd: data.kd || payload.players[key].kd,
            impact: data.impact || payload.players[key].impact,
            headshotPct: data.headshotPct || payload.players[key].headshotPct,
            mapsPlayed: data.mapsPlayed || payload.players[key].mapsPlayed
          };
        }
      });
    }
  }

  for (const step of steps) {
    try {
      const res = await fetchHltvEndpoint(step, env, forceUpstreamFresh);
      if (res?.data) {
        step.apply(res.data);
        fetchedEndpoints.push({ key: step.key, path: step.path, ms: res.ms, tier: res.tier });
      }
    } catch (err) {
      failedEndpoints.push({ key: step.key, path: step.path, error: err.message });
    }
  }

  const now = new Date();
  return {
    status: fetchedEndpoints.length > 0 ? 'live' : 'degraded',
    timestamp: now.toISOString(),
    serverTime: now.getTime(),
    ...payload,
    syncMeta: {
      upstreamBaseUrl: HLTV_API_BASE,
      upstreamOk: fetchedEndpoints.length > 0,
      fetchedCount: fetchedEndpoints.length,
      failedCount: failedEndpoints.length,
      fetchedEndpoints,
      failedEndpoints,
      totalMs: Date.now() - t0
    },
    source: 'HLTV REST API (hltv-api.bdrrhmnhnn.workers.dev) & Valve Regional Standings'
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'ae-vrs-live-telemetry',
        upstream: HLTV_API_BASE,
        time: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (url.pathname.startsWith('/api/hltv/')) {
      const subPath = url.pathname.slice('/api/hltv'.length) + url.search;
      try {
        const targetUrl = `${HLTV_API_BASE}${subPath}`;
        const upstreamReq = new Request(targetUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' }
        });
        const upstreamRes = env?.HLTV_API ? await env.HLTV_API.fetch(upstreamReq) : await fetch(upstreamReq);
        const bodyText = await upstreamRes.text();
        return new Response(bodyText, {
          status: upstreamRes.status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (url.pathname === '/api/live') {
      const fresh = url.searchParams.get('fresh') === '1' || url.searchParams.get('nocache') === '1';
      const forceUpstreamFresh = url.searchParams.get('upstream_fresh') === '1';
      const includePlayers = url.searchParams.get('players') === '1';
      const nowMs = Date.now();

      if (!fresh && !includePlayers && memoryCache.payload && (nowMs - memoryCache.timestamp) < CACHE_TTL_MS) {
        const cachedCopy = {
          ...memoryCache.payload,
          serverTime: nowMs,
          syncMeta: {
            ...memoryCache.payload.syncMeta,
            cacheHit: true,
            cacheAgeMs: nowMs - memoryCache.timestamp
          }
        };
        return new Response(JSON.stringify(cachedCopy), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=15, stale-while-revalidate=30'
          }
        });
      }

      // Serve stale memory cache immediately while refreshing in background when not forced fresh.
      if (!fresh && !includePlayers && memoryCache.payload) {
        if (ctx?.waitUntil) {
          ctx.waitUntil((async () => {
            const updated = await buildLiveTelemetry(env, { forceUpstreamFresh: false, includePlayers: false });
            if (updated.syncMeta?.upstreamOk) {
              memoryCache = { payload: updated, timestamp: Date.now() };
            }
          })());
        }
        return new Response(JSON.stringify({
          ...memoryCache.payload,
          serverTime: nowMs,
          syncMeta: {
            ...memoryCache.payload.syncMeta,
            cacheHit: true,
            revalidating: true
          }
        }), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=15, stale-while-revalidate=30'
          }
        });
      }

      const payload = await buildLiveTelemetry(env, { forceUpstreamFresh, includePlayers });
      if (payload.syncMeta?.upstreamOk || !memoryCache.payload) {
        memoryCache = { payload, timestamp: Date.now() };
      }
      return new Response(JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': fresh ? 'no-store' : 'public, max-age=15, stale-while-revalidate=30'
        }
      });
    }

    if (env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Asset binding not found', { status: 404 });
  }
};
