import './style.css';
import { initialTeams, liveBaseline, userModifiedMatches, state, setMatch, applyPresetState, calculatePoints } from './state.js';
import { renderLeaderboard } from './leaderboard.js';

const HLTV_DIRECT_API = 'https://hltv-api.bdrrhmnhnn.workers.dev';
let searchQuery = '';
let cachedSortedTeams = [];
let isSyncing = false;

function updateButtons() {
  const keys = ['m2', 'm3', 'df_group', 'df_nex', 'df_fq', 'df_place'];
  keys.forEach((k) => {
    document.querySelectorAll(`[data-match="${k}"]`).forEach((btn) => {
      btn.className = 'toggle-opt';
      btn.removeAttribute('aria-pressed');
    });

    const activeVal = state[k];
    const selected = document.querySelector(`[data-match="${k}"][data-val="${activeVal}"]`);
    if (selected) {
      selected.setAttribute('aria-pressed', 'true');
      if (activeVal === 'win' || activeVal === 'champ' || activeVal === '1') {
        selected.classList.add('selected-win');
      } else if (activeVal === 'loss' || activeVal === '0') {
        selected.classList.add('selected-loss');
      } else {
        selected.classList.add('selected-na');
      }
    }
  });
}

export function render() {
  updateButtons();
  const { base, delta, total } = calculatePoints();

  const baselineLabelEl = document.getElementById('baselinePointsLabel');
  if (baselineLabelEl) baselineLabelEl.innerText = `${base} pts`;

  const deficit = liveBaseline.targetPoints - total;
  const deficitEl = document.getElementById('deficitPoints');
  if (deficitEl) {
    if (deficit > 0) {
      deficitEl.innerText = `-${deficit} pts needed`;
      deficitEl.style.color = 'var(--color-accent-red, #ff6b78)';
    } else {
      deficitEl.innerText = `+${Math.abs(deficit)} pts surplus (Secure)`;
      deficitEl.style.color = 'var(--color-accent-green, #22c55e)';
    }
  }

  const ptsEl = document.getElementById('projectedPts');
  if (ptsEl) ptsEl.innerText = total;

  const deltaEl = document.getElementById('ptsDelta');
  if (deltaEl) {
    deltaEl.innerText = (delta >= 0 ? '+' : '') + delta + ' pts';
    deltaEl.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded tabular-nums ' +
      (delta > 0 ? 'bg-accent-green-bg text-accent-green' : (delta < 0 ? 'bg-accent-red-bg text-accent-red' : 'bg-card-surface text-text-secondary'));
  }

  const teams = JSON.parse(JSON.stringify(initialTeams));
  const ae = teams.find((t) => t.isAE);
  if (ae) ae.points = total;

  teams.sort((a, b) => b.points - a.points);
  teams.forEach((t, i) => { t.rank = i + 1; });
  cachedSortedTeams = teams;

  const baseAsiaRank = liveBaseline.asiaRank || 14;
  const aeRank = teams.find((t) => t.isAE)?.rank || baseAsiaRank;
  const rankEl = document.getElementById('projectedAsiaRank');
  if (rankEl) rankEl.innerText = '#' + aeRank;
  const rankTopEl = document.getElementById('projectedAsiaRankTop');
  if (rankTopEl) rankTopEl.innerText = '#' + aeRank + ' Asia';

  const rankDeltaEl = document.getElementById('rankDelta');
  if (rankDeltaEl) {
    const rankImprovement = baseAsiaRank - aeRank;
    rankDeltaEl.innerText = rankImprovement > 0 ? `+${rankImprovement} spots` : (rankImprovement < 0 ? `${rankImprovement}` : 'Baseline');
    rankDeltaEl.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded tabular-nums ' +
      (rankImprovement > 0 ? 'bg-accent-green-bg text-accent-green' : (rankImprovement < 0 ? 'bg-accent-red-bg text-accent-red' : 'bg-card-surface text-text-secondary'));
  }

  const baseWorldRank = liveBaseline.worldRank || 137;
  let estWorld = delta < 0 ? Math.round(baseWorldRank - (delta * 0.315)) : Math.round(baseWorldRank - (delta * 0.28));
  if (estWorld < 48) estWorld = 48;
  const worldRankEl = document.getElementById('projectedWorldRank');
  if (worldRankEl) worldRankEl.innerText = '#' + estWorld;

  const worldRankTopEl = document.getElementById('projectedWorldRankTop');
  if (worldRankTopEl) {
    worldRankTopEl.innerText = `(#${estWorld} VRS • #${liveBaseline.hltvWorldRank || 120} HLTV)`;
  }

  const worldDeltaEl = document.getElementById('worldDelta');
  if (worldDeltaEl) {
    const worldImprovement = baseWorldRank - estWorld;
    worldDeltaEl.innerText = worldImprovement > 0 ? `+${worldImprovement} spots` : (worldImprovement < 0 ? `${worldImprovement} spots` : 'Baseline');
    worldDeltaEl.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded tabular-nums ' +
      (worldImprovement > 0 ? 'bg-accent-green-bg text-accent-green' : (worldImprovement < 0 ? 'bg-accent-red-bg text-accent-red' : 'bg-card-surface text-text-secondary'));
  }

  let prob = 2;
  if (total >= 1180) prob = 88;
  else if (total >= 1120) prob = 48;
  else if (total >= 1060) prob = 28;
  else if (total >= 940) prob = 12;
  else if (total >= 890) prob = 5;
  else if (total >= 875) prob = 3;
  const probPercentEl = document.getElementById('probPercent');
  if (probPercentEl) probPercentEl.innerText = prob + '%';

  const probFill = document.getElementById('probBarFill');
  if (probFill) probFill.style.width = prob + '%';

  const probBadge = document.getElementById('probBadge');
  if (probBadge && probFill) {
    if (prob >= 60) {
      probBadge.innerText = 'High Contender';
      probBadge.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded bg-accent-green-bg text-accent-green';
      probFill.style.backgroundColor = 'var(--color-accent-green, #22c55e)';
    } else if (prob >= 20) {
      probBadge.innerText = 'Bubble';
      probBadge.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded bg-accent-gold-bg text-accent-gold';
      probFill.style.backgroundColor = 'var(--color-accent-gold, #f59e0b)';
    } else {
      probBadge.innerText = 'Unlikely';
      probBadge.className = 'delta text-[11px] font-bold py-0.5 px-1.5 rounded bg-accent-red-bg text-accent-red';
      probFill.style.backgroundColor = 'var(--color-accent-red, #ff6b78)';
    }
  }

  renderLeaderboard(cachedSortedTeams, searchQuery);
}

function updateCountdown() {
  const target = new Date('2026-11-02T00:00:00Z').getTime();
  const now = new Date().getTime();
  const diff = target - now;

  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');
  const secsEl = document.getElementById('countdownSecs');
  const timerEl = document.getElementById('countdownTimer');

  if (diff <= 0) {
    if (timerEl) timerEl.innerText = 'Snapshot Active';
    if (daysEl) daysEl.innerText = '00';
    if (hoursEl) hoursEl.innerText = '00';
    if (minsEl) minsEl.innerText = '00';
    if (secsEl) secsEl.innerText = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');

  if (daysEl) daysEl.innerText = pad(days);
  if (hoursEl) hoursEl.innerText = pad(hours);
  if (minsEl) minsEl.innerText = pad(mins);
  if (secsEl) secsEl.innerText = pad(secs);
  if (timerEl) timerEl.innerText = `${days}d ${hours}h ${mins}m ${secs}s`;
}

function formatHltvBadgeStatus(match) {
  if (!match) return '';
  const rawStatus = String(match.hltvStatus || '');
  if (match.status === 'completed') {
    return `Match over${match.result ? ` • ${match.result}` : ''}`;
  }
  if (match.status === 'live' || rawStatus.toLowerCase().includes('live')) {
    return `LIVE${match.score1 != null && match.score2 != null ? ` • ${match.score1}-${match.score2}` : ''}`;
  }
  if (rawStatus && /\d+\s*[dhms]/i.test(rawStatus)) {
    return `In ${rawStatus.replace(/\s+/g, ' ')}`;
  }
  return `${match.date || ''} ${match.time ? `• ${match.time}` : ''}`.trim();
}

function applyLiveTelemetryToDom(data) {
  if (!data) return;

  if (data.team) {
    if (typeof data.team.vrsPoints === 'number') {
      liveBaseline.vrsPoints = data.team.vrsPoints;
      const baseAe = initialTeams.find((t) => t.isAE);
      if (baseAe) baseAe.points = data.team.vrsPoints;
    }
    if (typeof data.team.asiaRank === 'number') liveBaseline.asiaRank = data.team.asiaRank;
    if (typeof data.team.worldRank === 'number') liveBaseline.worldRank = data.team.worldRank;
    if (typeof data.team.hltvWorldRank === 'number') liveBaseline.hltvWorldRank = data.team.hltvWorldRank;

    const coachEl = document.getElementById('teamCoachName');
    if (coachEl && data.team.coach) {
      coachEl.innerText = data.team.coach;
    }
  }

  const ecl = data.tournaments?.ecl_cup3;
  if (ecl) {
    const titleEl = document.getElementById('eclEventTitle');
    if (titleEl && ecl.name) titleEl.innerText = ecl.name;
    const statusEl = document.getElementById('eclStatusBadge');
    if (statusEl && ecl.status) {
      statusEl.innerText = `${ecl.status}${ecl.teamsCount ? ` • ${ecl.teamsCount} Teams` : ''}`;
    }
    const datesEl = document.getElementById('eclDatesText');
    if (datesEl && ecl.dates) datesEl.innerText = ecl.dates;
    const prizeEl = document.getElementById('eclPrizeText');
    if (prizeEl && ecl.prize) prizeEl.innerText = ecl.prize;
  }

  const m1 = data.matches?.m1;
  if (m1) {
    const m1Badge = document.getElementById('m1StatusBadge');
    if (m1Badge) m1Badge.innerText = formatHltvBadgeStatus(m1);
    const m1MapEl = document.getElementById('m1MapSummary');
    if (m1MapEl && m1.mapSummary) {
      m1MapEl.innerText = `Maps: ${m1.mapSummary}`;
    }
    const vetoListEl = document.getElementById('m1VetoList');
    const vetoBtnEl = document.getElementById('m1VetoToggleBtn');
    if (vetoListEl && Array.isArray(m1.vetoes) && m1.vetoes.length > 0) {
      vetoListEl.innerHTML = m1.vetoes.map((v) => `<li>${v}</li>`).join('');
      if (vetoBtnEl) {
        const expanded = vetoBtnEl.getAttribute('aria-expanded') === 'true';
        vetoBtnEl.innerText = `${expanded ? 'Hide Veto' : 'Map Veto'} (${m1.vetoes.length})`;
      }
    }
  }

  const m2 = data.matches?.m2;
  if (m2) {
    const m2Badge = document.getElementById('m2StatusBadge');
    if (m2Badge) {
      m2Badge.innerText = formatHltvBadgeStatus(m2);
      if (m2.status === 'live') {
        m2Badge.className = 'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] bg-accent-red-bg text-accent-red border border-accent-red/40 tabular-nums';
      } else if (m2.status === 'completed') {
        m2Badge.className = 'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] bg-accent-green-bg text-accent-green border border-accent-green/40 tabular-nums';
      }
    }
    const m2MapEl = document.getElementById('m2MapSummary');
    if (m2MapEl) {
      const fmt = m2.format ? m2.format.replace(/\s+/g, ' ') : 'Best of 3 (Online)';
      m2MapEl.innerText = `${fmt} • ${m2.mapSummary || 'Maps TBA'}`;
    }

    const nextSummaryEl = document.getElementById('nextMatchSummary');
    const nextLinkEl = document.getElementById('nextMatchLink');
    if (nextSummaryEl) {
      const badgeText = formatHltvBadgeStatus(m2);
      nextSummaryEl.innerHTML = `Next Match: <strong class="text-text-secondary">${m2.team1 || 'Just Swing'} vs. ${m2.team2 || 'Alter Ego'}</strong> (${badgeText})`;
    }
    if (nextLinkEl && m2.hltvUrl) {
      nextLinkEl.href = m2.hltvUrl;
    }

    if (m2.status === 'completed' && (m2.outcome === 'win' || m2.outcome === 'loss') && !userModifiedMatches.has('m2')) {
      setMatch('m2', m2.outcome, false);
    }
  }

  const m3 = data.matches?.m3;
  if (m3) {
    const m3Badge = document.getElementById('m3StatusBadge');
    if (m3Badge) m3Badge.innerText = formatHltvBadgeStatus(m3);
    const m3MapEl = document.getElementById('m3MapSummary');
    if (m3MapEl) {
      const matchup = m3.team1 && m3.team2 ? `${m3.team1} vs. ${m3.team2}` : 'Lynn Vision vs. TBA';
      m3MapEl.innerText = `${matchup} • ${m3.mapSummary || 'Maps TBA'}`;
    }
    if (m3.status === 'completed' && (m3.outcome === 'win' || m3.outcome === 'loss') && !userModifiedMatches.has('m3')) {
      setMatch('m3', m3.outcome, false);
    }
  }

  if (data.players && typeof data.players === 'object') {
    for (const [key, p] of Object.entries(data.players)) {
      const ratingEl = document.querySelector(`[data-player-rating="${key}"]`);
      if (ratingEl && p.rating) ratingEl.innerText = p.rating;
      const dprEl = document.querySelector(`[data-player-dpr="${key}"]`);
      if (dprEl && p.dpr) dprEl.innerText = p.dpr;
      const kprEl = document.querySelector(`[data-player-kpr="${key}"]`);
      if (kprEl && p.kpr) kprEl.innerText = p.kpr;
      const mapsEl = document.querySelector(`[data-player-maps="${key}"]`);
      if (mapsEl && p.mapsPlayed) mapsEl.innerText = `${p.mapsPlayed} maps`;
    }
  }

  render();
}

async function fetchDirectHltvFallback() {
  const [teamRes, m2Res, m3Res] = await Promise.all([
    fetch(`${HLTV_DIRECT_API}/teams/9958/alter-ego`).then((r) => r.json()),
    fetch(`${HLTV_DIRECT_API}/matches/2399174/just-swing-vs-alter-ego-esl-challenger-league-season-52-asia-pacific-cup-3`).then((r) => r.json()),
    fetch(`${HLTV_DIRECT_API}/matches/2399175/lynn-vision-vs-tba-esl-challenger-league-season-52-asia-pacific-cup-3`).then((r) => r.json())
  ]);

  const valveRankMatch = /#(\d+)/.exec(teamRes?.data?.valveRank || '');
  const hltvRankMatch = /#(\d+)/.exec(teamRes?.data?.worldRank || '');
  const asiaRankMatch = /ASIA#(\d+)/i.exec((teamRes?.data?.stats || []).join(' '));

  return {
    status: 'live',
    serverTime: Date.now(),
    team: {
      vrsPoints: liveBaseline.vrsPoints,
      worldRank: valveRankMatch ? parseInt(valveRankMatch[1], 10) : 137,
      hltvWorldRank: hltvRankMatch ? parseInt(hltvRankMatch[1], 10) : 120,
      asiaRank: asiaRankMatch ? parseInt(asiaRankMatch[1], 10) : 14,
      coach: teamRes?.data?.coach
    },
    matches: {
      m2: m2Res?.data ? {
        team1: m2Res.data.team1,
        team2: m2Res.data.team2,
        time: m2Res.data.time,
        date: m2Res.data.date,
        hltvStatus: m2Res.data.status,
        format: m2Res.data.format,
        maps: m2Res.data.maps,
        mapSummary: Array.isArray(m2Res.data.maps) && m2Res.data.maps.every((m) => m === 'TBA') ? 'Maps TBA (3 maps)' : (m2Res.data.maps || []).join(', ')
      } : null,
      m3: m3Res?.data ? {
        team1: m3Res.data.team1,
        team2: m3Res.data.team2,
        time: m3Res.data.time,
        date: m3Res.data.date,
        hltvStatus: m3Res.data.status,
        format: m3Res.data.format
      } : null
    },
    syncMeta: {
      upstreamOk: Boolean(teamRes?.ok || m2Res?.ok),
      fetchedCount: [teamRes, m2Res, m3Res].filter((x) => x?.ok).length
    }
  };
}

async function syncLiveTelemetry(options = {}) {
  if (isSyncing) return;
  isSyncing = true;

  const { fresh = false, includePlayers = false } = options;
  const syncStatusEl = document.getElementById('liveSyncStatus');
  const refreshBtn = document.getElementById('refreshTelemetryBtn');
  const bannerEl = document.getElementById('telemetryBanner');
  const bannerTextEl = document.getElementById('telemetryBannerText');

  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.setAttribute('aria-busy', 'true');
    refreshBtn.innerText = 'Syncing...';
  }
  if (syncStatusEl && fresh) {
    syncStatusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-accent-gold inline-block shrink-0" aria-hidden="true"></span><span>HLTV API: Fetching live telemetry...</span>`;
  }

  try {
    const query = new URLSearchParams();
    if (fresh) query.set('fresh', '1');
    if (includePlayers) query.set('players', '1');
    const qs = query.toString();
    const apiUrl = `/api/live${qs ? `?${qs}` : ''}`;

    let data = null;
    try {
      const res = await fetch(apiUrl);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`HTTP ${res.status}`);
      }
      data = await res.json();
    } catch {
      data = await fetchDirectHltvFallback();
    }

    applyLiveTelemetryToDom(data);

    const timeStr = new Date(data.serverTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const upstreamOk = data.syncMeta?.upstreamOk !== false;
    const fetchedCount = data.syncMeta?.fetchedCount ?? 0;

    if (syncStatusEl) {
      if (upstreamOk) {
        syncStatusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-accent-green inline-block shrink-0" aria-hidden="true"></span><span>HLTV Live (${timeStr} • ${fetchedCount} ops synced)</span>`;
      } else {
        syncStatusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-accent-gold inline-block shrink-0" aria-hidden="true"></span><span>HLTV Baseline (${timeStr})</span>`;
      }
    }

    if (bannerEl) {
      if (upstreamOk) {
        bannerEl.classList.add('hidden');
      } else {
        bannerEl.classList.remove('hidden');
        if (bannerTextEl) {
          bannerTextEl.innerText = 'Upstream HLTV browser session is warming up. Showing verified October 13 baseline until the next sync.';
        }
      }
    }
  } catch (err) {
    console.error('Live sync error:', err);
    if (syncStatusEl) {
      syncStatusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-accent-gold inline-block shrink-0" aria-hidden="true"></span><span>Sync: Cached Baseline (Offline)</span>`;
    }
    if (bannerEl) {
      bannerEl.classList.remove('hidden');
      if (bannerTextEl) {
        bannerTextEl.innerText = 'Could not reach the live HLTV API endpoint. Showing verified October 13 baseline standings and match schedules.';
      }
    }
  } finally {
    isSyncing = false;
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.removeAttribute('aria-busy');
      refreshBtn.innerText = 'Sync HLTV';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-preset]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const presetName = btn.getAttribute('data-preset');
      applyPresetState(presetName);
      render();
    });
  });

  document.querySelectorAll('[data-match]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const matchKey = btn.getAttribute('data-match');
      const matchVal = btn.getAttribute('data-val');
      document.querySelectorAll('[data-preset]').forEach((b) => b.classList.remove('active'));
      setMatch(matchKey, matchVal, true);
      render();
    });
  });

  const searchInput = document.getElementById('teamSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderLeaderboard(cachedSortedTeams, searchQuery);
    });
  }

  const resetSearchBtn = document.getElementById('resetSearchBtn');
  if (resetSearchBtn && searchInput) {
    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      renderLeaderboard(cachedSortedTeams, '');
      searchInput.focus();
    });
  }

  const refreshBtn = document.getElementById('refreshTelemetryBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      syncLiveTelemetry({ fresh: true, includePlayers: false });
    });
  }

  const retryBtn = document.getElementById('retryTelemetryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      syncLiveTelemetry({ fresh: true, includePlayers: false });
    });
  }

  const vetoToggleBtn = document.getElementById('m1VetoToggleBtn');
  const vetoPanel = document.getElementById('m1VetoPanel');
  if (vetoToggleBtn && vetoPanel) {
    vetoToggleBtn.addEventListener('click', () => {
      const isExpanded = vetoToggleBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      vetoToggleBtn.setAttribute('aria-expanded', String(nextState));
      vetoPanel.classList.toggle('hidden', !nextState);
      const count = document.querySelectorAll('#m1VetoList li').length || 7;
      vetoToggleBtn.innerText = `${nextState ? 'Hide Veto' : 'Map Veto'} (${count})`;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && vetoToggleBtn.getAttribute('aria-expanded') === 'true') {
        vetoToggleBtn.setAttribute('aria-expanded', 'false');
        vetoPanel.classList.add('hidden');
        const count = document.querySelectorAll('#m1VetoList li').length || 7;
        vetoToggleBtn.innerText = `Map Veto (${count})`;
        vetoToggleBtn.focus();
      }
    });
  }

  syncLiveTelemetry();
  setInterval(() => syncLiveTelemetry(), 30000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncLiveTelemetry();
    }
  });

  setInterval(updateCountdown, 1000);
  updateCountdown();
  render();
});
