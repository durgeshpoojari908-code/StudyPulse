/* StudyPulse Student Profile View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

export function renderProfile(container, navigateTo, openModal) {
  const state = store.getState();
  const overallProgress = store.calculateOverallProgress();
  const totalStudyHours = Math.round(state.subjects.reduce((sum, s) => sum + (s.studyHours || 0), 0) * 10) / 10;

  container.innerHTML = `
    <div class="fade-in" style="max-width: 760px; margin: 0 auto;">
      <!-- Profile Hero Card -->
      <div class="card" style="margin-bottom: var(--space-3); padding: var(--space-4); text-align: center; position: relative;">
        <div style="position: absolute; top: var(--space-3); right: var(--space-3);">
          <button id="btn-edit-profile-top" class="btn-secondary btn-sm">
            ${Icons.edit(14)} Edit
          </button>
        </div>

        <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: var(--gradient-primary); color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin-bottom: var(--space-2); box-shadow: var(--shadow-glow);">
          ${(state.userName || 'S').charAt(0).toUpperCase()}
        </div>

        <h1 style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">${state.userName || 'Student'}</h1>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); margin-bottom: var(--space-3);">
          ${state.courseInfo || 'Academic Scholar'} &bull; Primary Goal: <strong style="color: var(--color-primary);">${state.academicGoal}</strong>
        </p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-3);">
          <div>
            <span class="stat-label">Overall Progress</span>
            <div style="font-size: 20px; font-weight: 800; color: var(--color-primary);">${overallProgress}%</div>
          </div>
          <div>
            <span class="stat-label">Study Streak</span>
            <div style="font-size: 20px; font-weight: 800; color: var(--color-danger);">${state.studyStreak || 6} Days</div>
          </div>
          <div>
            <span class="stat-label">Total Studied</span>
            <div style="font-size: 20px; font-weight: 800; color: var(--color-success);">${totalStudyHours}h</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Groups -->
      <div class="settings-group">
        <div class="settings-row" id="row-study-prefs" style="cursor: pointer;">
          <div class="settings-row-info">
            <span class="settings-row-title">Study Preferences</span>
            <span class="settings-row-desc">Daily target: ${state.dailyGoalHours} hours/day</span>
          </div>
          <div style="color: var(--color-text-muted);">${Icons.chevronRight(16)}</div>
        </div>

        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Dark Mode Appearance</span>
            <span class="settings-row-desc">High-contrast Apple-inspired dark palette</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="profile-dark-toggle" ${state.darkMode ? 'checked' : ''} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="settings-row" id="row-go-settings" style="cursor: pointer;">
          <div class="settings-row-info">
            <span class="settings-row-title">Application Settings</span>
            <span class="settings-row-desc">Reminders, data export, notifications</span>
          </div>
          <div style="color: var(--color-text-muted);">${Icons.chevronRight(16)}</div>
        </div>
      </div>

      <!-- Account / Demo Controls -->
      <div class="settings-group">
        <div class="settings-row" id="row-reset-demo" style="cursor: pointer;">
          <div class="settings-row-info">
            <span class="settings-row-title" style="color: var(--color-warning);">Reload Sample Data</span>
            <span class="settings-row-desc">Restore curated demo subjects, tasks, and sessions</span>
          </div>
          <button class="btn-ghost btn-sm" style="color: var(--color-warning); font-weight: 700;">Reset</button>
        </div>

        <div class="settings-row" id="row-restart-onboarding" style="cursor: pointer;">
          <div class="settings-row-info">
            <span class="settings-row-title" style="color: var(--color-danger);">Restart Onboarding / Logout</span>
            <span class="settings-row-desc">Clear personal data and rerun setup</span>
          </div>
          <button class="btn-ghost btn-sm" style="color: var(--color-danger); font-weight: 700;">Log Out</button>
        </div>
      </div>
    </div>
  `;

  // Listeners
  container.querySelector('#btn-edit-profile-top')?.addEventListener('click', () => {
    openModal('edit-profile');
  });

  container.querySelector('#row-study-prefs')?.addEventListener('click', () => {
    openModal('edit-preferences');
  });

  container.querySelector('#row-go-settings')?.addEventListener('click', () => {
    navigateTo('settings');
  });

  container.querySelector('#profile-dark-toggle')?.addEventListener('change', () => {
    store.toggleTheme();
  });

  container.querySelector('#row-reset-demo')?.addEventListener('click', () => {
    if (confirm("Reset application to sample demo data?")) {
      store.resetDemoData();
      renderProfile(container, navigateTo, openModal);
    }
  });

  container.querySelector('#row-restart-onboarding')?.addEventListener('click', () => {
    if (confirm("Log out and return to the onboarding screen?")) {
      store.restartOnboarding();
      navigateTo('onboarding');
    }
  });
}
