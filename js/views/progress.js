/* StudyPulse Progress & Analytics View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

export function renderProgress(container, navigateTo, openModal) {
  const state = store.getState();
  const overallProgress = store.calculateOverallProgress();
  const completedTasksCount = state.tasks.filter(t => t.status === "completed").length;
  const totalStudyHours = Math.round(state.subjects.reduce((sum, s) => sum + (s.studyHours || 0), 0) * 10) / 10;
  const insights = store.generateStudyInsights();

  // Weekly study distribution (Mon - Sun)
  const days = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 3.5 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 1.0 },
    { day: "Sun", hours: 1.5 }
  ];
  const maxHours = Math.max(...days.map(d => d.hours), 4);

  container.innerHTML = `
    <div class="fade-in">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Academic Analytics</h1>
          <p>Holistic performance metrics, weekly study curves, and consistency metrics.</p>
        </div>
        <div style="display: flex; gap: var(--space-1);">
          <span class="badge badge-success" style="font-size: 12px; padding: 6px 12px;">
            +12% Improvement vs Last Week
          </span>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-4-col" style="margin-bottom: var(--space-3);">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
            ${Icons.trendingUp(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Overall Progress</span>
            <span class="stat-value">${overallProgress}%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
            ${Icons.clock(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Total Study Time</span>
            <span class="stat-value">${totalStudyHours}h</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
            ${Icons.checkSquare(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Tasks Completed</span>
            <span class="stat-value">${completedTasksCount}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-danger-light); color: var(--color-danger);">
            ${Icons.flame(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Active Streak</span>
            <span class="stat-value">${state.studyStreak || 6} days</span>
          </div>
        </div>
      </div>

      <!-- 2-Column Dashboard Layout -->
      <div class="grid-dashboard">
        <!-- Left Column: Weekly Bar Chart & Subject Distribution -->
        <div>
          <!-- Weekly Study Hours Chart -->
          <div class="card" style="margin-bottom: var(--space-3);">
            <div class="card-header">
              <div>
                <h3 class="card-title">${Icons.trendingUp(18)} Weekly Study Hours</h3>
                <span class="card-subtitle">15.0 hours total studied this week</span>
              </div>
              <span class="badge badge-primary">Consistency: 5/7 Days</span>
            </div>

            <div class="bar-chart-container">
              ${days.map(d => {
                const heightPercent = Math.round((d.hours / maxHours) * 100);
                return `
                  <div class="bar-col">
                    <div class="bar-pill" style="height: ${heightPercent}%;" data-val="${d.hours}h"></div>
                    <span class="bar-label">${d.day}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Subject Breakdown Progress -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${Icons.book(18)} Subject Syllabus Coverage</h3>
              <span class="card-subtitle">${state.subjects.length} enrolled</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              ${state.subjects.map(sub => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <span>${sub.icon || '📚'}</span>
                      <span>${sub.name}</span>
                    </span>
                    <span>${sub.progress || 0}% &bull; ${sub.studyHours || 0}h</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${sub.progress || 0}%; background: ${sub.color || 'var(--color-primary)'};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Study Insights (Rule-based Dynamic) -->
        <div>
          <div class="card" style="margin-bottom: var(--space-3);">
            <div class="card-header">
              <div>
                <h3 class="card-title">${Icons.target(18)} Dynamic Study Insights</h3>
                <span class="card-subtitle">Generated from your active session data</span>
              </div>
            </div>

            ${insights.length === 0 ? `
              <p style="color: var(--color-text-secondary); font-size: 13px; text-align: center; padding: var(--space-4);">
                Log study sessions and complete tasks to reveal personalized academic trends.
              </p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: var(--space-1-5);">
                ${insights.map(item => `
                  <div class="insight-card">
                    <span class="insight-card-icon">${item.icon}</span>
                    <div class="insight-card-text">${item.text}</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Consistency & Health Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">🔥 Consistency Rating</h3>
              <span class="badge badge-success">Top 10%</span>
            </div>

            <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: var(--space-2);">
              You have maintained focused study momentum on <strong>5 out of 7 days</strong> this cycle.
            </p>

            <div style="display: flex; gap: 6px; margin-bottom: var(--space-2);">
              ${["M", "T", "W", "T", "F", "S", "S"].map((letter, idx) => `
                <div style="flex: 1; height: 36px; border-radius: var(--radius-md); background: ${idx < 5 ? 'var(--gradient-primary)' : 'var(--color-card-subtle)'}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: ${idx < 5 ? '#FFFFFF' : 'var(--color-text-muted)'};">
                  ${letter}
                </div>
              `).join('')}
            </div>
            <span style="font-size: 11.5px; color: var(--color-text-muted);">
              Current Streak: ${state.studyStreak || 6} days.
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}
