/* StudyPulse Academic Goals View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

export function renderGoals(container, navigateTo, openModal) {
  const state = store.getState();

  container.innerHTML = `
    <div class="fade-in">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Academic Goals</h1>
          <p>Set targets for syllabus coverage, weekly study hours, and habits.</p>
        </div>
        <button id="btn-add-goal-view" class="btn-primary">
          ${Icons.plus(16)} Create Goal
        </button>
      </div>

      <!-- Goals Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-2-5);">
        ${state.goals.length === 0 ? `
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-6);">
            <span style="font-size: 40px; display: block; margin-bottom: 12px;">🎯</span>
            <h3>No Active Academic Goals</h3>
            <p style="margin-top: 6px; margin-bottom: 16px;">Define measurable milestones to maintain focus.</p>
            <button id="btn-empty-goal" class="btn-primary">
              ${Icons.plus(16)} Add Your First Goal
            </button>
          </div>
        ` : state.goals.map(goal => {
          const pct = Math.min(100, Math.round(((goal.current || 0) / (goal.target || 1)) * 100));
          const isComplete = pct >= 100;

          return `
            <div class="card goal-card">
              <div class="goal-card-top">
                <div>
                  <span class="badge ${isComplete ? 'badge-success' : 'badge-primary'}" style="margin-bottom: 6px;">
                    ${goal.type || 'Academic'}
                  </span>
                  <h3 style="font-size: 16px; font-weight: 700; color: var(--color-text);">${goal.title}</h3>
                </div>
                <div class="goal-card-actions">
                  <button class="btn-ghost btn-sm" data-delete-goal="${goal.id}" style="color: var(--color-text-muted);">
                    ${Icons.trash(15)}
                  </button>
                </div>
              </div>

              <div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: 6px;">
                <span style="font-size: 13px; color: var(--color-text-secondary);">
                  Progress: <strong>${goal.current}</strong> / ${goal.target} ${goal.unit}
                </span>
                <span style="font-size: 15px; font-weight: 800; color: ${isComplete ? 'var(--color-success)' : 'var(--color-primary)'};">
                  ${pct}%
                </span>
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${pct}%; background: ${isComplete ? 'var(--color-success)' : 'var(--gradient-primary)'};"></div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border-subtle); padding-top: 10px; margin-top: 6px; font-size: 12px; color: var(--color-text-muted);">
                <span>Target Deadline: <strong>${goal.deadline}</strong></span>
                <button class="btn-secondary btn-sm" data-step-goal="${goal.id}" ${isComplete ? 'disabled' : ''} style="font-weight: 700;">
                  ${isComplete ? 'Achieved 🏆' : '+1 Step 📈'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelector('#btn-add-goal-view')?.addEventListener('click', () => {
    openModal('add-goal');
  });

  container.querySelector('#btn-empty-goal')?.addEventListener('click', () => {
    openModal('add-goal');
  });

  // Increment goal
  container.querySelectorAll('[data-step-goal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-step-goal');
      store.incrementGoal(id);
      renderGoals(container, navigateTo, openModal);
    });
  });

  // Delete goal
  container.querySelectorAll('[data-delete-goal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-goal');
      if (confirm("Are you sure you want to delete this goal?")) {
        store.deleteGoal(id);
        renderGoals(container, navigateTo, openModal);
      }
    });
  });
}
