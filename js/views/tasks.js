/* StudyPulse Tasks & Assignments Management View */
import { store } from '../store.js';
import { Icons } from '../icons.js';

let activeTab = "All"; // "All" | "Upcoming" | "Completed"
let filterSubject = "All";
let filterPriority = "All";
let searchTaskQuery = "";

function getRelativeDateLabel(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateStr);
  target.setHours(0,0,0,0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `<span class="badge badge-danger">Overdue (${Math.abs(diffDays)}d ago)</span>`;
  if (diffDays === 0) return `<span class="badge badge-warning">Due Today</span>`;
  if (diffDays === 1) return `<span class="badge badge-warning">Due Tomorrow</span>`;
  return `<span class="badge badge-primary">Due in ${diffDays} days</span>`;
}

export function renderTasks(container, navigateTo, openModal) {
  const state = store.getState();

  // Filter tasks
  let tasks = state.tasks;

  if (activeTab === "Upcoming") {
    tasks = tasks.filter(t => t.status === "pending");
  } else if (activeTab === "Completed") {
    tasks = tasks.filter(t => t.status === "completed");
  }

  if (filterSubject !== "All") {
    tasks = tasks.filter(t => t.subject === filterSubject);
  }

  if (filterPriority !== "All") {
    tasks = tasks.filter(t => t.priority === filterPriority);
  }

  if (searchTaskQuery.trim()) {
    const q = searchTaskQuery.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.subject.toLowerCase().includes(q)
    );
  }

  // Sort: pending first, then nearest deadline
  tasks.sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const allCount = state.tasks.length;
  const upcomingCount = state.tasks.filter(t => t.status === "pending").length;
  const completedCount = state.tasks.filter(t => t.status === "completed").length;

  container.innerHTML = `
    <div class="fade-in">
      <!-- Top Action Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Assignments & Tasks</h1>
          <p>Keep track of homework, projects, problem sets, and submission deadlines.</p>
        </div>
        <button id="btn-add-task-view" class="btn-primary">
          ${Icons.plus(16)} Add Assignment
        </button>
      </div>

      <!-- Segmented Navigation Tabs -->
      <div class="tabs-nav">
        <button class="tab-btn ${activeTab === 'All' ? 'active' : ''}" data-tab="All">
          All Tasks (${allCount})
        </button>
        <button class="tab-btn ${activeTab === 'Upcoming' ? 'active' : ''}" data-tab="Upcoming">
          Upcoming (${upcomingCount})
        </button>
        <button class="tab-btn ${activeTab === 'Completed' ? 'active' : ''}" data-tab="Completed">
          Completed (${completedCount})
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="card" style="margin-bottom: var(--space-3); padding: var(--space-2);">
        <div style="display: flex; gap: var(--space-1); flex-wrap: wrap;">
          <div class="search-box" style="flex: 2; min-width: 200px;">
            ${Icons.search(16)}
            <input id="input-task-search" type="text" placeholder="Search title, description..." value="${searchTaskQuery}" />
          </div>

          <select id="select-filter-subject" style="flex: 1; min-width: 150px;">
            <option value="All">All Subjects</option>
            ${state.subjects.map(s => `
              <option value="${s.name}" ${filterSubject === s.name ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>

          <select id="select-filter-priority" style="flex: 1; min-width: 120px;">
            <option value="All">All Priorities</option>
            <option value="High" ${filterPriority === 'High' ? 'selected' : ''}>High Priority</option>
            <option value="Medium" ${filterPriority === 'Medium' ? 'selected' : ''}>Medium Priority</option>
            <option value="Low" ${filterPriority === 'Low' ? 'selected' : ''}>Low Priority</option>
          </select>
        </div>
      </div>

      <!-- Task Cards List -->
      <div id="tasks-list-container">
        ${tasks.length === 0 ? `
          <div class="card" style="text-align: center; padding: var(--space-6);">
            <span style="font-size: 40px; margin-bottom: 12px; display: block;">📋</span>
            <h3>No Tasks Found</h3>
            <p style="margin-top: 6px; margin-bottom: 16px;">There are no tasks matching your selected filters.</p>
            <button id="btn-empty-add-task" class="btn-primary">
              ${Icons.plus(16)} Add New Assignment
            </button>
          </div>
        ` : tasks.map(task => `
          <div class="task-card ${task.status === 'completed' ? 'completed' : ''}" data-task-card="${task.id}">
            <div class="custom-checkbox ${task.status === 'completed' ? 'checked' : ''}" data-toggle-task-item="${task.id}">
              ${Icons.check(14)}
            </div>

            <div class="task-content">
              <div class="task-top">
                <span class="task-subject">${task.subject}</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="badge ${task.priority === 'High' ? 'badge-danger' : task.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}">
                    ${task.priority}
                  </span>
                  ${getRelativeDateLabel(task.deadline)}
                </div>
              </div>

              <div class="task-title">${task.title}</div>
              ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}

              <div class="task-footer">
                <span>Due Date: <strong>${task.deadline}</strong></span>
                ${task.reminder ? `&bull; <span style="display: inline-flex; align-items: center; gap: 2px;">${Icons.bell(12)} Reminder On</span>` : ''}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 4px;">
              <button class="btn-ghost btn-sm" data-edit-task="${task.id}" style="color: var(--color-text-muted);">
                ${Icons.edit(15)}
              </button>
              <button class="btn-ghost btn-sm" data-delete-task="${task.id}" style="color: var(--color-text-muted);">
                ${Icons.trash(15)}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Listeners
  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      renderTasks(container, navigateTo, openModal);
    });
  });

  const searchInp = container.querySelector('#input-task-search');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => {
      searchTaskQuery = e.target.value;
      renderTasks(container, navigateTo, openModal);
      const reInp = container.querySelector('#input-task-search');
      if (reInp) {
        reInp.focus();
        reInp.setSelectionRange(reInp.value.length, reInp.value.length);
      }
    });
  }

  container.querySelector('#select-filter-subject')?.addEventListener('change', (e) => {
    filterSubject = e.target.value;
    renderTasks(container, navigateTo, openModal);
  });

  container.querySelector('#select-filter-priority')?.addEventListener('change', (e) => {
    filterPriority = e.target.value;
    renderTasks(container, navigateTo, openModal);
  });

  container.querySelector('#btn-add-task-view')?.addEventListener('click', () => {
    openModal('add-task');
  });

  container.querySelector('#btn-empty-add-task')?.addEventListener('click', () => {
    openModal('add-task');
  });

  // Toggle checkbox
  container.querySelectorAll('[data-toggle-task-item]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.getAttribute('data-toggle-task-item');
      store.toggleTask(id);
      renderTasks(container, navigateTo, openModal);
    });
  });

  // Edit task
  container.querySelectorAll('[data-edit-task]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-edit-task');
      openModal('edit-task', { taskId: id });
    });
  });

  // Delete task
  container.querySelectorAll('[data-delete-task]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-task');
      if (confirm("Are you sure you want to delete this assignment?")) {
        store.deleteTask(id);
        renderTasks(container, navigateTo, openModal);
      }
    });
  });

  // Click card to open task detail modal
  container.querySelectorAll('[data-task-card]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.custom-checkbox') || e.target.closest('button')) return;
      const id = card.getAttribute('data-task-card');
      openModal('task-detail', { taskId: id });
    });
  });
}
