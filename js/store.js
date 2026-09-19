/* StudyPulse Reactive State Store with LocalStorage Persistence */

const STORAGE_KEY = 'studypulse_app_state_v1';

// Comprehensive Catalogue of 30+ Courses & Subjects for Any Student
export const COURSE_CATALOGUE = [
  { id: "cs-dsa", name: "Data Structures & Algorithms", category: "Computer Science", icon: "🧮", color: "#4F46E5" },
  { id: "cs-dbms", name: "DBMS / SQL", category: "Computer Science", icon: "🗄️", color: "#10B981" },
  { id: "cs-os", name: "Operating Systems", category: "Computer Science", icon: "💻", color: "#6366F1" },
  { id: "cs-cn", name: "Computer Networks", category: "Computer Science", icon: "🌐", color: "#06B6D4" },
  { id: "cs-oop", name: "Object Oriented Programming", category: "Computer Science", icon: "🧱", color: "#8B5CF6" },
  { id: "lang-python", name: "Python", category: "Programming", icon: "🐍", color: "#F59E0B" },
  { id: "lang-java", name: "Java", category: "Programming", icon: "☕", color: "#DC2626" },
  { id: "lang-cpp", name: "C++", category: "Programming", icon: "⚡", color: "#2563EB" },
  { id: "lang-c", name: "C", category: "Programming", icon: "⚙️", color: "#475569" },
  { id: "web-dev", name: "Web Development", category: "Engineering", icon: "🚀", color: "#EC4899" },
  { id: "math-stats", name: "Statistics", category: "Mathematics", icon: "📊", color: "#8B5CF6" },
  { id: "math-r", name: "Advanced R", category: "Mathematics", icon: "📈", color: "#06B6D4" },
  { id: "math-calc", name: "Mathematics", category: "Mathematics", icon: "📐", color: "#3B82F6" },
  { id: "ai-core", name: "Artificial Intelligence", category: "Advanced CS", icon: "🧠", color: "#7C3AED" },
  { id: "ai-ml", name: "Machine Learning", category: "Advanced CS", icon: "🤖", color: "#9333EA" },
  { id: "ai-ds", name: "Data Science", category: "Advanced CS", icon: "🔬", color: "#0EA5E9" },
  { id: "eng-sec", name: "Cyber Security", category: "Engineering", icon: "🛡️", color: "#EF4444" },
  { id: "eng-cloud", name: "Cloud Computing", category: "Engineering", icon: "☁️", color: "#0284C7" },
  { id: "eng-arch", name: "Computer Architecture", category: "Engineering", icon: "🎛️", color: "#D97706" },
  { id: "eng-se", name: "Software Engineering", category: "Engineering", icon: "🛠️", color: "#059669" },
  { id: "des-uiux", name: "UI/UX Design", category: "Design", icon: "🎨", color: "#F43F5E" },
  { id: "biz-econ", name: "Economics", category: "Business", icon: "📉", color: "#16A34A" },
  { id: "biz-comm", name: "Business Communication", category: "Business", icon: "🗣️", color: "#4F46E5" },
  { id: "biz-ethics", name: "Business Ethics", category: "Business", icon: "⚖️", color: "#64748B" },
  { id: "biz-mktg", name: "Digital Marketing", category: "Business", icon: "📣", color: "#EA580C" },
  { id: "biz-acc", name: "Accounting", category: "Business", icon: "📑", color: "#0D9488" },
  { id: "gen-env", name: "Environmental Studies", category: "Sciences", icon: "🌱", color: "#84CC16" },
  { id: "sci-phys", name: "Physics", category: "Sciences", icon: "⚛️", color: "#6366F1" },
  { id: "sci-chem", name: "Chemistry", category: "Sciences", icon: "🧪", color: "#14B8A6" },
  { id: "sci-bio", name: "Biology", category: "Sciences", icon: "🧬", color: "#10B981" }
];

// Helper to format dates YYYY-MM-DD
export function getTodayDateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Initial demo subjects
const defaultSubjects = [
  { id: "sub-1", name: "Data Structures & Algorithms", icon: "🧮", color: "#4F46E5", progress: 78, studyHours: 14.5, totalTopics: 10, completedTopics: 8, pendingTasks: 2 },
  { id: "sub-2", name: "Statistics", icon: "📊", color: "#8B5CF6", progress: 65, studyHours: 9.0, totalTopics: 8, completedTopics: 5, pendingTasks: 1 },
  { id: "sub-3", name: "Advanced R", icon: "📈", color: "#06B6D4", progress: 70, studyHours: 11.0, totalTopics: 9, completedTopics: 6, pendingTasks: 1 },
  { id: "sub-4", name: "DBMS / SQL", icon: "🗄️", color: "#10B981", progress: 60, studyHours: 8.5, totalTopics: 8, completedTopics: 5, pendingTasks: 2 },
  { id: "sub-5", name: "Python", icon: "🐍", color: "#F59E0B", progress: 85, studyHours: 16.0, totalTopics: 12, completedTopics: 10, pendingTasks: 1 }
];

// Initial demo tasks
const defaultTasks = [
  { id: "t-1", subject: "Data Structures & Algorithms", title: "Binary Search Tree Implementation", description: "Implement insertion, deletion, and level-order traversal in C++", deadline: getTodayDateStr(1), priority: "High", status: "pending", reminder: true },
  { id: "t-2", subject: "Statistics", title: "Probability Distributions Quiz Prep", description: "Revise Binomial, Poisson, and Normal distributions with textbook examples", deadline: getTodayDateStr(3), priority: "Medium", status: "pending", reminder: true },
  { id: "t-3", subject: "Advanced R", title: "Data Visualization Capstone", description: "Build interactive ggplot2 and tidyverse plots on housing dataset", deadline: getTodayDateStr(5), priority: "Medium", status: "pending", reminder: false },
  { id: "t-4", subject: "DBMS / SQL", title: "Database Normalization Problem Set", description: "Deconstruct relations into 3NF and BCNF with functional dependencies", deadline: getTodayDateStr(0), priority: "High", status: "completed", reminder: true },
  { id: "t-5", subject: "Python", title: "AsyncIO Web Scraper Lab", description: "Implement rate-limiting and asynchronous requests using aiohttp", deadline: getTodayDateStr(2), priority: "Low", status: "pending", reminder: false }
];

// Initial demo sessions
const defaultSessions = [
  { id: "s-1", subject: "Data Structures & Algorithms", topic: "Graph Traversal (BFS / DFS)", date: getTodayDateStr(0), startTime: "09:30", duration: 90, completed: true, priority: "High" },
  { id: "s-2", subject: "Statistics", topic: "Hypothesis Testing & p-values", date: getTodayDateStr(0), startTime: "14:00", duration: 60, completed: true, priority: "Medium" },
  { id: "s-3", subject: "Advanced R", topic: "Tidyverse Data Wrangling", date: getTodayDateStr(0), startTime: "17:30", duration: 45, completed: false, priority: "Medium" },
  { id: "s-4", subject: "Python", topic: "Object Oriented Design Patterns", date: getTodayDateStr(1), startTime: "10:00", duration: 60, completed: false, priority: "Low" },
  { id: "s-5", subject: "DBMS / SQL", topic: "Query Optimization & Indexes", date: getTodayDateStr(2), startTime: "11:00", duration: 75, completed: false, priority: "High" }
];

// Initial demo goals
const defaultGoals = [
  { id: "g-1", title: "Complete DSA Unit 2", type: "Topics", target: 10, current: 8, unit: "topics", deadline: getTodayDateStr(7), reminder: true },
  { id: "g-2", title: "Study 20 hours this week", type: "Study Hours", target: 20, current: 15, unit: "hours", deadline: getTodayDateStr(4), reminder: true },
  { id: "g-3", title: "Maintain 7-day study streak", type: "Streak", target: 7, current: 6, unit: "days", deadline: getTodayDateStr(2), reminder: false },
  { id: "g-4", title: "Keep screen time under 4h/day", type: "Screen Time", target: 100, current: 75, unit: "%", deadline: getTodayDateStr(14), reminder: false }
];

// Initial demo notifications
const defaultNotifications = [
  { id: "n-1", title: "Upcoming Deadline", message: "DSA Tree Assignment is due tomorrow at 11:59 PM.", time: "10m ago", read: false },
  { id: "n-2", title: "Streak Maintained!", message: "You're on a 6-day study streak. Keep it up!", time: "2h ago", read: false },
  { id: "n-3", title: "Session Completed", message: "Statistics hypothesis testing (60m) logged.", time: "4h ago", read: true }
];

// Initial demo activity
const defaultActivity = [
  { id: "a-1", type: "session", text: "Completed 90m session: Graph Traversal (BFS / DFS)", time: "Today, 11:00 AM", icon: "✅" },
  { id: "a-2", type: "session", text: "Completed 60m session: Hypothesis Testing", time: "Today, 3:00 PM", icon: "📖" },
  { id: "a-3", type: "task", text: "Marked task complete: Database Normalization", time: "Today, 1:15 PM", icon: "🏆" },
  { id: "a-4", type: "goal", text: "Progress updated on: Complete DSA Unit 2 (80%)", time: "Yesterday", icon: "🎯" }
];

const defaultScreenTimeApps = [
  { name: "YouTube", minutes: 85, color: "#EF4444" },
  { name: "Instagram", minutes: 55, color: "#EC4899" },
  { name: "Chrome", minutes: 45, color: "#F59E0B" },
  { name: "Learning Docs", minutes: 50, color: "#10B981" },
  { name: "Other", minutes: 37, color: "#64748B" }
];

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (e) {
      console.error("Failed to parse saved state:", e);
    }
  }

  // Brand new state
  return {
    userName: "",
    academicGoal: "Improve grades",
    dailyGoalHours: 3,
    courseInfo: "General Academics",
    onboardingComplete: false,
    darkMode: false,
    studyStreak: 6,
    screenTimeToday: 272, // 4h 32m
    screenTimeApps: defaultScreenTimeApps,
    subjects: defaultSubjects,
    tasks: defaultTasks,
    sessions: defaultSessions,
    goals: defaultGoals,
    notifications: defaultNotifications,
    activity: defaultActivity
  };
}

class Store {
  constructor() {
    this.state = getInitialState();
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach(fn => fn(this.state));
  }

  // Onboarding
  completeOnboarding(name, selectedSubjects, dailyHours, academicGoal) {
    this.state.userName = name.trim();
    this.state.subjects = selectedSubjects;
    this.state.dailyGoalHours = Number(dailyHours) || 3;
    this.state.academicGoal = academicGoal || "Improve grades";
    this.state.onboardingComplete = true;

    // Add activity
    this.addActivity("welcome", `Welcome to StudyPulse, ${name}! Your study journey has begun.`, "🎉");
    this.notify();
  }

  // Theme
  toggleTheme() {
    this.state.darkMode = !this.state.darkMode;
    this.applyTheme();
    this.notify();
  }

  applyTheme() {
    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark');
    }
  }

  // Subjects Management
  addSubject(subject) {
    const newSub = {
      id: "sub-" + Date.now(),
      progress: 0,
      studyHours: 0,
      totalTopics: 10,
      completedTopics: 0,
      pendingTasks: 0,
      ...subject
    };
    this.state.subjects.unshift(newSub);
    this.addActivity("subject", `Added new subject: ${newSub.name}`, "📚");
    this.notify();
    return newSub;
  }

  updateSubject(id, updates) {
    this.state.subjects = this.state.subjects.map(s => s.id === id ? { ...s, ...updates } : s);
    this.notify();
  }

  removeSubject(id) {
    const sub = this.state.subjects.find(s => s.id === id);
    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    if (sub) {
      this.addActivity("subject", `Removed subject: ${sub.name}`, "🗑️");
    }
    this.notify();
  }

  // Tasks Management
  addTask(task) {
    const newTask = {
      id: "t-" + Date.now(),
      status: "pending",
      ...task
    };
    this.state.tasks.unshift(newTask);
    this.addActivity("task", `Added task: ${newTask.title}`, "📝");
    
    // Increment pending count on subject if matching
    const sub = this.state.subjects.find(s => s.name === newTask.subject);
    if (sub) {
      sub.pendingTasks = (sub.pendingTasks || 0) + 1;
    }
    
    this.notify();
    return newTask;
  }

  updateTask(id, updates) {
    this.state.tasks = this.state.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    this.notify();
  }

  toggleTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;
    task.status = task.status === "completed" ? "pending" : "completed";
    
    // Update subject stats
    const sub = this.state.subjects.find(s => s.name === task.subject);
    if (sub) {
      if (task.status === "completed") {
        sub.pendingTasks = Math.max(0, (sub.pendingTasks || 1) - 1);
        sub.progress = Math.min(100, (sub.progress || 0) + 5);
      } else {
        sub.pendingTasks = (sub.pendingTasks || 0) + 1;
        sub.progress = Math.max(0, (sub.progress || 5) - 5);
      }
    }

    if (task.status === "completed") {
      this.addActivity("task", `Completed task: ${task.title}`, "✅");
    }
    this.notify();
  }

  deleteTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    if (task && task.status === "pending") {
      const sub = this.state.subjects.find(s => s.name === task.subject);
      if (sub) {
        sub.pendingTasks = Math.max(0, (sub.pendingTasks || 1) - 1);
      }
    }
    this.notify();
  }

  // Sessions Management
  addSession(session) {
    const newSession = {
      id: "s-" + Date.now(),
      completed: false,
      ...session
    };
    this.state.sessions.unshift(newSession);
    this.addActivity("session", `Planned study session: ${newSession.topic} (${newSession.duration}m)`, "📅");
    this.notify();
    return newSession;
  }

  toggleSession(id) {
    const session = this.state.sessions.find(s => s.id === id);
    if (!session) return;
    session.completed = !session.completed;

    const sub = this.state.subjects.find(s => s.name === session.subject);
    const hoursDelta = session.duration / 60;
    if (sub) {
      if (session.completed) {
        sub.studyHours = Math.round(((sub.studyHours || 0) + hoursDelta) * 10) / 10;
        sub.completedTopics = Math.min(sub.totalTopics || 10, (sub.completedTopics || 0) + 1);
        sub.progress = Math.min(100, Math.round((sub.completedTopics / (sub.totalTopics || 10)) * 100));
      } else {
        sub.studyHours = Math.max(0, Math.round(((sub.studyHours || 0) - hoursDelta) * 10) / 10);
        sub.completedTopics = Math.max(0, (sub.completedTopics || 1) - 1);
        sub.progress = Math.max(0, Math.round((sub.completedTopics / (sub.totalTopics || 10)) * 100));
      }
    }

    if (session.completed) {
      this.addActivity("session", `Completed ${session.duration}m on ${session.subject}`, "🎉");
    }
    this.notify();
  }

  deleteSession(id) {
    this.state.sessions = this.state.sessions.filter(s => s.id !== id);
    this.notify();
  }

  // Goals Management
  addGoal(goal) {
    const newGoal = {
      id: "g-" + Date.now(),
      current: 0,
      reminder: false,
      ...goal
    };
    this.state.goals.unshift(newGoal);
    this.addActivity("goal", `Set academic goal: ${newGoal.title}`, "🎯");
    this.notify();
    return newGoal;
  }

  incrementGoal(id) {
    const goal = this.state.goals.find(g => g.id === id);
    if (!goal) return;
    goal.current = Math.min(goal.target, goal.current + 1);
    this.addActivity("goal", `Goal progress: ${goal.title} (${goal.current}/${goal.target} ${goal.unit})`, "📈");
    this.notify();
  }

  deleteGoal(id) {
    this.state.goals = this.state.goals.filter(g => g.id !== id);
    this.notify();
  }

  // Notifications
  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.notify();
  }

  clearNotifications() {
    this.state.notifications = [];
    this.notify();
  }

  // Activity Feed
  addActivity(type, text, icon = "📌") {
    const act = {
      id: "act-" + Date.now(),
      type,
      text,
      time: "Just now",
      icon
    };
    this.state.activity.unshift(act);
    if (this.state.activity.length > 20) {
      this.state.activity.pop();
    }
  }

  // Profile Updates
  updateProfile(profile) {
    if (profile.userName) this.state.userName = profile.userName;
    if (profile.courseInfo) this.state.courseInfo = profile.courseInfo;
    if (profile.dailyGoalHours) this.state.dailyGoalHours = Number(profile.dailyGoalHours);
    if (profile.academicGoal) this.state.academicGoal = profile.academicGoal;
    this.notify();
  }

  // Reset demo / restart onboarding
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      userName: "Alex",
      academicGoal: "Improve grades",
      dailyGoalHours: 3,
      courseInfo: "Computer Science & Engineering",
      onboardingComplete: true,
      darkMode: false,
      studyStreak: 6,
      screenTimeToday: 272,
      screenTimeApps: defaultScreenTimeApps,
      subjects: defaultSubjects,
      tasks: defaultTasks,
      sessions: defaultSessions,
      goals: defaultGoals,
      notifications: defaultNotifications,
      activity: defaultActivity
    };
    this.applyTheme();
    this.notify();
  }

  restartOnboarding() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      userName: "",
      academicGoal: "Improve grades",
      dailyGoalHours: 3,
      courseInfo: "",
      onboardingComplete: false,
      darkMode: false,
      studyStreak: 1,
      screenTimeToday: 272,
      screenTimeApps: defaultScreenTimeApps,
      subjects: defaultSubjects,
      tasks: defaultTasks,
      sessions: defaultSessions,
      goals: defaultGoals,
      notifications: defaultNotifications,
      activity: []
    };
    this.applyTheme();
    this.notify();
  }

  // Calculations & Analytics
  calculateOverallProgress() {
    if (!this.state.subjects.length) return 0;
    const total = this.state.subjects.reduce((sum, s) => sum + (s.progress || 0), 0);
    return Math.round(total / this.state.subjects.length);
  }

  calculateTodayStudyMinutes() {
    const today = getTodayDateStr(0);
    return this.state.sessions
      .filter(s => s.date === today && s.completed)
      .reduce((sum, s) => sum + Number(s.duration || 0), 0);
  }

  calculateRemainingMinutes() {
    const targetMin = (this.state.dailyGoalHours || 3) * 60;
    const studied = this.calculateTodayStudyMinutes();
    return Math.max(0, targetMin - studied);
  }

  getUpcomingDeadlines(limit = 4) {
    return this.state.tasks
      .filter(t => t.status === "pending")
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, limit);
  }

  getTodaySessions() {
    const today = getTodayDateStr(0);
    return this.state.sessions.filter(s => s.date === today);
  }

  generateStudyInsights() {
    const insights = [];
    const subjects = this.state.subjects;
    const completedSessions = this.state.sessions.filter(s => s.completed);
    const completedTasks = this.state.tasks.filter(t => t.status === "completed");

    if (subjects.length > 0) {
      // Find top subject by study hours
      const sortedByHours = [...subjects].sort((a, b) => (b.studyHours || 0) - (a.studyHours || 0));
      if (sortedByHours[0] && (sortedByHours[0].studyHours || 0) > 0) {
        insights.push({
          icon: "⭐",
          text: `Your most studied subject this week is <strong>${sortedByHours[0].name}</strong> with ${sortedByHours[0].studyHours}h logged.`
        });
      }
    }

    const todayStudyMin = this.calculateTodayStudyMinutes();
    const targetMin = (this.state.dailyGoalHours || 3) * 60;
    if (todayStudyMin >= targetMin) {
      insights.push({
        icon: "🏆",
        text: `Daily Goal Achieved! You have hit your <strong>${this.state.dailyGoalHours}h</strong> study goal for today.`
      });
    } else if (todayStudyMin > 0) {
      const pct = Math.round((todayStudyMin / targetMin) * 100);
      insights.push({
        icon: "⚡",
        text: `You are <strong>${pct}%</strong> of the way toward your ${this.state.dailyGoalHours}h daily target.`
      });
    }

    if (completedTasks.length > 0) {
      insights.push({
        icon: "✅",
        text: `You have completed <strong>${completedTasks.length} tasks</strong> so far. Keep this momentum!`
      });
    }

    if (this.state.studyStreak >= 3) {
      insights.push({
        icon: "🔥",
        text: `Impressive consistency! You are on a <strong>${this.state.studyStreak}-day</strong> study streak.`
      });
    }

    insights.push({
      icon: "📊",
      text: "Weekday consistency was higher than weekend sessions by +18%."
    });

    return insights;
  }
}

export const store = new Store();
