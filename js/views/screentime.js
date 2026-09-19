/* StudyPulse Screen Time Analytics View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

let activeFilter = "Today"; // "Today" | "Week" | "Month"

function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function renderScreenTime(container, navigateTo, openModal) {
  const state = store.getState();
  const studyMin = store.calculateTodayStudyMinutes() || 165;
  const screenMin = state.screenTimeToday || 272; // 4h 32m
  const focusRatio = Math.min(100, Math.round((studyMin / screenMin) * 100));

  const apps = state.screenTimeApps || [
    { name: "YouTube", minutes: 85, color: "#EF4444" },
    { name: "Instagram", minutes: 55, color: "#EC4899" },
    { name: "Chrome", minutes: 45, color: "#F59E0B" },
    { name: "Learning Docs", minutes: 50, color: "#10B981" },
    { name: "Other", minutes: 37, color: "#64748B" }
  ];

  // SVG Donut Chart Calculation
  const totalAppMin = apps.reduce((sum, a) => sum + a.minutes, 0);
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  let runningOffset = 0;

  const slices = apps.map(app => {
    const fraction = app.minutes / totalAppMin;
    const dashLength = fraction * circ;
    const slice = {
      ...app,
      dashLength,
      offset: -runningOffset
    };
    runningOffset += dashLength;
    return slice;
  });

  container.innerHTML = `
    <div class="fade-in">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Screen Time & Focus</h1>
          <p>Analyze digital distraction versus active study time to improve consistency.</p>
        </div>

        <div class="tabs-nav" style="margin-bottom: 0;">
          <button class="tab-btn ${activeFilter === 'Today' ? 'active' : ''}" data-screen-tab="Today">Today</button>
          <button class="tab-btn ${activeFilter === 'Week' ? 'active' : ''}" data-screen-tab="Week">Week</button>
          <button class="tab-btn ${activeFilter === 'Month' ? 'active' : ''}" data-screen-tab="Month">Month</button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-3-col" style="margin-bottom: var(--space-3);">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-danger-light); color: var(--color-danger);">
            ${Icons.smartphone(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Total Screen Time</span>
            <span class="stat-value">${formatMinutes(screenMin)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
            ${Icons.clock(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Active Study Time</span>
            <span class="stat-value">${formatMinutes(studyMin)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
            ${Icons.trendingUp(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Focus Ratio</span>
            <span class="stat-value" style="color: var(--color-primary);">${focusRatio}%</span>
          </div>
        </div>
      </div>

      <!-- Donut Chart & Breakdown Card -->
      <div class="grid-dashboard">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${Icons.smartphone(18)} App Distribution</h3>
              <span class="card-subtitle">Breakdown across applications</span>
            </div>
          </div>

          <div class="screentime-chart-wrap">
            <!-- Donut SVG -->
            <div style="position: relative; width: 160px; height: 160px;">
              <svg width="160" height="160" viewBox="0 0 160 160" style="transform: rotate(-90deg);">
                ${slices.map(s => `
                  <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${s.color}" stroke-width="16"
                    stroke-dasharray="${s.dashLength} ${circ}" stroke-dashoffset="${s.offset}" style="transition: all 0.6s ease;" />
                `).join('')}
              </svg>
              <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span style="font-size: 20px; font-weight: 800; color: var(--color-text);">${formatMinutes(screenMin)}</span>
                <span style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase;">Total Usage</span>
              </div>
            </div>

            <!-- Legend -->
            <div class="donut-legend">
              ${apps.map(app => `
                <div class="donut-legend-item">
                  <div class="donut-legend-color" style="background: ${app.color};"></div>
                  <span style="font-weight: 600; min-width: 100px;">${app.name}</span>
                  <span style="color: var(--color-text-secondary); font-size: 12.5px;">${formatMinutes(app.minutes)}</span>
                  <span style="font-size: 11px; color: var(--color-text-muted);">(${Math.round((app.minutes / totalAppMin) * 100)}%)</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Focus Ratio & Habits Advice -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.target(18)} Focus Efficiency</h3>
            <span class="badge ${focusRatio >= 50 ? 'badge-success' : 'badge-warning'}">
              ${focusRatio >= 50 ? 'Healthy Balance' : 'Needs Attention'}
            </span>
          </div>

          <p style="margin-bottom: var(--space-2); font-size: 13.5px;">
            Your Focus Ratio represents the proportion of productive study time against non-study screen time.
          </p>

          <div style="margin-bottom: var(--space-3);">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span>Study vs Social/Media</span>
              <strong>${focusRatio}% Focus Score</strong>
            </div>
            <div class="progress-bar-container" style="height: 12px;">
              <div class="progress-bar-fill" style="width: ${focusRatio}%;"></div>
            </div>
          </div>

          <div class="insight-card">
            <span class="insight-card-icon">💡</span>
            <div class="insight-card-text">
              <strong>Productivity Tip:</strong> Replacing 30 minutes of YouTube with your ${state.subjects[0]?.name || 'core subject'} study session would boost your focus ratio to <strong>${Math.min(100, focusRatio + 14)}%</strong>.
            </div>
          </div>

          <div style="margin-top: var(--space-3); padding-top: var(--space-2); border-top: 1px solid var(--color-border-subtle); font-size: 11.5px; color: var(--color-text-muted);">
            * Simulated local activity data for academic privacy. No third-party device tracking software required.
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('[data-screen-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-screen-tab');
      renderScreenTime(container, navigateTo, openModal);
    });
  });
}
