// Asian VRS Standings Baseline (October 12, 2026 Snapshot)
export const initialTeams = [
  { name: "BC.Game", points: 1272, note: "Region Review", vrsWorld: 46, asiaRank: 1, hltvRank: 70 },
  { name: "TYLOO", points: 1269, note: "Locked", vrsWorld: 47, asiaRank: 2, hltvRank: 33 },
  { name: "The MongolZ", points: 1238, note: "Locked", vrsWorld: 53, asiaRank: 3, hltvRank: 21 },
  { name: "Chinggis Warriors", points: 1201, note: "MESA Champ", vrsWorld: 58, asiaRank: 4, hltvRank: 61 },
  { name: "FlyQuest", points: 1191, note: "Brisbane LAN", vrsWorld: 62, asiaRank: 5, hltvRank: 67 },
  { name: "5star", points: 1163, note: "Contender", vrsWorld: 65, asiaRank: 6, hltvRank: 34 },
  { name: "Lynn Vision", points: 1154, note: "Cup 3 Final", vrsWorld: 69, asiaRank: 7, hltvRank: 39 },
  { name: "NEXVOID", points: 1008, note: "Brisbane LAN", vrsWorld: 106, asiaRank: 8, hltvRank: 101 },
  { name: "DEPO", points: 1005, note: "", vrsWorld: 108, asiaRank: 9, hltvRank: 121 },
  { name: "Ground Zero", points: 946, note: "Brisbane LAN", vrsWorld: 122, asiaRank: 10, hltvRank: 133 },
  { name: "The Huns", points: 900, note: "", vrsWorld: 128, asiaRank: 12, hltvRank: 125 },
  { name: "Alter Ego", points: 866, isAE: true, vrsWorld: 133, asiaRank: 13, hltvRank: 120 },
  { name: "Abyssal", points: 876, note: "Brisbane LAN", vrsWorld: 136, asiaRank: 14, hltvRank: 130 },
  { name: "THUNDER dOWNUNDER", points: 862, note: "Core Inactive", vrsWorld: null, asiaRank: null, hltvRank: null },
  { name: "Rare Atom", points: 860, note: "", vrsWorld: 140, asiaRank: 15, hltvRank: 113 },
  { name: "Kaleido", points: 774, note: "", vrsWorld: 167, asiaRank: 16, hltvRank: 145 },
  { name: "Just Swing", points: 773, note: "Cup 3", vrsWorld: 172, asiaRank: 17, hltvRank: 158 }
];

export const liveBaseline = {
  vrsPoints: 866,
  asiaRank: 13,
  worldRank: 133,
  hltvWorldRank: 120,
  targetPoints: 1191
};

export const userModifiedMatches = new Set();

export const state = {
  m2: 'none',       // Consolidation Final vs Just Swing: win (+14), loss (-19)
  m3: 'na',         // Cup 3 Grand Final vs Lynn Vision: win (+72), loss (+20), na
  df_group: 'none', // 1 (+40), 2 (+20), 0 (-15)
  df_nex: 'na',     // win (+55), loss (-10), na
  df_fq: 'na',      // win (+75), loss (-12), na
  df_place: 'na'    // champ (+60), 2nd (+25), na
};

export function setMatch(key, value, isManual = true) {
  if (isManual) {
    userModifiedMatches.add(key);
  }
  state[key] = value;

  if (key === 'm2' && value === 'loss') {
    state.m3 = 'na';
  } else if (key === 'm2' && value === 'win' && state.m3 === 'na') {
    state.m3 = 'win';
  }
}

export function applyPresetState(preset) {
  userModifiedMatches.clear();
  if (preset === 'base') {
    Object.assign(state, { m2: 'none', m3: 'na', df_group: 'none', df_nex: 'na', df_fq: 'na', df_place: 'na' });
  } else if (preset === 'cup3_win') {
    Object.assign(state, { m2: 'win', m3: 'win', df_group: 'none', df_nex: 'na', df_fq: 'na', df_place: 'na' });
  } else if (preset === 'dfrag_win') {
    Object.assign(state, { m2: 'win', m3: 'loss', df_group: '1', df_nex: 'win', df_fq: 'win', df_place: 'champ' });
  } else if (preset === 'double_champ') {
    Object.assign(state, { m2: 'win', m3: 'win', df_group: '1', df_nex: 'win', df_fq: 'win', df_place: 'champ' });
  }
}

export function calculatePoints() {
  let delta = 0;

  // Cup 3 (m1 vs Chinggis Warriors 2-0 win [+36 pts] already banked in 866 baseline)
  if (state.m2 === 'win') delta += 14;
  if (state.m2 === 'loss') delta -= 19;
  if (state.m3 === 'win') delta += 72;
  if (state.m3 === 'loss') delta += 20;

  if (state.df_group === '1') delta += 40;
  if (state.df_group === '2') delta += 20;
  if (state.df_group === '0') delta -= 15;

  if (state.df_nex === 'win') delta += 55;
  if (state.df_nex === 'loss') delta -= 10;

  if (state.df_fq === 'win') delta += 75;
  if (state.df_fq === 'loss') delta -= 12;

  if (state.df_place === 'champ') delta += 60;
  if (state.df_place === '2nd') delta += 25;

  const base = liveBaseline.vrsPoints;
  return { base, delta, total: Math.max(780, base + delta) };
}
