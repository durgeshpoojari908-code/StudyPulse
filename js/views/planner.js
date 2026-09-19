/* StudyPulse Smart Study Planner View */
import { store, getTodayDateStr } from '../store.js';
import { Icons } from '../icons.js';

let selectedDate = getTodayDateStr(0);

function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function renderPlanner(container, navigateTo, openModal) {
  const state = store.getState();

  // Filter sessions for selected date
  const dateSessions = state.sessions.filter(s => s.date === selectedDate);
  const completedMinutes = dateSessions.filter(s => s.completed).reduce((sum, s) => sum + Number(s.duration || 0), 0);
  const goalMinutes = (state.dailyGoalHours || 3) * 60;
  const remainingMinutes = Math.max(0, goalMinutes - completedMinutes);
  const progressPercent = Math.min(100, Math.round((completedMinutes / goalMinutes) * 100));

  // Build 7-day pill strip centered around selected date
  const dayPills = [];
  const curr = new Date(selectedDate);
  for (let i = -3; i <= 3; i++) {
    const d = new Date(curr);
    d.setDate(curr.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const isToday = dateStr === getTodayDateStr(0);
    const isSel = dateStr === selectedDate;
    dayPills.push({ dateStr, dayName, dayNum, isToday, isSel });
  }

  container.innerHTML = `
    <div class="fade-in">
      <!-- Planner Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Smart Study Planner</h1>
          <p>Organize daily focus sessions and hit your daily target of <strong>${state.dailyGoalHours}h</strong>.</p>
        </div>
        <button id="btn-add-planner-session" class="btn-primary">
          ${Icons.plus(16)} Add Study Session
        </button>
      </div>

      <!-- 7-Day Interactive Date Navigator -->
      <div class="planner-day-strip">
        ${dayPills.map(p => `
          <div class="day-pill ${p.isSel ? 'active' : ''}" data-select-date="${p.dateStr}">
            <span class="day-name">${p.dayName}</span>
            <span class="day-num">${p.dayNum}</span>
            ${p.isToday ? '<span style="font-size: 9px; font-weight: 800; text-transform: uppercase;">TODAY</span>' : ''}
          </div>
        `).join('')}
      </div>

      <!-- Daily Goal Progress Metric Bar -->
      <div class="card" style="margin-bottom: var(--space-3);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge badge-primary">TARGET &bull; ${state.dailyGoalHours}H DAILY</span>
            <span style="font-size: 13px; font-weight: 700; color: var(--color-text);">
              ${progressPercent >= 100 ? '🎉 Goal Completed!' : `${progressPercent}% of target`}
            </span>
          </div>
          <span style="font-size: 12px; color: var(--color-text-secondary);">
            ${formatMinutes(completedMinutes)} completed / ${formatMinutes(goalMinutes)} goal
          </span>
        </div>

        <div class="progress-bar-container" style="height: 10px;">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="planner-metrics-bar" style="margin-top: var(--space-2); margin-bottom: 0;">
          <div class="metric-box">
            <span class="metric-box-label">Daily Target</span>
            <span class="metric-box-val">${formatMinutes(goalMinutes)}</span>
          </div>
          <div class="metric-box">
            <span class="metric-box-label">Completed Time</span>
            <span class="metric-box-val" style="color: var(--color-success);">${formatMinutes(completedMinutes)}</span>
          </div>
          <div class="metric-box">
            <span class="metric-box-label">Remaining Time</span>
            <span class="metric-box-val" style="color: ${remainingMinutes > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
              ${formatMinutes(remainingMinutes)}
            </span>
          </div>
        </div>
      </div>

      <!-- Scheduled Sessions List -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${Icons.planner(18)} Study Schedule for ${selectedDate}</h3>
            <span class="card-subtitle">${dateSessions.length} sessions scheduled</span>
          </div>
          <button id="btn-quick-today" class="btn-ghost btn-sm" style="color: var(--color-primary);">
            Jump to Today
          </button>
        </div>

        <div id="planner-sessions-container">
          ${dateSessions.length === 0 ? `
            <div style="text-align: center; padding: var(--space-6); color: var(--color-text-secondary);">
              <span style="font-size: 44px; display: block; margin-bottom: 12px;">📅</span>
              <h3 style="margin-bottom: 6px;">No Sessions Scheduled</h3>
              <p style="margin-bottom: 16px;">Take a break or schedule a study session for ${selectedDate}.</p>
              <button id="btn-add-session-empty" class="btn-primary">
                ${Icons.plus(16)} Plan a Session
              </button>
            </div>
          ` : dateSessions.map(s => `
            <div class="session-card ${s.completed ? 'completed' : ''}">
              <div class="session-left">
                <div class="custom-checkbox ${s.completed ? 'checked' : ''}" data-toggle-session="${s.id}">
                  ${Icons.check(14)}
                </div>
                <div class="session-info">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="session-subject-tag">${s.subject}</span>
                    <span class="badge ${s.priority === 'High' ? 'badge-danger' : s.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}">${s.priority}</span>
                  </div>
                  <span class="session-topic" style="font-size: 15px; margin: 2px 0;">${s.topic}</span>
                  <span class="session-time">
                    ${Icons.clock(12)} Start: <strong>${s.startTime}</strong> &bull; Duration: <strong>${s.duration} mins</strong>
                  </span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn-ghost btn-sm" data-delete-session="${s.id}" style="color: var(--color-text-muted);">
                  ${Icons.trash(15)}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  container.querySelectorAll('[data-select-date]').forEach(pill => {
    pill.addEventListener('click', () => {
      selectedDate = pill.getAttribute('data-select-date');
      renderPlanner(container, navigateTo, openModal);
    });
  });

  container.querySelector('#btn-quick-today')?.addEventListener('click', () => {
    selectedDate = getTodayDateStr(0);
    renderPlanner(container, navigateTo, openModal);
  });

  container.querySelector('#btn-add-planner-session')?.addEventListener('click', () => {
    openModal('add-session', { defaultDate: selectedDate });
  });

  container.querySelector('#btn-add-session-empty')?.addEventListener('click', () => {
    openModal('add-session', { defaultDate: selectedDate });
  });

  // Toggle session complete
  container.querySelectorAll('[data-toggle-session]').forEach(box => {
    box.addEventListener('click', () => {
      const id = box.getAttribute('data-toggle-session');
      store.toggleSession(id);
      renderPlanner(container, navigateTo, openModal);
    });
  });

  // Delete session
  container.querySelectorAll('[data-delete-session]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-session');
      if (confirm("Delete this scheduled study session?")) {
        store.deleteSession(id);
        renderPlanner(container, navigateTo, openModal);
      }
    });
  });
}
