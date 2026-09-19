/* StudyPulse Multi-Step Onboarding View */
import { store, COURSE_CATALOGUE } from '../store.js';
import { Icons } from '../icons.js';

let currentStep = 1; // 1: Welcome, 2: Name, 3: Subjects, 4: Hours, 5: Goal
let enteredName = "";
let selectedSubjectIds = new Set(["cs-dsa", "math-stats", "math-r", "cs-dbms", "lang-python"]);
let customSubjects = [];
let selectedDailyHours = 3;
let selectedGoal = "Improve grades";
let customGoalText = "";
let subjectSearchQuery = "";

export function renderOnboarding(container, navigateTo) {
  function update() {
    container.innerHTML = getStepHtml();
    attachListeners();
  }

  function getStepHtml() {
    return `
      <div class="onboarding-container fade-in">
        ${currentStep > 1 ? `
          <div class="onboarding-progress-bar">
            ${[2, 3, 4, 5].map(step => `
              <div class="onboarding-step-dot ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}"></div>
            `).join('')}
          </div>
        ` : ''}

        ${getStepContent()}
      </div>
    `;
  }

  function getStepContent() {
    switch (currentStep) {
      case 1:
        return `
          <div class="onboarding-welcome-hero">
            <div class="onboarding-logo-badge">⚡</div>
            <h1 class="onboarding-title">StudyPulse</h1>
            <p class="onboarding-tagline">“Know Your Progress. Own Your Time.”</p>
            
            <div class="card" style="margin: var(--space-4) 0; text-align: left; background: var(--gradient-subtle); border-color: rgba(79, 70, 229, 0.2);">
              <h4 style="color: var(--color-primary); margin-bottom: 6px;">Academic Productivity Core Loop</h4>
              <p style="font-size: 13px; font-weight: 600; color: var(--color-text);">
                PLAN &nbsp;→&nbsp; STUDY &nbsp;→&nbsp; COMPLETE &nbsp;→&nbsp; TRACK &nbsp;→&nbsp; IMPROVE
              </p>
              <p style="font-size: 12.5px; margin-top: 6px; color: var(--color-text-secondary);">
                Tailored for students across every course, college, branch, and degree background.
              </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-1-5);">
              <button id="btn-get-started" class="btn-primary btn-full" style="font-size: 16px; padding: 14px;">
                Get Started ${Icons.arrowRight(18)}
              </button>
              <button id="btn-quick-login" class="btn-secondary btn-full" style="font-size: 14px;">
                Load Demo Profile
              </button>
            </div>
          </div>
        `;

      case 2:
        return `
          <div>
            <span class="badge badge-primary" style="margin-bottom: var(--space-1);">Step 1 of 4</span>
            <h2 style="margin-bottom: 6px;">What should we call you?</h2>
            <p style="margin-bottom: var(--space-3);">Your name will be used to personalize your study dashboards, schedules, and analytics.</p>

            <div class="form-group">
              <label for="input-user-name">Your Full or Preferred Name</label>
              <input id="input-user-name" type="text" placeholder="e.g. Maya Chen, Alex Vance" value="${enteredName}" autofocus />
              <p id="name-error" style="color: var(--color-danger); font-size: 12px; margin-top: 4px; display: none;">Please enter your name to continue.</p>
            </div>

            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
              <button id="btn-back" class="btn-secondary" style="flex: 1;">Back</button>
              <button id="btn-next-name" class="btn-primary" style="flex: 2;">Continue ${Icons.arrowRight(16)}</button>
            </div>
          </div>
        `;

      case 3:
        const allAvailable = [
          ...customSubjects,
          ...COURSE_CATALOGUE
        ];
        const filtered = allAvailable.filter(s => 
          s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase()) ||
          (s.category && s.category.toLowerCase().includes(subjectSearchQuery.toLowerCase()))
        );

        return `
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="badge badge-primary">Step 2 of 4</span>
              <span style="font-size: 12px; font-weight: 700; color: var(--color-primary);">${selectedSubjectIds.size} Selected</span>
            </div>
            <h2 style="margin-top: 6px; margin-bottom: 4px;">Choose Your Subjects</h2>
            <p style="margin-bottom: var(--space-2);">Select the subjects you are actively studying this semester. You can also add your own.</p>

            <div style="display: flex; gap: var(--space-1); margin-bottom: var(--space-1);">
              <div class="search-box" style="flex: 1; width: 100%;">
                ${Icons.search(16)}
                <input id="input-subject-search" type="text" placeholder="Search 30+ subjects..." value="${subjectSearchQuery}" />
              </div>
              <button id="btn-open-custom-subject" class="btn-secondary btn-sm" style="white-space: nowrap;">
                ${Icons.plus(14)} Custom
              </button>
            </div>

            <div class="subject-chip-grid">
              ${filtered.map(sub => {
                const isSel = selectedSubjectIds.has(sub.id);
                return `
                  <div class="subject-chip ${isSel ? 'selected' : ''}" data-id="${sub.id}">
                    <span>${sub.icon || '📚'}</span>
                    <span>${sub.name}</span>
                    ${isSel ? Icons.check(14) : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <div id="custom-subject-form" style="display: none; padding: var(--space-2); background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); margin-bottom: var(--space-2);">
              <h4 style="margin-bottom: 8px;">Add Custom Subject</h4>
              <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <input id="custom-sub-name" placeholder="Subject Name (e.g. Macroeconomics)" style="flex: 3;" />
                <input id="custom-sub-icon" placeholder="Emoji" value="📖" style="flex: 1; text-align: center;" />
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button id="btn-cancel-custom-sub" class="btn-ghost btn-sm">Cancel</button>
                <button id="btn-save-custom-sub" class="btn-primary btn-sm">Add Subject</button>
              </div>
            </div>

            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
              <button id="btn-back" class="btn-secondary" style="flex: 1;">Back</button>
              <button id="btn-next-subjects" class="btn-primary" style="flex: 2;">Continue (${selectedSubjectIds.size}) ${Icons.arrowRight(16)}</button>
            </div>
          </div>
        `;

      case 4:
        const durations = [
          { val: 0.5, label: "30 Minutes", desc: "Light daily review & streak maintenance", icon: "🌱" },
          { val: 1.0, label: "1 Hour", desc: "Balanced steady progress on core tasks", icon: "⏳" },
          { val: 2.0, label: "2 Hours", desc: "Optimal daily deep-work & assignment completion", icon: "⚡" },
          { val: 3.0, label: "3 Hours", desc: "Recommended for intensive coursework", icon: "🚀" },
          { val: 4.0, label: "4+ Hours", desc: "Exam sprint / high-rigor semester target", icon: "🔥" }
        ];

        return `
          <div>
            <span class="badge badge-primary" style="margin-bottom: var(--space-1);">Step 3 of 4</span>
            <h2 style="margin-bottom: 4px;">Daily Study Target</h2>
            <p style="margin-bottom: var(--space-3);">How much focused study time can you commit each day?</p>

            <div class="option-card-grid">
              ${durations.map(d => `
                <div class="option-card ${selectedDailyHours === d.val ? 'selected' : ''}" data-hours="${d.val}">
                  <div class="option-card-content">
                    <span class="option-icon">${d.icon}</span>
                    <div>
                      <h4 style="margin-bottom: 2px;">${d.label}</h4>
                      <p style="font-size: 12px;">${d.desc}</p>
                    </div>
                  </div>
                  <div class="custom-checkbox ${selectedDailyHours === d.val ? 'checked' : ''}">
                    ${Icons.check(14)}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
              <button id="btn-back" class="btn-secondary" style="flex: 1;">Back</button>
              <button id="btn-next-hours" class="btn-primary" style="flex: 2;">Continue ${Icons.arrowRight(16)}</button>
            </div>
          </div>
        `;

      case 5:
        const goals = [
          { key: "Improve grades", desc: "Boost GPA and overall test performance", icon: "📈" },
          { key: "Complete syllabus", desc: "Cover all subject units systematically", icon: "📚" },
          { key: "Prepare for exams", desc: "Targeted revision and practice problem sets", icon: "📝" },
          { key: "Complete assignments on time", desc: "Zero overdue submissions and calm planning", icon: "⏰" },
          { key: "Build consistency", desc: "Maintain daily study streaks without burnout", icon: "🔥" },
          { key: "Custom", desc: "Define your own specific academic priority", icon: "🎯" }
        ];

        return `
          <div>
            <span class="badge badge-primary" style="margin-bottom: var(--space-1);">Step 4 of 4</span>
            <h2 style="margin-bottom: 4px;">Select Your Academic Goal</h2>
            <p style="margin-bottom: var(--space-3);">What is your primary academic focus this term?</p>

            <div class="option-card-grid">
              ${goals.map(g => `
                <div class="option-card ${selectedGoal === g.key ? 'selected' : ''}" data-goal="${g.key}">
                  <div class="option-card-content">
                    <span class="option-icon">${g.icon}</span>
                    <div>
                      <h4 style="margin-bottom: 2px;">${g.key}</h4>
                      <p style="font-size: 12px;">${g.desc}</p>
                    </div>
                  </div>
                  <div class="custom-checkbox ${selectedGoal === g.key ? 'checked' : ''}">
                    ${Icons.check(14)}
                  </div>
                </div>
              `).join('')}
            </div>

            ${selectedGoal === 'Custom' ? `
              <div class="form-group" style="margin-top: var(--space-2);">
                <label>Your Custom Academic Goal</label>
                <input id="input-custom-goal" placeholder="e.g. Master Operating Systems & Complete Lab Project" value="${customGoalText}" />
              </div>
            ` : ''}

            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
              <button id="btn-back" class="btn-secondary" style="flex: 1;">Back</button>
              <button id="btn-finish-onboarding" class="btn-primary" style="flex: 2;">Finish & Launch StudyPulse ⚡</button>
            </div>
          </div>
        `;
    }
  }

  function attachListeners() {
    // Step 1: Welcome
    const btnGetStarted = container.querySelector('#btn-get-started');
    if (btnGetStarted) {
      btnGetStarted.onclick = () => {
        currentStep = 2;
        update();
      };
    }

    const btnQuickLogin = container.querySelector('#btn-quick-login');
    if (btnQuickLogin) {
      btnQuickLogin.onclick = () => {
        store.resetDemoData();
        navigateTo('home');
      };
    }

    // Step 2: Name
    const btnNextName = container.querySelector('#btn-next-name');
    const inputName = container.querySelector('#input-user-name');
    const nameError = container.querySelector('#name-error');

    if (inputName) {
      inputName.oninput = (e) => {
        enteredName = e.target.value;
        if (nameError) nameError.style.display = 'none';
      };
      inputName.onkeydown = (e) => {
        if (e.key === 'Enter') btnNextName?.click();
      };
    }

    if (btnNextName) {
      btnNextName.onclick = () => {
        if (!enteredName.trim()) {
          if (nameError) nameError.style.display = 'block';
          return;
        }
        currentStep = 3;
        update();
      };
    }

    // Step 3: Subjects
    const searchInput = container.querySelector('#input-subject-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        subjectSearchQuery = e.target.value;
        // re-render chips without full reset
        update();
        const reSearch = container.querySelector('#input-subject-search');
        if (reSearch) {
          reSearch.focus();
          reSearch.setSelectionRange(reSearch.value.length, reSearch.value.length);
        }
      };
    }

    container.querySelectorAll('.subject-chip').forEach(chip => {
      chip.onclick = () => {
        const id = chip.getAttribute('data-id');
        if (selectedSubjectIds.has(id)) {
          if (selectedSubjectIds.size > 1) {
            selectedSubjectIds.delete(id);
          }
        } else {
          selectedSubjectIds.add(id);
        }
        update();
      };
    });

    // Custom subject form
    const btnOpenCustom = container.querySelector('#btn-open-custom-subject');
    const customForm = container.querySelector('#custom-subject-form');
    const btnCancelCustom = container.querySelector('#btn-cancel-custom-sub');
    const btnSaveCustom = container.querySelector('#btn-save-custom-sub');

    if (btnOpenCustom && customForm) {
      btnOpenCustom.onclick = () => {
        customForm.style.display = 'block';
        container.querySelector('#custom-sub-name')?.focus();
      };
    }
    if (btnCancelCustom && customForm) {
      btnCancelCustom.onclick = () => {
        customForm.style.display = 'none';
      };
    }
    if (btnSaveCustom) {
      btnSaveCustom.onclick = () => {
        const name = container.querySelector('#custom-sub-name')?.value.trim();
        const icon = container.querySelector('#custom-sub-icon')?.value.trim() || '📚';
        if (name) {
          const newId = 'custom-' + Date.now();
          const customSub = {
            id: newId,
            name,
            icon,
            color: '#4F46E5',
            category: 'Custom'
          };
          customSubjects.push(customSub);
          selectedSubjectIds.add(newId);
          customForm.style.display = 'none';
          update();
        }
      };
    }

    const btnNextSubjects = container.querySelector('#btn-next-subjects');
    if (btnNextSubjects) {
      btnNextSubjects.onclick = () => {
        if (selectedSubjectIds.size === 0) return;
        currentStep = 4;
        update();
      };
    }

    // Step 4: Daily Hours
    container.querySelectorAll('[data-hours]').forEach(card => {
      card.onclick = () => {
        selectedDailyHours = Number(card.getAttribute('data-hours'));
        update();
      };
    });

    const btnNextHours = container.querySelector('#btn-next-hours');
    if (btnNextHours) {
      btnNextHours.onclick = () => {
        currentStep = 5;
        update();
      };
    }

    // Step 5: Goals
    container.querySelectorAll('[data-goal]').forEach(card => {
      card.onclick = () => {
        selectedGoal = card.getAttribute('data-goal');
        update();
      };
    });

    const inputCustomGoal = container.querySelector('#input-custom-goal');
    if (inputCustomGoal) {
      inputCustomGoal.oninput = (e) => {
        customGoalText = e.target.value;
      };
    }

    const btnFinish = container.querySelector('#btn-finish-onboarding');
    if (btnFinish) {
      btnFinish.onclick = () => {
        const allAvailable = [...customSubjects, ...COURSE_CATALOGUE];
        const selectedSubjects = allAvailable
          .filter(s => selectedSubjectIds.has(s.id))
          .map((s, idx) => ({
            id: s.id || ('sub-' + idx),
            name: s.name,
            icon: s.icon || '📚',
            color: s.color || '#4F46E5',
            progress: 50,
            studyHours: 0,
            totalTopics: 10,
            completedTopics: 5,
            pendingTasks: 1
          }));

        const finalGoal = (selectedGoal === 'Custom' && customGoalText.trim()) 
          ? customGoalText.trim() 
          : selectedGoal;

        store.completeOnboarding(enteredName, selectedSubjects, selectedDailyHours, finalGoal);
        navigateTo('home');
      };
    }

    // Common Back Button
    const btnBack = container.querySelector('#btn-back');
    if (btnBack) {
      btnBack.onclick = () => {
        currentStep = Math.max(1, currentStep - 1);
        update();
      };
    }
  }

  update();
}
