/* StudyPulse Master Application Controller */
import { store, getTodayDateStr, COURSE_CATALOGUE } from './store.js';
import { Icons } from './icons.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderHome } from './views/home.js';
import { renderSubjects } from './views/subjects.js';
import { renderPlanner } from './views/planner.js';
import { renderTasks } from './views/tasks.js';
import { renderCalendar } from './views/calendar.js';
import { renderScreenTime } from './views/screentime.js';
import { renderProgress } from './views/progress.js';
import { renderGoals } from './views/goals.js';
import { renderProfile } from './views/profile.js';
import { renderSettings } from './views/settings.js';

let currentView = 'home';
let currentParams = {};

// Toast System
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💡'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

// Global Router
export function navigateTo(view, params = {}) {
  currentView = view;
  currentParams = params;

  const mainViewport = document.getElementById('main-viewport');
  const desktopSidebar = document.querySelector('.desktop-sidebar');
  const desktopHeader = document.querySelector('.desktop-header');
  const mobileHeader = document.querySelector('.mobile-header');
  const mobileBottomNav = document.querySelector('.mobile-bottom-nav');

  const isOnboarding = view === 'onboarding';

  // Toggle navigation visibility during onboarding
  if (desktopSidebar) desktopSidebar.style.display = isOnboarding ? 'none' : '';
  if (desktopHeader) desktopHeader.style.display = isOnboarding ? 'none' : '';
  if (mobileHeader) mobileHeader.style.display = isOnboarding ? 'none' : '';
  if (mobileBottomNav) mobileBottomNav.style.display = isOnboarding ? 'none' : '';

  if (isOnboarding) {
    mainViewport.style.paddingTop = 'var(--space-2)';
    mainViewport.style.paddingBottom = 'var(--space-2)';
    mainViewport.style.marginLeft = '0';
  } else {
    mainViewport.style.paddingTop = '';
    mainViewport.style.paddingBottom = '';
    mainViewport.style.marginLeft = '';
  }

  // Update Navigation Active States
  document.querySelectorAll('.desktop-nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === view);
  });
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === view);
  });

  // Render Target View
  mainViewport.scrollTop = 0;
  switch (view) {
    case 'onboarding':
      renderOnboarding(mainViewport, navigateTo);
      break;
    case 'home':
      renderHome(mainViewport, navigateTo, openModal);
      break;
    case 'subjects':
      renderSubjects(mainViewport, navigateTo, openModal, params);
      break;
    case 'planner':
      renderPlanner(mainViewport, navigateTo, openModal);
      break;
    case 'tasks':
      renderTasks(mainViewport, navigateTo, openModal);
      break;
    case 'calendar':
      renderCalendar(mainViewport, navigateTo, openModal);
      break;
    case 'screentime':
      renderScreenTime(mainViewport, navigateTo, openModal);
      break;
    case 'progress':
      renderProgress(mainViewport, navigateTo, openModal);
      break;
    case 'goals':
      renderGoals(mainViewport, navigateTo, openModal);
      break;
    case 'profile':
      renderProfile(mainViewport, navigateTo, openModal);
      break;
    case 'settings':
      renderSettings(mainViewport, navigateTo, openModal);
      break;
    default:
      renderHome(mainViewport, navigateTo, openModal);
  }

  updateHeaderAndProfile();
}

function updateHeaderAndProfile() {
  const state = store.getState();
  
  // Desktop header user name & avatar
  const desktopUserName = document.getElementById('desktop-user-name');
  const desktopUserGoal = document.getElementById('desktop-user-goal');
  const desktopAvatar = document.getElementById('desktop-user-avatar');
  const mobileAvatar = document.getElementById('mobile-user-avatar');

  const initial = (state.userName || 'S').charAt(0).toUpperCase();

  if (desktopUserName) desktopUserName.textContent = state.userName || 'Student';
  if (desktopUserGoal) desktopUserGoal.textContent = state.academicGoal || 'Academic Target';
  if (desktopAvatar) desktopAvatar.textContent = initial;
  if (mobileAvatar) mobileAvatar.textContent = initial;

  // Unread notifications badge
  const unreadCount = state.notifications.filter(n => !n.read).length;
  document.querySelectorAll('.notif-badge').forEach(badge => {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
  });
}

// Global Modals Manager
export function openModal(type, params = {}) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const state = store.getState();

  function closeModal() {
    modalContainer.innerHTML = '';
  }

  let modalContentHtml = '';

  switch (type) {
    case 'add-session':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">${Icons.planner(18)} Plan Study Session</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-add-session">
              <div class="form-group">
                <label>Subject</label>
                <select id="session-subject" required>
                  ${state.subjects.map(s => `
                    <option value="${s.name}" ${params.defaultSubject === s.name ? 'selected' : ''}>${s.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Topic / Concept</label>
                <input id="session-topic" placeholder="e.g. Dynamic Programming Memoization" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" id="session-date" value="${params.defaultDate || getTodayDateStr(0)}" required />
                </div>
                <div class="form-group">
                  <label>Start Time</label>
                  <input type="time" id="session-time" value="10:00" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Duration (Minutes)</label>
                  <input type="number" id="session-duration" value="60" min="15" step="15" required />
                </div>
                <div class="form-group">
                  <label>Priority</label>
                  <select id="session-priority">
                    <option value="High">High</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin: var(--space-2) 0;">
                <div>
                  <span style="font-size: 13.5px; font-weight: 600;">Reminder Notification</span>
                  <p style="font-size: 12px; color: var(--color-text-muted);">Notify 10 minutes beforehand</p>
                </div>
                <label class="switch">
                  <input type="checkbox" id="session-reminder" checked />
                  <span class="slider"></span>
                </label>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'add-task':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">${Icons.plus(18)} Add Assignment / Task</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-add-task">
              <div class="form-group">
                <label>Subject</label>
                <select id="task-subject" required>
                  ${state.subjects.map(s => `
                    <option value="${s.name}" ${params.defaultSubject === s.name ? 'selected' : ''}>${s.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Assignment Title</label>
                <input id="task-title" placeholder="e.g. Unit 3 Problem Set & Code Submission" required />
              </div>

              <div class="form-group">
                <label>Description / Instructions</label>
                <textarea id="task-desc" rows="3" placeholder="Notes, submission link, rubric points..."></textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Submission Deadline</label>
                  <input type="date" id="task-deadline" value="${params.defaultDate || getTodayDateStr(2)}" required />
                </div>
                <div class="form-group">
                  <label>Priority</label>
                  <select id="task-priority">
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin: var(--space-2) 0;">
                <div>
                  <span style="font-size: 13.5px; font-weight: 600;">Deadline Push Alert</span>
                  <p style="font-size: 12px; color: var(--color-text-muted);">Notify before due date</p>
                </div>
                <label class="switch">
                  <input type="checkbox" id="task-reminder" checked />
                  <span class="slider"></span>
                </label>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'edit-task':
      const taskToEdit = state.tasks.find(t => t.id === params.taskId);
      if (!taskToEdit) return;

      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">${Icons.edit(18)} Edit Assignment</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-edit-task">
              <div class="form-group">
                <label>Subject</label>
                <select id="edit-task-subject" required>
                  ${state.subjects.map(s => `
                    <option value="${s.name}" ${taskToEdit.subject === s.name ? 'selected' : ''}>${s.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label>Assignment Title</label>
                <input id="edit-task-title" value="${taskToEdit.title}" required />
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea id="edit-task-desc" rows="3">${taskToEdit.description || ''}</textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Deadline</label>
                  <input type="date" id="edit-task-deadline" value="${taskToEdit.deadline}" required />
                </div>
                <div class="form-group">
                  <label>Priority</label>
                  <select id="edit-task-priority">
                    <option value="High" ${taskToEdit.priority === 'High' ? 'selected' : ''}>High</option>
                    <option value="Medium" ${taskToEdit.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Low" ${taskToEdit.priority === 'Low' ? 'selected' : ''}>Low</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Update Task</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'task-detail':
      const taskItem = state.tasks.find(t => t.id === params.taskId);
      if (!taskItem) return;

      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <span class="badge badge-primary">${taskItem.subject}</span>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">${taskItem.title}</h2>
            <p style="font-size: 14px; line-height: 1.5; color: var(--color-text-secondary); margin-bottom: var(--space-3);">
              ${taskItem.description || 'No detailed instructions provided.'}
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-3); background: var(--color-card-subtle); padding: var(--space-2); border-radius: var(--radius-lg);">
              <div>
                <span class="stat-label">Deadline</span>
                <div style="font-weight: 700; font-size: 14px;">${taskItem.deadline}</div>
              </div>
              <div>
                <span class="stat-label">Priority</span>
                <div style="font-weight: 700; font-size: 14px;">${taskItem.priority}</div>
              </div>
              <div>
                <span class="stat-label">Status</span>
                <div style="font-weight: 700; font-size: 14px; color: ${taskItem.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)'};">
                  ${taskItem.status === 'completed' ? 'Completed ✅' : 'Pending ⏳'}
                </div>
              </div>
              <div>
                <span class="stat-label">Reminders</span>
                <div style="font-weight: 700; font-size: 14px;">${taskItem.reminder ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; gap: var(--space-1); margin-top: var(--space-3);">
              <button id="btn-delete-task-detail" class="btn-ghost" style="color: var(--color-danger);">
                ${Icons.trash(16)} Delete
              </button>
              <div style="display: flex; gap: var(--space-1);">
                <button id="btn-edit-task-detail" class="btn-secondary">
                  ${Icons.edit(16)} Edit
                </button>
                <button id="btn-toggle-task-detail" class="btn-primary">
                  ${taskItem.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed ✅'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'add-goal':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">${Icons.target(18)} Create Academic Goal</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-add-goal">
              <div class="form-group">
                <label>Goal Title</label>
                <input id="goal-title" placeholder="e.g. Master Linear Algebra Chapter 4" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Category</label>
                  <select id="goal-type">
                    <option value="Topics">Topics / Syllabus</option>
                    <option value="Study Hours">Study Hours</option>
                    <option value="Streak">Streak</option>
                    <option value="Habit">Habit</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Target Value</label>
                  <input type="number" id="goal-target" value="10" min="1" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Unit Label</label>
                  <input id="goal-unit" value="topics" placeholder="topics, hours, days..." required />
                </div>
                <div class="form-group">
                  <label>Target Deadline</label>
                  <input type="date" id="goal-deadline" value="${getTodayDateStr(14)}" required />
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'add-custom-subject':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">Add Custom Subject</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-custom-sub">
              <div class="form-group">
                <label>Subject Name</label>
                <input id="new-sub-name" placeholder="e.g. Quantum Computing, Macroeconomics" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-2);">
                <div class="form-group">
                  <label>Icon / Emoji</label>
                  <input id="new-sub-icon" value="📘" style="text-align: center; font-size: 18px;" required />
                </div>
                <div class="form-group">
                  <label>Accent Color</label>
                  <select id="new-sub-color">
                    <option value="#4F46E5">Indigo</option>
                    <option value="#8B5CF6">Violet</option>
                    <option value="#06B6D4">Cyan</option>
                    <option value="#10B981">Emerald</option>
                    <option value="#F59E0B">Amber</option>
                    <option value="#EF4444">Rose</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'catalogue-picker':
      const enrolledNames = new Set(state.subjects.map(s => s.name.toLowerCase()));
      const available = COURSE_CATALOGUE.filter(c => !enrolledNames.has(c.name.toLowerCase()));

      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet" style="max-width: 600px;">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">Select Subjects from Catalogue</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: var(--space-2);">
              Select any course to enroll it in your personalized StudyPulse dashboard.
            </p>

            <div style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding: 4px;">
              ${available.map(item => `
                <div class="card" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 22px;">${item.icon}</span>
                    <div>
                      <h4 style="font-size: 14px; font-weight: 700;">${item.name}</h4>
                      <span style="font-size: 11px; color: var(--color-text-muted);">${item.category}</span>
                    </div>
                  </div>
                  <button class="btn-secondary btn-sm" data-enroll-id="${item.id}">
                    ${Icons.plus(14)} Enroll
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      break;

    case 'edit-profile':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">Edit Profile</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-edit-profile">
              <div class="form-group">
                <label>Your Name</label>
                <input id="edit-name" value="${state.userName || ''}" required />
              </div>

              <div class="form-group">
                <label>Course / Degree / College</label>
                <input id="edit-course" value="${state.courseInfo || ''}" placeholder="e.g. B.Tech Computer Science, Semester 4" />
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;

    case 'edit-preferences':
      modalContentHtml = `
        <div class="modal-overlay" id="modal-backdrop">
          <div class="modal-sheet">
            <div class="modal-header">
              <h3 style="font-size: 18px; font-weight: 800;">Study Preferences</h3>
              <button class="modal-close-btn" id="modal-close">${Icons.x(16)}</button>
            </div>

            <form id="form-edit-prefs">
              <div class="form-group">
                <label>Daily Study Target (Hours)</label>
                <input type="number" id="pref-hours" value="${state.dailyGoalHours}" min="0.5" max="12" step="0.5" required />
              </div>

              <div class="form-group">
                <label>Primary Academic Goal</label>
                <input id="pref-goal" value="${state.academicGoal}" required />
              </div>

              <div style="display: flex; justify-content: flex-end; gap: var(--space-1); margin-top: var(--space-3);">
                <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn-primary">Save Preferences</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;
  }

  modalContainer.innerHTML = modalContentHtml;

  // Backdrop & close buttons
  modalContainer.querySelector('#modal-close')?.addEventListener('click', closeModal);
  modalContainer.querySelector('#btn-cancel-modal')?.addEventListener('click', closeModal);
  modalContainer.querySelector('#modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  // Handle Add Session Form
  modalContainer.querySelector('#form-add-session')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = modalContainer.querySelector('#session-subject').value;
    const topic = modalContainer.querySelector('#session-topic').value;
    const date = modalContainer.querySelector('#session-date').value;
    const startTime = modalContainer.querySelector('#session-time').value;
    const duration = Number(modalContainer.querySelector('#session-duration').value);
    const priority = modalContainer.querySelector('#session-priority').value;
    const reminder = modalContainer.querySelector('#session-reminder').checked;

    store.addSession({ subject, topic, date, startTime, duration, priority, reminder });
    showToast(`Scheduled session on ${subject}!`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Add Task Form
  modalContainer.querySelector('#form-add-task')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = modalContainer.querySelector('#task-subject').value;
    const title = modalContainer.querySelector('#task-title').value;
    const description = modalContainer.querySelector('#task-desc').value;
    const deadline = modalContainer.querySelector('#task-deadline').value;
    const priority = modalContainer.querySelector('#task-priority').value;
    const reminder = modalContainer.querySelector('#task-reminder').checked;

    store.addTask({ subject, title, description, deadline, priority, reminder });
    showToast(`Added assignment: "${title}"`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Edit Task Form
  modalContainer.querySelector('#form-edit-task')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = modalContainer.querySelector('#edit-task-subject').value;
    const title = modalContainer.querySelector('#edit-task-title').value;
    const description = modalContainer.querySelector('#edit-task-desc').value;
    const deadline = modalContainer.querySelector('#edit-task-deadline').value;
    const priority = modalContainer.querySelector('#edit-task-priority').value;

    store.updateTask(params.taskId, { subject, title, description, deadline, priority });
    showToast(`Updated task: "${title}"`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Task Detail Actions
  modalContainer.querySelector('#btn-toggle-task-detail')?.addEventListener('click', () => {
    store.toggleTask(params.taskId);
    showToast(`Task status toggled!`, 'info');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  modalContainer.querySelector('#btn-edit-task-detail')?.addEventListener('click', () => {
    closeModal();
    openModal('edit-task', { taskId: params.taskId });
  });

  modalContainer.querySelector('#btn-delete-task-detail')?.addEventListener('click', () => {
    if (confirm("Delete this assignment?")) {
      store.deleteTask(params.taskId);
      showToast(`Task deleted`, 'info');
      closeModal();
      navigateTo(currentView, currentParams);
    }
  });

  // Handle Add Goal Form
  modalContainer.querySelector('#form-add-goal')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = modalContainer.querySelector('#goal-title').value;
    const type = modalContainer.querySelector('#goal-type').value;
    const target = Number(modalContainer.querySelector('#goal-target').value);
    const unit = modalContainer.querySelector('#goal-unit').value;
    const deadline = modalContainer.querySelector('#goal-deadline').value;

    store.addGoal({ title, type, target, unit, deadline, current: 0 });
    showToast(`Goal "${title}" created!`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Custom Subject Form
  modalContainer.querySelector('#form-custom-sub')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = modalContainer.querySelector('#new-sub-name').value;
    const icon = modalContainer.querySelector('#new-sub-icon').value || '📘';
    const color = modalContainer.querySelector('#new-sub-color').value;

    store.addSubject({ name, icon, color });
    showToast(`Added subject: "${name}"`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Catalogue Picker
  modalContainer.querySelectorAll('[data-enroll-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-enroll-id');
      const item = COURSE_CATALOGUE.find(c => c.id === id);
      if (item) {
        store.addSubject({
          name: item.name,
          icon: item.icon,
          color: item.color,
          progress: 25,
          studyHours: 0,
          totalTopics: 10,
          completedTopics: 2,
          pendingTasks: 1
        });
        showToast(`Enrolled in ${item.name}!`, 'success');
        closeModal();
        navigateTo(currentView, currentParams);
      }
    });
  });

  // Handle Edit Profile Form
  modalContainer.querySelector('#form-edit-profile')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = modalContainer.querySelector('#edit-name').value;
    const courseInfo = modalContainer.querySelector('#edit-course').value;
    store.updateProfile({ userName, courseInfo });
    showToast(`Profile updated!`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });

  // Handle Edit Preferences Form
  modalContainer.querySelector('#form-edit-prefs')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dailyGoalHours = Number(modalContainer.querySelector('#pref-hours').value);
    const academicGoal = modalContainer.querySelector('#pref-goal').value;
    store.updateProfile({ dailyGoalHours, academicGoal });
    showToast(`Preferences updated!`, 'success');
    closeModal();
    navigateTo(currentView, currentParams);
  });
}

// Digital Clock on Mobile Status Bar
function startClock() {
  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('mobile-status-clock');
    if (el) el.textContent = `${hours}:${minutes}`;
  }
  update();
  setInterval(update, 1000);
}

// Notification Drawer Toggle
function initNotificationDrawer() {
  const drawer = document.getElementById('notification-drawer');
  const overlay = document.getElementById('notification-drawer-overlay');
  const closeBtn = document.getElementById('btn-close-notif-drawer');
  const clearBtn = document.getElementById('btn-clear-notifs');

  function openDrawer() {
    renderNotificationList();
    drawer?.classList.add('open');
    if (overlay) overlay.style.display = 'block';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
  }

  document.querySelectorAll('[data-open-notifs]').forEach(btn => {
    btn.addEventListener('click', openDrawer);
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  clearBtn?.addEventListener('click', () => {
    store.clearNotifications();
    renderNotificationList();
    updateHeaderAndProfile();
  });

  function renderNotificationList() {
    const list = document.getElementById('notif-drawer-list');
    if (!list) return;

    const state = store.getState();
    if (state.notifications.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: var(--space-6); color: var(--color-text-muted);">
          ${Icons.bell(32)}
          <p style="margin-top: 8px;">No notifications</p>
        </div>
      `;
      return;
    }

    list.innerHTML = state.notifications.map(n => `
      <div class="notification-item">
        <div class="notification-icon">${Icons.bell(16)}</div>
        <div style="flex: 1;">
          <h4 style="font-size: 13.5px; font-weight: 700; color: var(--color-text);">${n.title}</h4>
          <p style="font-size: 12.5px; color: var(--color-text-secondary);">${n.message}</p>
          <span style="font-size: 11px; color: var(--color-text-muted);">${n.time}</span>
        </div>
      </div>
    `).join('');
  }
}

// Desktop Global Search Handler
function initDesktopSearch() {
  const searchInput = document.getElementById('desktop-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        navigateTo('tasks');
        const tasksSearch = document.getElementById('input-task-search');
        if (tasksSearch) {
          tasksSearch.value = q;
          tasksSearch.dispatchEvent(new Event('input'));
        }
      }
    }
  });

  // Keyboard shortcut Ctrl+K or / to focus search
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// App Initialization
export function initApp() {
  window.navigateTo = navigateTo;
  window.openModal = openModal;

  store.applyTheme();
  startClock();
  initNotificationDrawer();
  initDesktopSearch();

  // Desktop Navigation Click Handlers
  document.querySelectorAll('.desktop-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      navigateTo(view);
    });
  });

  // Mobile Bottom Navigation Click Handlers
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      navigateTo(view);
    });
  });

  // Mobile Header Profile Trigger
  document.getElementById('mobile-profile-btn')?.addEventListener('click', () => {
    navigateTo('profile');
  });

  // Desktop Sidebar Profile Trigger
  document.getElementById('sidebar-user-card')?.addEventListener('click', () => {
    navigateTo('profile');
  });

  // Desktop Theme Toggle
  document.getElementById('desktop-theme-toggle')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  // Initial State Check
  const state = store.getState();
  if (!state.onboardingComplete) {
    navigateTo('onboarding');
  } else {
    navigateTo('home');
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
