/* StudyPulse Subjects Module & Detail View */
import { store, COURSE_CATALOGUE } from '../store.js';
import { Icons } from '../icons.js';

let searchQuery = "";

export function renderSubjects(container, navigateTo, openModal, params = {}) {
  const state = store.getState();

  // If a specific subject is selected, render the detailed view
  if (params && params.subjectId) {
    renderSubjectDetail(container, navigateTo, openModal, params.subjectId);
    return;
  }

  const filteredSubjects = state.subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  container.innerHTML = `
    <div class="fade-in">
      <!-- Top Actions Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Academic Subjects</h1>
          <p>Manage and track progress across all your enrolled courses.</p>
        </div>
        <div style="display: flex; gap: var(--space-1);">
          <button id="btn-add-custom-sub-view" class="btn-secondary">
            ${Icons.plus(16)} Custom Subject
          </button>
          <button id="btn-enroll-catalogue" class="btn-primary">
            ${Icons.book(16)} Add from Catalogue
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div style="margin-bottom: var(--space-3);">
        <div class="search-box" style="width: 100%; max-width: 480px;">
          ${Icons.search(16)}
          <input id="sub-search-input" type="text" placeholder="Search your enrolled subjects..." value="${searchQuery}" />
        </div>
      </div>

      <!-- Subjects Grid -->
      ${filteredSubjects.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-6);">
          <span style="font-size: 40px; margin-bottom: 12px; display: block;">📚</span>
          <h3>No Subjects Found</h3>
          <p style="margin-top: 6px; margin-bottom: 16px;">No subjects matched "${searchQuery}". Add a new course to get started.</p>
          <button id="btn-empty-add-sub" class="btn-primary">
            ${Icons.plus(16)} Add Subject
          </button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-2-5);">
          ${filteredSubjects.map(sub => `
            <div class="card subject-card" data-open-detail="${sub.id}">
              <div class="subject-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="subject-icon-wrap" style="background: ${sub.color || '#4F46E5'}15; color: ${sub.color || '#4F46E5'};">
                    ${sub.icon || '📚'}
                  </div>
                  <div>
                    <h3 style="font-size: 16px; font-weight: 700; color: var(--color-text);">${sub.name}</h3>
                    <span style="font-size: 11px; color: var(--color-text-muted);">${sub.totalTopics || 10} Total Topics</span>
                  </div>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: var(--color-primary);">${sub.progress || 0}%</span>
              </div>

              <div class="progress-bar-container" style="margin: 8px 0;">
                <div class="progress-bar-fill" style="width: ${sub.progress || 0}%; background: ${sub.color || 'var(--gradient-primary)'};"></div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                <span>⏱️ <strong>${sub.studyHours || 0}h</strong> studied</span>
                <span>📝 <strong>${sub.pendingTasks || 0}</strong> pending tasks</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border-subtle); padding-top: 10px; margin-top: 6px;">
                <span style="font-size: 12px; color: var(--color-primary); font-weight: 600;">View Details & Schedule →</span>
                <button class="btn-ghost btn-sm" data-delete-sub="${sub.id}" style="color: var(--color-text-muted); padding: 4px 8px;">
                  ${Icons.trash(14)}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  // Listeners
  const searchInput = container.querySelector('#sub-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderSubjects(container, navigateTo, openModal);
      const reInp = container.querySelector('#sub-search-input');
      if (reInp) {
        reInp.focus();
        reInp.setSelectionRange(reInp.value.length, reInp.value.length);
      }
    });
  }

  container.querySelector('#btn-add-custom-sub-view')?.addEventListener('click', () => {
    openModal('add-custom-subject');
  });

  container.querySelector('#btn-enroll-catalogue')?.addEventListener('click', () => {
    openModal('catalogue-picker');
  });

  container.querySelector('#btn-empty-add-sub')?.addEventListener('click', () => {
    openModal('catalogue-picker');
  });

  // Open detail
  container.querySelectorAll('[data-open-detail]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-sub]')) return;
      const subId = card.getAttribute('data-open-detail');
      renderSubjectDetail(container, navigateTo, openModal, subId);
    });
  });

  // Delete subject
  container.querySelectorAll('[data-delete-sub]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-sub');
      if (confirm("Are you sure you want to remove this subject?")) {
        store.removeSubject(id);
        renderSubjects(container, navigateTo, openModal);
      }
    });
  });
}

function renderSubjectDetail(container, navigateTo, openModal, subjectId) {
  const state = store.getState();
  const sub = state.subjects.find(s => s.id === subjectId) || state.subjects[0];
  if (!sub) {
    renderSubjects(container, navigateTo, openModal);
    return;
  }

  const subTasks = state.tasks.filter(t => t.subject === sub.name);
  const subSessions = state.sessions.filter(s => s.subject === sub.name);

  container.innerHTML = `
    <div class="fade-in">
      <!-- Breadcrumb & Back -->
      <div style="margin-bottom: var(--space-2);">
        <button id="btn-back-to-subjects" class="btn-ghost" style="padding-left: 0; color: var(--color-primary); font-weight: 700;">
          ${Icons.chevronLeft(16)} Back to All Subjects
        </button>
      </div>

      <!-- Subject Hero Header -->
      <div class="card" style="margin-bottom: var(--space-3); border-left: 6px solid ${sub.color || '#4F46E5'};">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 36px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: var(--color-card-subtle); border-radius: var(--radius-lg);">
              ${sub.icon || '📚'}
            </div>
            <div>
              <span class="badge badge-primary" style="margin-bottom: 4px;">ENROLLED SUBJECT</span>
              <h1 style="font-size: 24px; font-weight: 800;">${sub.name}</h1>
              <p style="font-size: 13px;">${sub.completedTopics || 0} of ${sub.totalTopics || 10} topics mastered</p>
            </div>
          </div>

          <div style="display: flex; gap: var(--space-1);">
            <button id="btn-continue-studying" class="btn-primary">
              ${Icons.clock(16)} Continue Studying
            </button>
            <button id="btn-add-subject-task" class="btn-secondary">
              ${Icons.plus(16)} Add Task
            </button>
          </div>
        </div>

        <div style="margin-top: var(--space-3); display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); text-align: center;">
          <div class="metric-box">
            <span class="metric-box-label">Syllabus Progress</span>
            <span class="metric-box-val" style="color: var(--color-primary);">${sub.progress || 0}%</span>
          </div>
          <div class="metric-box">
            <span class="metric-box-label">Study Hours</span>
            <span class="metric-box-val">${sub.studyHours || 0}h</span>
          </div>
          <div class="metric-box">
            <span class="metric-box-label">Pending Tasks</span>
            <span class="metric-box-val">${subTasks.filter(t => t.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <!-- Detail Grid: Tasks & Sessions -->
      <div class="grid-dashboard">
        <!-- Tasks for this subject -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.checkSquare(18)} Subject Assignments</h3>
            <span class="badge badge-secondary">${subTasks.length} total</span>
          </div>

          ${subTasks.length === 0 ? `
            <p style="color: var(--color-text-muted); font-size: 13px; text-align: center; padding: var(--space-3);">
              No assignments recorded for this subject yet.
            </p>
          ` : subTasks.map(t => `
            <div class="task-card ${t.status === 'completed' ? 'completed' : ''}">
              <div class="custom-checkbox ${t.status === 'completed' ? 'checked' : ''}" data-toggle-sub-task="${t.id}">
                ${Icons.check(14)}
              </div>
              <div class="task-content">
                <div class="task-title" style="font-size: 14px;">${t.title}</div>
                <div class="task-desc">${t.description}</div>
                <div class="task-footer">
                  <span>Due: ${t.deadline}</span> &bull; <span>${t.priority} Priority</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Recent Study Sessions for this subject -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${Icons.planner(18)} Study History</h3>
            <span class="badge badge-primary">${subSessions.length} sessions</span>
          </div>

          ${subSessions.length === 0 ? `
            <p style="color: var(--color-text-muted); font-size: 13px; text-align: center; padding: var(--space-3);">
              No study sessions logged for this subject yet.
            </p>
          ` : subSessions.map(s => `
            <div class="session-card ${s.completed ? 'completed' : ''}">
              <div class="session-left">
                <div class="session-info">
                  <span class="session-topic">${s.topic}</span>
                  <span class="session-time">${s.date} &bull; ${s.duration} mins</span>
                </div>
              </div>
              <div>
                ${s.completed ? '<span class="badge badge-success">Completed</span>' : '<span class="badge badge-secondary">Planned</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-back-to-subjects')?.addEventListener('click', () => {
    renderSubjects(container, navigateTo, openModal);
  });

  container.querySelector('#btn-continue-studying')?.addEventListener('click', () => {
    openModal('add-session', { defaultSubject: sub.name });
  });

  container.querySelector('#btn-add-subject-task')?.addEventListener('click', () => {
    openModal('add-task', { defaultSubject: sub.name });
  });

  container.querySelectorAll('[data-toggle-sub-task]').forEach(el => {
    el.addEventListener('click', () => {
      const tid = el.getAttribute('data-toggle-sub-task');
      store.toggleTask(tid);
      renderSubjectDetail(container, navigateTo, openModal, subjectId);
    });
  });
}
