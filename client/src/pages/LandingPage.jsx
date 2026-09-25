import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../utils/ThemeContext.jsx";
import {
  ArrowRight,
  ShieldCheck,
  Terminal,
  Zap,
  Command,
  Activity,
  Calendar,
  Check,
  Sun,
  Moon,
  Sliders,
  CheckSquare,
  Menu,
  X,
  Play,
  Columns3,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("sprint");
  const [demoFilter, setDemoFilter] = useState("all");
  const [copiedShortcut, setCopiedShortcut] = useState(false);

  // Interactive Live Kanban tasks state for visitor playground
  const [interactiveTasks, setInteractiveTasks] = useState([
    {
      id: "TSK-102",
      title: "Migrate token refresh to httpOnly secure cookies",
      tag: "Security",
      priority: "urgent",
      completed: false,
      assignee: "Alex M.",
      assigneeBg: "bg-blue-600",
      due: "Today",
    },
    {
      id: "TSK-088",
      title: "Implement ⌘K command palette fuzzy matching",
      tag: "Frontend",
      priority: "high",
      completed: true,
      assignee: "Sarah K.",
      assigneeBg: "bg-emerald-600",
      due: "Yesterday",
    },
    {
      id: "TSK-041",
      title: "Optimize MongoDB compound indexes on task queries",
      tag: "Database",
      priority: "high",
      completed: true,
      assignee: "David L.",
      assigneeBg: "bg-purple-600",
      due: "2d ago",
    },
    {
      id: "TSK-094",
      title: "Stage drag-and-drop optimistic reorder with rollback",
      tag: "Frontend",
      priority: "normal",
      completed: true,
      assignee: "Alex M.",
      assigneeBg: "bg-blue-600",
      due: "1d ago",
    },
    {
      id: "TSK-119",
      title: "Add activity telemetry stream for workspace audits",
      tag: "Backend",
      priority: "urgent",
      completed: false,
      assignee: "Elena R.",
      assigneeBg: "bg-amber-600",
      due: "Tomorrow",
    },
    {
      id: "TSK-033",
      title: "Refactor stage tab redundant routes into unified views",
      tag: "Architecture",
      priority: "normal",
      completed: true,
      assignee: "Sarah K.",
      assigneeBg: "bg-emerald-600",
      due: "3d ago",
    },
  ]);

  const toggleTaskStatus = (id) => {
    setInteractiveTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = interactiveTasks.filter((t) => {
    if (demoFilter === "all") return true;
    return t.priority === demoFilter;
  });

  const completedCount = interactiveTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / interactiveTasks.length) * 100);

  const handleCopyShortcut = () => {
    navigator.clipboard?.writeText?.("⌘K");
    setCopiedShortcut(true);
    setTimeout(() => setCopiedShortcut(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] selection:bg-blue-600 selection:text-white transition-colors duration-200 bg-grain">
      {/* =========================================================================
          1. NAVIGATION BAR (Strictly <= 72px)
      ========================================================================= */}
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200/80 dark:border-[#1d202d] bg-white/80 dark:bg-[#08090d]/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Version Pill */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1 border border-blue-500/20 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Tasker Logo"
                className="w-full h-full object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Tasker
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#12141f] border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a
              href="#features"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#interactive-board"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Live Demo
            </a>
            <a
              href="#workflow"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Workflow
            </a>
            <a
              href="#comparison"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Architecture vs Legacy
            </a>
            <a
              href="#security"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Security
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#121520] border border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Dynamic Auth CTA */}
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all hover:shadow-blue-500/20 cursor-pointer"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all hover:shadow-blue-500/25 cursor-pointer"
                >
                  <span>Launch Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151825]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#0c0e15] px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Capabilities
            </a>
            <a
              href="#interactive-board"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Live Demo
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Workflow
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Architecture vs Legacy
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Security
            </a>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white"
              >
                {user ? "Open Workspace" : "Sign In to Tasker"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. ASYMMETRICAL SPLIT HERO SECTION (min-h-[92vh])
      ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-slate-200/70 dark:border-[#1d202d]">
        {/* Subtle structural grid backdrop (pure geometric, zero purple/indigo blur blobs) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Sharp Editorial Typography & Direct CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Telemetry Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Tasker 2.0 Live</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="hidden sm:inline">Zero-Bloat Kanban</span>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span>Sub-80ms Engine</span>
              </div>

              {/* Punchy 2-Line Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Project orchestration <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">
                  engineered for speed.
                </span>
              </h1>

              {/* Subtext <= 20 words strictly */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                A keyboard-first Kanban environment for high-velocity software teams. Track sprints,
                coordinate releases, and eliminate ceremonial drag.
              </p>

              {/* Action Buttons & Quick Demo Access */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer group"
                >
                  <span>{user ? "Open Your Workspace" : "Start Organizing Free"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#interactive-board"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-[#10121a] hover:bg-slate-50 dark:hover:bg-[#161925] border border-slate-200 dark:border-[#1d202d] text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                  <span>Try Interactive Board</span>
                </a>
              </div>

              {/* Telemetry / Capability Chips */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  onClick={handleCopyShortcut}
                  className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer"
                  title="Copy command palette shortcut"
                >
                  <Command className="w-3.5 h-3.5 text-slate-400" />
                  <span>⌘K Command Palette</span>
                  {copiedShortcut && (
                    <span className="text-[10px] text-emerald-500 font-semibold">Copied!</span>
                  )}
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Optimistic Rollback</span>
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Role-Based Access</span>
                </span>
              </div>
            </div>

            {/* Right Column: Live Interactive Product Board Simulation */}
            <div className="lg:col-span-6" id="interactive-board">
              <div className="rounded-2xl bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-[#1d202d] shadow-xl overflow-hidden transition-all">
                {/* Board Mockup Window Bar */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-[#12141f] border-b border-slate-200 dark:border-[#1d202d] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      sprint-v2.0 // live-sandbox
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded">
                      Live Sync Active
                    </span>
                  </div>
                </div>

                {/* Interactive Controls Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#161925] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Sprint Execution Board
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Click any checkbox below to experience zero-latency state toggle
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#161926] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium">
                      {["all", "urgent", "high", "normal"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setDemoFilter(p)}
                          className={`px-2.5 py-1 rounded capitalize transition-all cursor-pointer ${
                            demoFilter === p
                              ? "bg-white dark:bg-[#202538] text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Progress Metric */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 dark:text-slate-400">
                        Sprint Velocity ({completedCount}/{interactiveTasks.length} Done)
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Task Cards List */}
                <div className="p-3 sm:p-4 space-y-2 max-h-[380px] overflow-y-auto">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 select-none ${
                        task.completed
                          ? "bg-slate-50/60 dark:bg-[#0c0e15]/40 border-slate-200/60 dark:border-[#151722] opacity-75"
                          : "bg-white dark:bg-[#12141f] border-slate-200 dark:border-[#1d202d] hover:border-blue-400/50 hover:shadow-xs"
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                          task.completed
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-transparent"
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                            {task.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${
                                task.priority === "urgent"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                  : task.priority === "high"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                              {task.due}
                            </span>
                          </div>
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 leading-snug transition-colors ${
                            task.completed
                              ? "line-through text-slate-400 dark:text-slate-500"
                              : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#181c2b] px-1.5 py-0.5 rounded">
                            #{task.tag}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-4 h-4 rounded-full text-[9px] text-white flex items-center justify-center font-bold ${task.assigneeBg}`}
                            >
                              {task.assignee[0]}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {task.assignee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Micro-telemetry */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#12141f] border-t border-slate-200 dark:border-[#1d202d] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Interactive Simulator
                  </span>
                  <Link
                    to="/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Log in to create tasks</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INDUSTRIAL ARCHITECTURE BANNER (Built on Modern Stack)
      ========================================================================= */}
      <section className="py-10 border-b border-slate-200/70 dark:border-[#1d202d] bg-slate-50/50 dark:bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-6">
            Engineered with modern full-stack industrial primitives
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { title: "React 19", sub: "Concurrent UI", tag: "Frontend" },
              { title: "Node.js 20+", sub: "High Throughput", tag: "Runtime" },
              { title: "Express REST", sub: "Deterministic API", tag: "Backend" },
              { title: "MongoDB Atlas", sub: "Document Engine", tag: "Database" },
              { title: "Redux Toolkit", sub: "Predictable State", tag: "State" },
              { title: "Vite 6", sub: "Instant HMR & Build", tag: "Bundler" },
            ].map((stack, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] text-center space-y-1 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                    {stack.tag}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{stack.title}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {stack.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. ASYMMETRICAL BENTO GRID: CAPABILITIES & PILLARS (#features)
      ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold">
            Architectural Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed from first principles to eliminate friction.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every feature in Tasker is tuned for high-velocity software engineering workflows. No
            ceremonial menus, no delayed renders, no distraction.
          </p>
        </div>

        {/* Bento Grid with Diverse Cell Roles (Not generic cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Kanban Pipeline Orchestrator (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Columns3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Multi-Stage Pipeline Orchestration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Organize tasks seamlessly across <strong>To Do</strong>, <strong>In Progress</strong>
                , and <strong>Completed</strong> stages. Fluid drag-and-drop mechanics with instant
                optimistic UI updates and state rollbacks.
              </p>
            </div>

            {/* Visual Mini Pipeline Preview */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-[#1e2233]">
              {/* Lane 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-500">
                  <span>TODO</span>
                  <span className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-[10px]">3</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="w-8 h-1 bg-blue-500 rounded" />
                  <p className="font-medium text-slate-800 dark:text-slate-200">API Gateway Setup</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="w-8 h-1 bg-amber-500 rounded" />
                  <p className="font-medium text-slate-800 dark:text-slate-200">Webhook Handlers</p>
                </div>
              </div>

              {/* Lane 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-medium text-blue-500">
                  <span>IN PROGRESS</span>
                  <span className="bg-blue-100 dark:bg-blue-950 px-1 rounded text-[10px]">2</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a1e2f] border border-blue-500/40 shadow-xs text-[11px] space-y-1">
                  <div className="w-8 h-1 bg-rose-500 rounded" />
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    Session Invalidation
                  </p>
                </div>
              </div>

              {/* Lane 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-medium text-emerald-500">
                  <span>COMPLETED</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 px-1 rounded text-[10px]">
                    8
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1 opacity-70">
                  <div className="w-8 h-1 bg-emerald-500 rounded" />
                  <p className="font-medium text-slate-800 dark:text-slate-200">JWT Middleware</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Keyboard-First Command Palette (Span 1) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Universal Command Palette
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Never take your hands off the keyboard. Press <strong>⌘K</strong> anywhere to jump
                between boards, filter by priority, or assign team members.
              </p>
            </div>

            {/* Visual Command Palette Simulation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-[#1e2233] space-y-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-700 text-xs">
                <Command className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-mono text-slate-400">filter:urgent</span>
                <span className="w-1.5 h-3 bg-blue-500 animate-pulse ml-auto" />
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium flex items-center justify-between">
                  <span>Show all Urgent bugs</span>
                  <span className="font-mono text-[9px]">ENTER</span>
                </div>
                <div className="px-2 py-1 rounded text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Assign to Alex</span>
                  <span className="font-mono text-[9px]">TAB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Live Collaborative Activity Feed (Span 1) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Real-Time Activity Stream
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Audit trails with commit-style granularity. Track who moved a task, attached
                deliverables, or modified milestone dates in real time.
              </p>
            </div>

            {/* Visual Stream Mockup */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-[#1e2233] text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  A
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-white">Alex</span>
                  <span className="text-slate-500 dark:text-slate-400"> resolved TSK-102</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 ml-auto">2m</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  S
                </div>
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-white">Sarah</span>
                  <span className="text-slate-500 dark:text-slate-400"> added 3 subtasks</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 ml-auto">14m</span>
              </div>
            </div>
          </div>

          {/* Card 4: Enterprise RBAC Governance (Span 2) */}
          <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Role-Based Access Governance (RBAC)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                Engineered with strict separation of privilege. Administrators manage team
                onboarding, system trash recovery, and role assignments; members focus on rapid task
                velocity.
              </p>
            </div>

            {/* Visual Matrix Pill Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-[#1e2233]">
              <div className="p-3 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Workspace Administrator
                  </span>
                  <span className="font-mono text-[10px] text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </div>
                <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> User provisioning & deactivation
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Trash bin recovery & purge
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Workspace-wide analytics
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Engineering Member
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Member
                  </span>
                </div>
                <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Full task creation & stage moves
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Personal sprint & deadline view
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Subtask checklist execution
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE WORKFLOW SHOWCASE (#workflow)
      ========================================================================= */}
      <section
        id="workflow"
        className="py-20 border-t border-b border-slate-200/70 dark:border-[#1d202d] bg-slate-50/50 dark:bg-[#090b10]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold">
              Unified Engineering Flow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One environment. Zero cognitive fragmentation.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Toggle between three specialized modes designed for specific moments of your
              development cycle.
            </p>

            {/* Workflow Mode Tabs */}
            <div className="pt-4 flex items-center justify-center gap-2">
              {[
                { id: "sprint", label: "Sprint Execution", icon: <CheckSquare className="w-4 h-4" /> },
                { id: "activity", label: "Audit & Standup", icon: <Activity className="w-4 h-4" /> },
                { id: "calendar", label: "Milestone Deadlines", icon: <Calendar className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkflowTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeWorkflowTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white dark:bg-[#12141f] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1d202d] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-[#1d202d] shadow-lg p-6 sm:p-8">
            {activeWorkflowTab === "sprint" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs text-blue-500 font-semibold uppercase tracking-wider">
                    Stage 01 // Daily Execution
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Rapid Kanban Stage Triage
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Move tasks fluidly across progress states without reloading or waiting for
                    roundtrips. Filter instantly by priority, view assignee avatars, and maintain
                    uninterrupted development flow.
                  </p>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Optimistic local state updates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Automatic priority-based sorting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Single-click subtask checklist progression
                    </li>
                  </ul>
                </div>
                <div className="md:col-span-7 p-4 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-slate-500">Live Stage Snapshot</span>
                    <span className="text-blue-500 font-mono font-semibold">14 Tasks Active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          [AUTH-02] Harden session cookie attributes
                        </p>
                        <p className="text-[11px] text-slate-500">Assignee: Alex M. • Due Tomorrow</p>
                      </div>
                      <span className="font-mono text-[10px] text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded uppercase font-semibold">
                        Urgent
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-[#1a1e2f] border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          [CORE-19] Command Palette fuzzy index build
                        </p>
                        <p className="text-[11px] text-slate-500">Assignee: Sarah K. • In Review</p>
                      </div>
                      <span className="font-mono text-[10px] text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded uppercase font-semibold">
                        High
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowTab === "activity" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs text-blue-500 font-semibold uppercase tracking-wider">
                    Stage 02 // Team Transparency
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Synchronized Audit Stream
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Eliminate repetitive standup meetings. Every task creation, status advancement,
                    and subtask check is recorded in a clear chronological timeline with team avatar
                    attribution.
                  </p>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Granular event timestamps
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Automatic stage transition logs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Team-wide telemetry overview
                    </li>
                  </ul>
                </div>
                <div className="md:col-span-7 p-4 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        A
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white font-medium">
                          Alex M. marked <span className="text-blue-500">#TSK-102</span> as Completed
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">Today at 18:42:10 UTC</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        S
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white font-medium">
                          Sarah K. changed priority of <span className="text-amber-500">#CORE-19</span>{" "}
                          to High
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">Today at 17:15:02 UTC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowTab === "calendar" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs text-blue-500 font-semibold uppercase tracking-wider">
                    Stage 03 // Milestone Clarity
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Deadline & Release Radar
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Anticipate delivery risks before they become blockers. Dedicated deadline
                    intelligence groups work by urgency: Overdue, Due Today, Tomorrow, and This
                    Sprint.
                  </p>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Visual date urgency chips
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Zero surprise sprint slips
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Compact calendar timeline view
                    </li>
                  </ul>
                </div>
                <div className="md:col-span-7 p-4 rounded-xl bg-slate-50 dark:bg-[#141723] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                      <span className="font-mono text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                        Due Today (1)
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">
                        Production Release v2.0.4
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                      <span className="font-mono text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                        In 2 Days (3)
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">
                        Client Acceptance Sign-off
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ARCHITECTURAL COMPARISON: TASKER VS LEGACY (#comparison)
      ========================================================================= */}
      <section id="comparison" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold">
            Architectural Audit
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why high-velocity teams leave legacy trackers.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Legacy tools were built for 2005 corporate compliance. Tasker is engineered for 2026
            software builders who value raw speed.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#0f1118] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1d202d] bg-slate-50 dark:bg-[#12141f]">
                  <th className="p-4 sm:p-5 font-mono text-xs uppercase text-slate-500 dark:text-slate-400">
                    Dimension
                  </th>
                  <th className="p-4 sm:p-5 font-mono text-xs uppercase text-rose-600 dark:text-rose-400">
                    Legacy Tools (Jira / Clunky SaaS)
                  </th>
                  <th className="p-4 sm:p-5 font-mono text-xs uppercase text-blue-600 dark:text-blue-400 font-bold">
                    Tasker Architecture
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                    Interaction Latency
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    1,200ms – 3,500ms multi-page reload lag
                  </td>
                  <td className="p-4 sm:p-5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                    &lt; 80ms instant client-side updates
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                    Keyboard Navigation
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    Mouse-required with 14 nested menus
                  </td>
                  <td className="p-4 sm:p-5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    Universal ⌘K launcher & quick shortcuts
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                    Setup & Onboarding
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    Requires dedicated Jira admin certifications
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">
                    Zero config, ready in 30 seconds
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                    Interface Density
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    60+ noisy buttons and custom mandatory fields
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">
                    Distraction-free stage lanes & clean typography
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                    Security Architecture
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                    Bloated tracking cookies and third-party trackers
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">
                    httpOnly stateless JWT & sanitize-first inputs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. NUMERIC PERFORMANCE TELEMETRY BAR
      ========================================================================= */}
      <section className="py-14 border-t border-b border-slate-200/70 dark:border-[#1d202d] bg-white dark:bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                &lt; 80ms
              </p>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                Optimistic State Sync
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                100%
              </p>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                Keyboard Navigable
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                0
              </p>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                Tracking Pixels or Ads
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                256-bit
              </p>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                Encrypted Session Tokens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. HIGH-CONVERSION BOTTOM ARCHITECTURAL CTA
      ========================================================================= */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0c0e15] border border-slate-800 p-8 sm:p-12 lg:p-16 overflow-hidden text-white shadow-2xl">
          {/* Subtle structural grid line background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • Cluster US-East-1</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to ship at full velocity?
            </h2>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              Experience the clarity of zero-drag project orchestration. Set up your workspace in
              seconds or sign in with our preconfigured demo accounts.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                <span>{user ? "Open Your Workspace" : "Launch Free Workspace"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#161926] hover:bg-[#1d2133] border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>Sign In to Existing Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. ENGINEERING-GRADE FOOTER
      ========================================================================= */}
      <footer
        id="security"
        className="border-t border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#06070a] pt-14 pb-10 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-[#161926] p-1 border border-blue-500/20 flex items-center justify-center">
                  <img src="/logo.png" alt="Tasker" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Tasker
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-800 px-1 py-0.5 rounded">
                  v2.0.4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Project orchestration engineered for high-velocity software teams. Zero ceremonial
                drag. Sub-80ms interactions. Strict role-based governance.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All Services Operational</span>
              </div>
            </div>

            {/* Col 2: Workspace Views */}
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                Workspace
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li>
                  <Link to="/login" className="hover:text-blue-500 transition-colors">
                    Sprint Board
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-500 transition-colors">
                    Personal Tasks
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-500 transition-colors">
                    Activity Feed
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-500 transition-colors">
                    Milestone Radar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Architecture */}
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                Architecture
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li>
                  <span className="font-mono">React 19 Concurrent</span>
                </li>
                <li>
                  <span className="font-mono">Redux Toolkit Slices</span>
                </li>
                <li>
                  <span className="font-mono">MongoDB Compound Indexes</span>
                </li>
                <li>
                  <span className="font-mono">Vite 6 Fast Bundler</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Governance */}
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-900 dark:text-white font-semibold">
                Governance
              </p>
              <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                <li>
                  <span>Role-Based RBAC</span>
                </li>
                <li>
                  <span>Stateless JWT Auth</span>
                </li>
                <li>
                  <span>Trash Bin Recovery</span>
                </li>
                <li>
                  <span>Sanitized XSS Inputs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Keyboard helper */}
          <div className="pt-8 border-t border-slate-200 dark:border-[#1d202d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <p>© 2026 Tasker Inc. Built for speed, precision, and focus.</p>
            <p className="flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                ⌘K
              </kbd>
              <span>for universal command launcher</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
