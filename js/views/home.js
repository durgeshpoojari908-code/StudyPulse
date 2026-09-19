/* StudyPulse Home Dashboard View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getRelativeDateLabel(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateStr);
  target.setHours(0,0,0,0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `<span class="badge badge-danger">Overdue</span>`;
  if (diffDays === 0) return `<span class="badge badge-warning">Today</span>`;
  if (diffDays === 1) return `<span class="badge badge-warning">Tomorrow</span>`;
  return `<span class="badge badge-primary">In ${diffDays} days</span>`;
}

export function renderHome(container, navigateTo, openModal) {
  const state = store.getState();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const overallProgress = store.calculateOverallProgress();
  const todayStudyMin = store.calculateTodayStudyMinutes();
  const todaySessions = store.getTodaySessions();
  const upcomingDeadlines = store.getUpcomingDeadlines(4);
  const pendingTasksToday = state.tasks.filter(t => t.status === "pending").length;

  // SVG Progress Ring
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (overallProgress / 100) * circ;

  container.innerHTML = `
    <div class="fade-in">
      <!-- Welcome Header -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-3);">
        <div>
          <p style="font-size: 13px; font-weight: 600; color: var(--color-primary); margin-bottom: 2px;">
            STUDYPULSE OVERVIEW
          </p>
          <h1 style="font-size: 24px; font-weight: 800;">
            ${greeting}, ${state.userName || 'Student'} 👋
          </h1>
          <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 2px;">
            Goal: <strong style="color: var(--color-text);">${state.academicGoal}</strong> &bull; Target: <strong style="color: var(--color-text);">${state.dailyGoalHours}h / day</strong>
          </p>
        </div>
      </div>

      <!-- Hero Overall Progress Card -->
      <div class="hero-card">
        <div class="hero-card-content">
          <div class="hero-info">
            <div class="hero-badge">
              <span>⚡ ACADEMIC STATUS</span>
            </div>
            <h2 class="hero-title">${overallProgress}% Completed</h2>
            <div class="hero-subtitle">
              <span>+12% vs last week</span> &bull; <span>${state.subjects.length} active subjects</span>
            </div>
            <div style="margin-top: var(--space-2); display: flex; gap: var(--space-1);">
              <button id="btn-quick-plan" class="btn-sm" style="background: rgba(255,255,255,0.25); color: #FFFFFF; backdrop-filter: blur(8px); border-radius: var(--radius-md);">
                ${Icons.planner(14)} View Plan
              </button>
              <button id="btn-quick-log" class="btn-sm" style="background: #FFFFFF; color: var(--color-primary); font-weight: 700; border-radius: var(--radius-md);">
                ${Icons.plus(14)} Log Session
              </button>
            </div>
          </div>

          <div class="hero-ring-container">
            <svg width="96" height="96" viewBox="0 0 96 96" style="transform: rotate(-90deg);">
              <circle cx="48" cy="48" r="${radius}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="8" />
              <circle cx="48" cy="48" r="${radius}" fill="none" stroke="#FFFFFF" stroke-width="8"
                stroke-dasharray="${strokeDash} ${circ}" stroke-linecap="round" style="transition: stroke-dasharray 0.8s ease;" />
            </svg>
            <div class="hero-ring-text">${overallProgress}%</div>
          </div>
        </div>
      </div>

      <!-- Quick Stats 4-Column Grid -->
      <div class="grid-4-col" style="margin-bottom: var(--space-3);">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-danger-light); color: var(--color-danger);">
            ${Icons.smartphone(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Screen Time</span>
            <span class="stat-value">${formatMinutes(state.screenTimeToday || 272)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
            ${Icons.clock(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Study Time</span>
            <span class="stat-value">${formatMinutes(todayStudyMin || 150)}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
            ${Icons.checkSquare(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Tasks Today</span>
            <span class="stat-value">${pendingTasksToday}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
            ${Icons.flame(22)}
          </div>
          <div class="stat-details">
            <span class="stat-label">Study Streak</span>
            <span class="stat-value">${state.studyStreak || 6} days</span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content (2 Columns on Desktop) -->
      <div class="grid-dashboard">
        <!-- Left Column -->
        <div>
          <!-- Today's Focus Section -->
          <div class="card" style="margin-bottom: var(--space-3);">
            <div class="card-header">
              <div>
                <h3 class="card-title">${Icons.target(18)} Today's Focus</h3>
                <span class="card-subtitle">Personalized from your subjects and schedule</span>
              </div>
              <button id="btn-view-plan-top" class="btn-ghost btn-sm" style="color: var(--color-primary);">
                View Plan ${Icons.chevronRight(14)}
              </button>
            </div>

            <div id="focus-sessions-list">
              ${todaySessions.length === 0 ? `
                <div style="text-align: center; padding: var(--space-3); color: var(--color-text-secondary);">
                  <p>No study sessions scheduled for today yet.</p>
                  <button id="btn-add-first-session" class="btn-primary btn-sm" style="margin-top: var(--space-1-5);">
                    ${Icons.plus(14)} Schedule Study Session
                  </button>
                </div>
              ` : todaySessions.map(session => `
                <div class="session-card ${session.completed ? 'completed' : ''}">
                  <div class="session-left">
                    <div class="custom-checkbox ${session.completed ? 'checked' : ''}" data-toggle-session="${session.id}">
                      ${Icons.check(14)}
                    </div>
                    <div class="session-info">
                      <span class="session-subject-tag">${session.subject}</span>
                      <span class="session-topic">${session.topic}</span>
                      <span class="session-time">${session.startTime} &bull; ${session.duration} mins &bull; <span class="badge ${session.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${session.priority}</span></span>
                    </div>
                  </div>
                  <div>
                    ${session.completed ? '<span class="badge badge-success">Done</span>' : '<span class="badge badge-secondary">Pending</span>'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Subject Progress (Selected Subjects Only) -->
          <div class="card" style="margin-bottom: var(--space-3);">
            <div class="card-header">
              <div>
                <h3 class="card-title">${Icons.book(18)} Subject Progress</h3>
                <span class="card-subtitle">Only showing your enrolled subjects</span>
              </div>
              <button id="btn-all-subjects" class="btn-ghost btn-sm" style="color: var(--color-primary);">
                Manage (${state.subjects.length}) ${Icons.chevronRight(14)}
              </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-1-5);">
              ${state.subjects.map(sub => `
                <div class="subject-card" data-sub-id="${sub.id}" style="padding: 12px 16px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 20px;">${sub.icon || '📚'}</span>
                      <span style="font-weight: 700; font-size: 14px; color: var(--color-text);">${sub.name}</span>
                    </div>
                    <span style="font-weight: 800; font-size: 14px; color: var(--color-primary);">${sub.progress || 0}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${sub.progress || 0}%;"></div>
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px; font-size: 11.5px; color: var(--color-text-secondary);">
                    <span>${sub.studyHours || 0}h studied</span>
                    <span>${sub.pendingTasks || 0} tasks pending</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Upcoming Deadlines -->
          <div class="card" style="margin-bottom: var(--space-3);">
            <div class="card-header">
              <div>
                <h3 class="card-title">${Icons.clock(18)} Upcoming Deadlines</h3>
                <span class="card-subtitle">Nearest assignments & exams</span>
              </div>
              <button id="btn-view-all-tasks" class="btn-ghost btn-sm" style="color: var(--color-primary);">
                All Tasks ${Icons.chevronRight(14)}
              </button>
            </div>

            <div id="home-deadlines-list">
              ${upcomingDeadlines.length === 0 ? `
                <p style="text-align: center; padding: var(--space-2); color: var(--color-text-secondary); font-size: 13px;">
                  🎉 No pending deadlines! Great job.
                </p>
              ` : upcomingDeadlines.map(task => `
                <div class="task-card" data-task-id="${task.id}" style="margin-bottom: 8px;">
                  <div class="custom-checkbox" data-toggle-task="${task.id}">
                    ${Icons.check(14)}
                  </div>
                  <div class="task-content">
                    <div class="task-top">
                      <span class="task-subject">${task.subject}</span>
                      ${getRelativeDateLabel(task.deadline)}
                    </div>
                    <div class="task-title" style="font-size: 13.5px;">${task.title}</div>
                    <div class="task-footer">
                      <span>Due: ${task.deadline}</span> &bull; <span>${task.priority} Priority</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Activity Feed -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${Icons.trendingUp(18)} Recent Activity</h3>
              <span class="badge badge-secondary">Real-time</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-1-5);">
              ${state.activity.slice(0, 5).map(act => `
                <div style="display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="font-size: 16px;">${act.icon || '📌'}</span>
                  <div style="flex: 1; font-size: 13px;">
                    <div style="color: var(--color-text); font-weight: 500;">${act.text}</div>
                    <span style="font-size: 11px; color: var(--color-text-muted);">${act.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#btn-quick-plan')?.addEventListener('click', () => navigateTo('planner'));
  container.querySelector('#btn-view-plan-top')?.addEventListener('click', () => navigateTo('planner'));
  container.querySelector('#btn-all-subjects')?.addEventListener('click', () => navigateTo('subjects'));
  container.querySelector('#btn-view-all-tasks')?.addEventListener('click', () => navigateTo('tasks'));

  container.querySelector('#btn-quick-log')?.addEventListener('click', () => {
    openModal('add-session');
  });

  container.querySelector('#btn-add-first-session')?.addEventListener('click', () => {
    openModal('add-session');
  });

  // Toggle sessions
  container.querySelectorAll('[data-toggle-session]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.getAttribute('data-toggle-session');
      store.toggleSession(id);
      renderHome(container, navigateTo, openModal);
    });
  });

  // Toggle tasks
  container.querySelectorAll('[data-toggle-task]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.getAttribute('data-toggle-task');
      store.toggleTask(id);
      renderHome(container, navigateTo, openModal);
    });
  });

  // Click subject card -> Subject detail
  container.querySelectorAll('[data-sub-id]').forEach(el => {
    el.addEventListener('click', () => {
      const subId = el.getAttribute('data-sub-id');
      navigateTo('subjects', { subjectId: subId });
    });
  });

  // Click task card -> Task detail
  container.querySelectorAll('[data-task-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.custom-checkbox')) return;
      const taskId = el.getAttribute('data-task-id');
      openModal('task-detail', { taskId });
    });
  });
}
