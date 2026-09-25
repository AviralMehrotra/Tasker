import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { useTheme } from "../utils/ThemeContext";
import { toast } from "sonner";
import {
  Search,
  LayoutDashboard,
  Kanban,
  CheckSquare,
  Activity,
  Calendar,
  Users,
  Trash2,
  PlusCircle,
  SunMoon,
  FileSpreadsheet,
  FileCode,
  Share2,
  CornerDownLeft,
  X,
  Keyboard,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  KeyRound,
} from "lucide-react";
import clsx from "clsx";

export const CommandPalette = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcutsSheet, setShowShortcutsSheet] = useState(false);

  // Fetch all tasks for instant live search & export
  const { data } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "",
    search: "",
  });

  const tasks = data?.tasks || [];

  // Global keydown listeners for ⌘K, ?, and quick navigation chords
  useEffect(() => {
    let keyBuffer = [];
    let bufferTimer = null;

    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in standard inputs
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput =
        activeTag === "input" ||
        activeTag === "textarea" ||
        document.activeElement?.isContentEditable;

      // ⌘K or Ctrl+K: Toggle Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Escape: Close Palette or Shortcuts Modal
      if (e.key === "Escape") {
        if (showShortcutsSheet) {
          setShowShortcutsSheet(false);
          return;
        }
        if (isOpen) {
          setIsOpen(false);
          return;
        }
      }

      if (isInput) return;

      // ?: Open Shortcuts Sheet
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowShortcutsSheet((prev) => !prev);
        return;
      }

      // C: Quick Create Task
      if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey && !isOpen) {
        e.preventDefault();
        navigate("/tasks?action=create");
        return;
      }

      // Quick Chords: G then (D, T, M, A, C, U, R)
      keyBuffer.push(e.key.toLowerCase());
      clearTimeout(bufferTimer);
      bufferTimer = setTimeout(() => {
        keyBuffer = [];
      }, 700);

      if (keyBuffer.length === 2 && keyBuffer[0] === "g") {
        const target = keyBuffer[1];
        keyBuffer = [];
        if (target === "d") navigate("/dashboard");
        if (target === "t") navigate("/tasks");
        if (target === "m") navigate("/my-tasks");
        if (target === "a") navigate("/activity");
        if (target === "c") navigate("/calendar");
        if (target === "u") navigate("/team");
        if (target === "r") navigate("/trashed");
        if (target === "p") {
          window.dispatchEvent(
            new CustomEvent("open-profile-settings", { detail: { tab: "profile" } })
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(bufferTimer);
    };
  }, [isOpen, showShortcutsSheet, navigate, setIsOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) {
      toast.warning("No tasks available to export.");
      return;
    }
    const headers = [
      "Task ID",
      "Title",
      "Stage",
      "Priority",
      "Due Date",
      "Subtasks Count",
      "Team Count",
      "Created At",
    ];

    const rows = tasks.map((t) => [
      `"${t._id}"`,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      `"${t.stage || "todo"}"`,
      `"${t.priority || "normal"}"`,
      `"${t.date ? new Date(t.date).toISOString().split("T")[0] : ""}"`,
      t.subTasks?.length || 0,
      t.team?.length || 0,
      `"${new Date(t.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tasker_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Tasks exported to CSV successfully");
    setIsOpen(false);
  };

  // JSON Export utility
  const handleExportJSON = () => {
    if (!tasks || tasks.length === 0) {
      toast.warning("No tasks available to export.");
      return;
    }
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tasker_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Full workspace backup exported to JSON");
    setIsOpen(false);
  };

  // Copy Workspace link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success("Workspace URL copied to clipboard");
    setIsOpen(false);
  };

  // Base navigation items
  const navItems = [
    {
      id: "nav-dash",
      label: "Dashboard",
      category: "Navigation",
      icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
      shortcut: "G D",
      action: () => navigate("/dashboard"),
    },
    {
      id: "nav-tasks",
      label: "All Tasks & Kanban",
      category: "Navigation",
      icon: <Kanban className="w-4 h-4 text-indigo-500" />,
      shortcut: "G T",
      action: () => navigate("/tasks"),
    },
    {
      id: "nav-mytasks",
      label: "My Tasks Queue",
      category: "Navigation",
      icon: <CheckSquare className="w-4 h-4 text-emerald-500" />,
      shortcut: "G M",
      action: () => navigate("/my-tasks"),
    },
    {
      id: "nav-activity",
      label: "Live Activity Stream",
      category: "Navigation",
      icon: <Activity className="w-4 h-4 text-amber-500" />,
      shortcut: "G A",
      action: () => navigate("/activity"),
    },
    {
      id: "nav-calendar",
      label: "Deadlines & Milestones",
      category: "Navigation",
      icon: <Calendar className="w-4 h-4 text-rose-500" />,
      shortcut: "G C",
      action: () => navigate("/calendar"),
    },
    {
      id: "nav-team",
      label: "Team Members Directory",
      category: "Navigation",
      icon: <Users className="w-4 h-4 text-cyan-500" />,
      shortcut: "G U",
      action: () => navigate("/team"),
    },
    {
      id: "nav-trash",
      label: "Trash Archive",
      category: "Navigation",
      icon: <Trash2 className="w-4 h-4 text-slate-400" />,
      shortcut: "G R",
      action: () => navigate("/trashed"),
    },
    {
      id: "nav-profile",
      label: "My Profile & Account Settings",
      category: "Navigation",
      icon: <User className="w-4 h-4 text-blue-500" />,
      shortcut: "G P",
      action: () =>
        window.dispatchEvent(
          new CustomEvent("open-profile-settings", { detail: { tab: "profile" } })
        ),
    },
  ];

  // Base action items
  const actionItems = [
    {
      id: "act-create",
      label: "Create New Task",
      category: "Actions",
      icon: <PlusCircle className="w-4 h-4 text-blue-500" />,
      shortcut: "C",
      action: () => navigate("/tasks?action=create"),
    },
    {
      id: "act-password",
      label: "Change Account Password",
      category: "Actions",
      icon: <KeyRound className="w-4 h-4 text-amber-500" />,
      action: () =>
        window.dispatchEvent(
          new CustomEvent("open-profile-settings", { detail: { tab: "security" } })
        ),
    },
    {
      id: "act-theme",
      label: `Switch to ${isDark ? "Light" : "Dark"} Mode`,
      category: "Actions",
      icon: <SunMoon className="w-4 h-4 text-amber-400" />,
      shortcut: "T",
      action: () => toggleTheme(),
    },
    {
      id: "act-csv",
      label: "Export All Tasks to CSV",
      category: "Actions",
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
      action: handleExportCSV,
    },
    {
      id: "act-json",
      label: "Export Full Workspace to JSON",
      category: "Actions",
      icon: <FileCode className="w-4 h-4 text-sky-500" />,
      action: handleExportJSON,
    },
    {
      id: "act-copy",
      label: "Copy Workspace URL",
      category: "Actions",
      icon: <Share2 className="w-4 h-4 text-slate-400" />,
      action: handleCopyLink,
    },
  ];

  // Filter and build results list
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Navigation items matching query
    const matchedNav = navItems.filter((item) =>
      q ? item.label.toLowerCase().includes(q) : true
    );

    // 2. Action items matching query
    const matchedActions = actionItems.filter((item) =>
      q ? item.label.toLowerCase().includes(q) : true
    );

    // 3. Task records matching query
    let matchedTasks = [];
    if (q) {
      matchedTasks = tasks
        .filter(
          (t) =>
            t.title?.toLowerCase().includes(q) ||
            t.priority?.toLowerCase().includes(q) ||
            t.stage?.toLowerCase().includes(q)
        )
        .slice(0, 6)
        .map((t) => ({
          id: `task-${t._id}`,
          label: t.title,
          subLabel: `${t.priority.toUpperCase()} · ${t.stage.toUpperCase()}`,
          category: "Matching Tasks",
          icon:
            t.stage === "completed" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : t.priority === "high" ? (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            ) : (
              <Clock className="w-4 h-4 text-blue-500" />
            ),
          action: () => navigate(`/task/${t._id}`),
        }));
    }

    return [...matchedNav, ...matchedActions, ...matchedTasks];
  }, [query, isDark, tasks]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  // Keyboard navigation within the palette
  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        current.action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen && !showShortcutsSheet) return null;

  return (
    <>
      {/* ⌘K Command Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200 dark:border-[#1e2333] shadow-2xl overflow-hidden flex flex-col transition-all duration-150 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-[#1d202d] gap-3">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command, jump to page, or search tasks..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#f4f4f6] placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-[#161926] border border-slate-200 dark:border-[#22273b] rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-[#151824] scrollbar-none">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
                  No matching commands or tasks found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className={clsx(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-600/15 text-blue-900 dark:text-white border border-blue-200 dark:border-blue-500/30"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#12151f] border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">{item.icon}</div>
                          <div className="truncate">
                            <span className="font-semibold">{item.label}</span>
                            {item.subLabel && (
                              <span className="ml-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                {item.subLabel}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.shortcut ? (
                            <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#202538] rounded">
                              {item.shortcut}
                            </kbd>
                          ) : isSelected ? (
                            <span className="flex items-center text-[10px] font-mono text-blue-600 dark:text-blue-400">
                              <CornerDownLeft className="w-3 h-3 mr-1" /> select
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Control Hint */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-[#1d202d] bg-slate-50/70 dark:bg-[#090b12] flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-0.2 bg-white dark:bg-[#161926] border border-slate-200 dark:border-[#22273b] rounded">↑</kbd>
                  <kbd className="px-1 py-0.2 bg-white dark:bg-[#161926] border border-slate-200 dark:border-[#22273b] rounded">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1 py-0.2 bg-white dark:bg-[#161926] border border-slate-200 dark:border-[#22273b] rounded">↵</kbd>
                  <span>execute</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowShortcutsSheet(true);
                }}
                className="hover:text-blue-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Shortcuts (?)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Cheatsheet Modal (?) */}
      {showShortcutsSheet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setShowShortcutsSheet(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0c0e17] rounded-xl border border-slate-200 dark:border-[#1e2333] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1d202d]">
              <div className="flex items-center gap-2.5">
                <Keyboard className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Keyboard Shortcuts Cheatsheet
                </h3>
              </div>
              <button
                onClick={() => setShowShortcutsSheet(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#161926] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Global Navigation
                </p>
                <div className="space-y-1.5 font-medium">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Command Palette</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      ⌘K / Ctrl+K
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Dashboard</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      G then D
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>All Tasks</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      G then T
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>My Tasks</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      G then M
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Activity Feed</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      G then A
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Quick Actions
                </p>
                <div className="space-y-1.5 font-medium">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Create New Task</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      C
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Toggle Theme</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      T (in palette)
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Show Shortcuts</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      ?
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#161926]">
                    <span>Close Active Modal</span>
                    <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-[#161926] rounded border border-slate-200 dark:border-[#22273b]">
                      ESC
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandPalette;
