/* StudyPulse Calendar & Deadline View */
import { store, getTodayDateStr } from '../store.js';
import { Icons } from '../icons.js';

let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0-indexed
let selectedDateStr = getTodayDateStr(0);

export function renderCalendar(container, navigateTo, openModal) {
  const state = store.getState();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });

  // Gather deadlines and sessions grouped by date string (YYYY-MM-DD)
  const dateEventsMap = {};
  state.tasks.forEach(t => {
    if (!dateEventsMap[t.deadline]) dateEventsMap[t.deadline] = { tasks: [], sessions: [] };
    dateEventsMap[t.deadline].tasks.push(t);
  });
  state.sessions.forEach(s => {
    if (!dateEventsMap[s.date]) dateEventsMap[s.date] = { tasks: [], sessions: [] };
    dateEventsMap[s.date].sessions.push(s);
  });

  const selectedDayEvents = dateEventsMap[selectedDateStr] || { tasks: [], sessions: [] };

  container.innerHTML = `
    <div class="fade-in">
      <!-- Top Action Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
        <div>
          <h1 style="font-size: 24px; font-weight: 800;">Academic Calendar</h1>
          <p>Visualize exam milestones, assignment deadlines, and planned study sessions.</p>
        </div>
        <div style="display: flex; gap: var(--space-1);">
          <button id="btn-cal-add-session" class="btn-secondary">
            ${Icons.plus(16)} Plan Session
          </button>
          <button id="btn-cal-add-task" class="btn-primary">
            ${Icons.plus(16)} Add Deadline
          </button>
        </div>
      </div>

      <div class="grid-dashboard">
        <!-- Calendar Grid Card -->
        <div class="calendar-container">
          <div class="calendar-header">
            <h2 style="font-size: 18px; font-weight: 800;">${monthName} ${viewYear}</h2>
            <div style="display: flex; gap: 4px;">
              <button id="btn-cal-prev" class="btn-icon">
                ${Icons.chevronLeft(16)}
              </button>
              <button id="btn-cal-today" class="btn-ghost btn-sm" style="font-weight: 700;">
                Today
              </button>
              <button id="btn-cal-next" class="btn-icon">
                ${Icons.chevronRight(16)}
              </button>
            </div>
          </div>

          <div class="calendar-grid">
            <div class="calendar-weekday">Sun</div>
            <div class="calendar-weekday">Mon</div>
            <div class="calendar-weekday">Tue</div>
            <div class="calendar-weekday">Wed</div>
            <div class="calendar-weekday">Thu</div>
            <div class="calendar-weekday">Fri</div>
            <div class="calendar-weekday">Sat</div>

            <!-- Empty slots before first day -->
            ${Array.from({ length: firstDay }).map(() => `
              <div class="calendar-cell other-month"></div>
            `).join('')}

            <!-- Month Days -->
            ${Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === getTodayDateStr(0);
              const isSelected = dateStr === selectedDateStr;
              const hasEvents = dateEventsMap[dateStr];
              const taskCount = hasEvents?.tasks?.length || 0;
              const sessionCount = hasEvents?.sessions?.length || 0;

              return `
                <div class="calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-day="${dateStr}">
                  <span>${day}</span>
                  ${hasEvents ? `
                    <div class="calendar-cell-dots">
                      ${taskCount > 0 ? '<div class="calendar-dot deadline"></div>' : ''}
                      ${sessionCount > 0 ? '<div class="calendar-dot session"></div>' : ''}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: var(--space-3); margin-top: var(--space-3); font-size: 11.5px; color: var(--color-text-secondary);">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span class="calendar-dot deadline" style="display: inline-block;"></span> Deadline Due
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span class="calendar-dot session" style="display: inline-block;"></span> Study Session
            </div>
          </div>
        </div>

        <!-- Selected Date Breakdown -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${Icons.calendar(18)} Schedule for ${selectedDateStr}</h3>
              <span class="card-subtitle">
                ${selectedDayEvents.tasks.length} deadlines &bull; ${selectedDayEvents.sessions.length} sessions
              </span>
            </div>
          </div>

          <div style="margin-bottom: var(--space-3);">
            <h4 style="font-size: 13px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">
              Deadlines & Tasks (${selectedDayEvents.tasks.length})
            </h4>

            ${selectedDayEvents.tasks.length === 0 ? `
              <p style="font-size: 12.5px; color: var(--color-text-muted); padding: 8px 0;">No deadlines scheduled on this date.</p>
            ` : selectedDayEvents.tasks.map(t => `
              <div class="task-card" style="margin-bottom: 6px; padding: 10px;">
                <div class="task-content">
                  <div class="task-top">
                    <span class="task-subject">${t.subject}</span>
                    <span class="badge ${t.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${t.priority}</span>
                  </div>
                  <div class="task-title" style="font-size: 13.5px;">${t.title}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div>
            <h4 style="font-size: 13px; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px;">
              Study Sessions (${selectedDayEvents.sessions.length})
            </h4>

            ${selectedDayEvents.sessions.length === 0 ? `
              <p style="font-size: 12.5px; color: var(--color-text-muted); padding: 8px 0;">No study sessions booked on this date.</p>
            ` : selectedDayEvents.sessions.map(s => `
              <div class="session-card" style="margin-bottom: 6px; padding: 10px;">
                <div class="session-left">
                  <div class="session-info">
                    <span class="session-subject-tag">${s.subject}</span>
                    <span class="session-topic" style="font-size: 13.5px;">${s.topic}</span>
                    <span class="session-time">${s.startTime} &bull; ${s.duration} mins</span>
                  </div>
                </div>
                <div>
                  ${s.completed ? '<span class="badge badge-success">Done</span>' : '<span class="badge badge-secondary">Pending</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Month Navigation
  container.querySelector('#btn-cal-prev')?.addEventListener('click', () => {
    if (viewMonth === 0) {
      viewMonth = 11;
      viewYear -= 1;
    } else {
      viewMonth -= 1;
    }
    renderCalendar(container, navigateTo, openModal);
  });

  container.querySelector('#btn-cal-next')?.addEventListener('click', () => {
    if (viewMonth === 11) {
      viewMonth = 0;
      viewYear += 1;
    } else {
      viewMonth += 1;
    }
    renderCalendar(container, navigateTo, openModal);
  });

  container.querySelector('#btn-cal-today')?.addEventListener('click', () => {
    viewYear = new Date().getFullYear();
    viewMonth = new Date().getMonth();
    selectedDateStr = getTodayDateStr(0);
    renderCalendar(container, navigateTo, openModal);
  });

  // Select Date Cell
  container.querySelectorAll('[data-day]').forEach(cell => {
    cell.addEventListener('click', () => {
      selectedDateStr = cell.getAttribute('data-day');
      renderCalendar(container, navigateTo, openModal);
    });
  });

  container.querySelector('#btn-cal-add-session')?.addEventListener('click', () => {
    openModal('add-session', { defaultDate: selectedDateStr });
  });

  container.querySelector('#btn-cal-add-task')?.addEventListener('click', () => {
    openModal('add-task', { defaultDate: selectedDateStr });
  });
}
