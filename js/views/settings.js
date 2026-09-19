/* StudyPulse Settings View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

export function renderSettings(container, navigateTo, openModal) {
  const state = store.getState();

  container.innerHTML = `
    <div class="fade-in" style="max-width: 760px; margin: 0 auto;">
      <!-- Header -->
      <div style="margin-bottom: var(--space-3);">
        <h1 style="font-size: 24px; font-weight: 800;">Settings & Preferences</h1>
        <p>Customize your StudyPulse experience, reminders, and study parameters.</p>
      </div>

      <!-- Appearance -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">Appearance</h3>
      <div class="settings-group">
        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Dark Mode</span>
            <span class="settings-row-desc">Reduce eye strain during night study sessions</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="settings-dark-toggle" ${state.darkMode ? 'checked' : ''} />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Study Preferences -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">Study Preferences</h3>
      <div class="settings-group">
        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Daily Study Goal Target</span>
            <span class="settings-row-desc">Sets your target completion bar across planner & dashboards</span>
          </div>
          <select id="settings-daily-hours" style="width: 140px; padding: 6px 12px; font-size: 13px;">
            <option value="0.5" ${state.dailyGoalHours === 0.5 ? 'selected' : ''}>30 mins</option>
            <option value="1" ${state.dailyGoalHours === 1 ? 'selected' : ''}>1 hour</option>
            <option value="2" ${state.dailyGoalHours === 2 ? 'selected' : ''}>2 hours</option>
            <option value="3" ${state.dailyGoalHours === 3 ? 'selected' : ''}>3 hours</option>
            <option value="4" ${state.dailyGoalHours === 4 ? 'selected' : ''}>4 hours</option>
            <option value="5" ${state.dailyGoalHours === 5 ? 'selected' : ''}>5+ hours</option>
          </select>
        </div>

        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Academic Goal</span>
            <span class="settings-row-desc">Currently: <strong>${state.academicGoal}</strong></span>
          </div>
          <button id="btn-change-goal" class="btn-secondary btn-sm">Change</button>
        </div>
      </div>

      <!-- Notifications & Reminders -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">Reminders & Alerts</h3>
      <div class="settings-group">
        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Deadline Push Notifications</span>
            <span class="settings-row-desc">Alert 24 hours prior to assignment submissions</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-notifications" checked />
            <span class="slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Session Prep Reminders</span>
            <span class="settings-row-desc">Notify 10 minutes before scheduled study sessions</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-session-reminders" checked />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Data Management -->
      <h3 style="font-size: 14px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">Data & Storage</h3>
      <div class="settings-group">
        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title">Storage Type</span>
            <span class="settings-row-desc">Local client storage (localStorage) &bull; 100% Private & offline</span>
          </div>
          <span class="badge badge-success">Active</span>
        </div>

        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title" style="color: var(--color-warning);">Reload Sample Data</span>
            <span class="settings-row-desc">Restore original sample subjects, sessions, and tasks</span>
          </div>
          <button id="btn-settings-reset-demo" class="btn-secondary btn-sm" style="color: var(--color-warning);">Reset</button>
        </div>

        <div class="settings-row">
          <div class="settings-row-info">
            <span class="settings-row-title" style="color: var(--color-danger);">Restart Onboarding / Clear State</span>
            <span class="settings-row-desc">Wipe all stored data and re-run initial setup</span>
          </div>
          <button id="btn-settings-logout" class="btn-secondary btn-sm" style="color: var(--color-danger);">Wipe & Restart</button>
        </div>
      </div>

      <!-- About App -->
      <div class="card" style="text-align: center; padding: var(--space-4); margin-top: var(--space-4); background: var(--color-card-subtle);">
        <h4 style="font-weight: 800; font-size: 16px; margin-bottom: 4px;">StudyPulse</h4>
        <p style="font-size: 13px; font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">
          “Know Your Progress. Own Your Time.”
        </p>
        <p style="font-size: 12px; color: var(--color-text-muted); max-width: 440px; margin: 0 auto;">
          Designed with Apple-inspired minimalist precision. Built without AI dependencies. Dedicated to helping students maintain consistent academic progress.
        </p>
      </div>
    </div>
  `;

  // Listeners
  container.querySelector('#settings-dark-toggle')?.addEventListener('change', () => {
    store.toggleTheme();
  });

  container.querySelector('#settings-daily-hours')?.addEventListener('change', (e) => {
    store.updateProfile({ dailyGoalHours: Number(e.target.value) });
  });

  container.querySelector('#btn-change-goal')?.addEventListener('click', () => {
    openModal('edit-preferences');
  });

  container.querySelector('#btn-settings-reset-demo')?.addEventListener('click', () => {
    if (confirm("Reset application state to initial demo data?")) {
      store.resetDemoData();
      renderSettings(container, navigateTo, openModal);
    }
  });

  container.querySelector('#btn-settings-logout')?.addEventListener('click', () => {
    if (confirm("Are you sure you want to wipe local data and restart onboarding?")) {
      store.restartOnboarding();
      navigateTo('onboarding');
    }
  });
}
