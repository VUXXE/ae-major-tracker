export function renderLeaderboard(teams, searchQuery) {
  const tbody = document.getElementById('leaderboardBody');
  const emptyState = document.getElementById('emptySearchState');
  if (!tbody || !emptyState) return;

  tbody.innerHTML = '';
  const query = searchQuery.trim().toLowerCase();
  const filtered = teams.filter(t => t.name.toLowerCase().includes(query));

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    const queryEl = document.getElementById('emptySearchQueryText');
    if (queryEl) {
      queryEl.innerText = searchQuery.trim();
    }
    return;
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach(team => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-card-border-subtle hover:bg-card-surface/60 transition-colors text-xs';
    if (team.isAE) {
      tr.classList.add('team-ae');
    }

    let statusBadge = '<span class="status-tag inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-card-surface text-text-muted">Out</span>';
    if (team.rank <= 5) {
      statusBadge = '<span class="status-tag inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-accent-green-bg text-accent-green border border-accent-green/30">Major Slot</span>';
    } else if (team.rank <= 7) {
      statusBadge = '<span class="status-tag inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[2px] bg-accent-gold-bg text-accent-gold border border-accent-gold/30">Bubble</span>';
    }

    tr.innerHTML = `
      <td class="py-2 px-2.5 text-center font-bold tabular-nums text-text-muted w-8">${team.rank}</td>
      <td class="py-2 px-2.5">
        <div class="inline-flex items-center gap-2">
          ${team.isAE ? '<img src="/assets/alter_ego_logo.png" alt="Alter Ego" class="w-4 h-4 object-contain shrink-0">' : ''}
          <div class="leading-tight">
            <span class="text-text-primary font-bold hover:underline cursor-default">${team.name}</span>
            ${team.vrsWorld ? `<span class="text-[10px] text-text-muted ml-1 tabular-nums font-semibold">(#${team.vrsWorld} VRS)</span>` : ''}
            ${team.note ? `<span class="text-[10px] text-text-muted ml-1">(${team.note})</span>` : ''}
          </div>
        </div>
      <td class="py-2 px-2.5 text-right font-bold tabular-nums text-text-primary">${team.points}</td>
      <td class="py-2 px-2.5 text-right">${statusBadge}</td>
    `;
    tbody.appendChild(tr);

    // Render Cutoff Line after rank 5 when no search filter is active
    if (!query && team.rank === 5) {
      const cutTr = document.createElement('tr');
      cutTr.className = 'cutoff-line';
      cutTr.innerHTML = `
        <td colspan="4" class="p-0">
          <div class="cutoff-indicator bg-accent-gold-bg text-accent-gold text-[10px] font-extrabold text-center py-1 uppercase tracking-wider">
            Cutoff Threshold: Top 5 Direct Major Slot
          </div>
        </td>
      `;
      tbody.appendChild(cutTr);
    }
  });
}
