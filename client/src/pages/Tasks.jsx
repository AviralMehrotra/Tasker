import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Search,
  X,
  Flame,
  Zap,
  UserCheck,
  Paperclip,
  ArrowUpDown,
} from "lucide-react";
import Loading from "../components/Loader";
import BoardView from "../components/BoardView";
import Table from "../components/Table.jsx";
import AddTask from "../components/tasks/AddTask.jsx";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice.js";
import clsx from "clsx";

const Tasks = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const [selectedView, setSelectedView] = useState("kanban"); // "kanban" | "table"
  const [openCreate, setOpenCreate] = useState(false);

  // Quick filter chips and sorting
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "high" | "due_soon" | "my_tasks" | "has_assets"
  const [sortBy, setSortBy] = useState("default"); // "default" | "due_asc" | "due_desc" | "priority_desc" | "title_asc"

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setOpenCreate(true);
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const status = params?.status || "";
  const searchQuery = searchParams.get("search") || "";

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchQuery,
  });

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const tasksList = data?.tasks || [];

  // Filter and sort calculations
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasksList];

    // Filter
    if (activeFilter === "high") {
      result = result.filter((t) => t.priority?.toLowerCase() === "high");
    } else if (activeFilter === "due_soon") {
      const now = moment().startOf("day");
      result = result.filter((t) => {
        if (!t.date || t.stage === "completed") return false;
        const diff = moment(t.date).startOf("day").diff(now, "days");
        return diff <= 7; // due within 7 days or overdue
      });
    } else if (activeFilter === "my_tasks") {
      result = result.filter((t) => {
        if (!user?._id) return true;
        return t.team?.some((m) =>
          typeof m === "object" ? m._id === user._id : m === user._id
        );
      });
    } else if (activeFilter === "has_assets") {
      result = result.filter((t) => t.assets?.length > 0 || t.links?.length > 0);
    }

    // Sort
    const priorityWeights = { high: 3, medium: 2, normal: 1, low: 0 };
    if (sortBy === "due_asc") {
      result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    } else if (sortBy === "due_desc") {
      result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (sortBy === "priority_desc") {
      result.sort(
        (a, b) =>
          (priorityWeights[b.priority?.toLowerCase()] || 0) -
          (priorityWeights[a.priority?.toLowerCase()] || 0)
      );
    } else if (sortBy === "title_asc") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [tasksList, activeFilter, sortBy, user]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const now = moment().startOf("day");
    return {
      all: tasksList.length,
      high: tasksList.filter((t) => t.priority?.toLowerCase() === "high").length,
      due_soon: tasksList.filter((t) => {
        if (!t.date || t.stage === "completed") return false;
        return moment(t.date).startOf("day").diff(now, "days") <= 7;
      }).length,
      my_tasks: tasksList.filter((t) =>
        t.team?.some((m) =>
          typeof m === "object" ? m._id === user?._id : m === user?._id
        )
      ).length,
      has_assets: tasksList.filter((t) => t.assets?.length > 0 || t.links?.length > 0).length,
    };
  }, [tasksList, user]);

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d202d]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight">
              {status ? `${status} Tasks` : "Workspace Tasks"}
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-blue-600 dark:text-blue-400 tabular-nums">
              {filteredAndSortedTasks.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Orchestrate sprints, stage transitions, and execution deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Architectural View Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d]">
            <button
              onClick={() => setSelectedView("kanban")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer",
                selectedView === "kanban"
                  ? "bg-white dark:bg-[#181c2a] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-[#282c3f]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setSelectedView("table")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer",
                selectedView === "table"
                  ? "bg-white dark:bg-[#181c2a] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/90 dark:border-[#282c3f]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Instant Filter Chips & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border flex items-center gap-1.5",
              activeFilter === "all"
                ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <span>All Tasks</span>
            <span className="text-[10px] opacity-80 tabular-nums">({counts.all})</span>
          </button>

          <button
            onClick={() => setActiveFilter("high")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border flex items-center gap-1.5",
              activeFilter === "high"
                ? "bg-rose-600 text-white border-rose-600 font-bold shadow-xs"
                : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-rose-500"
            )}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>High Priority</span>
            <span className="text-[10px] opacity-80 tabular-nums">({counts.high})</span>
          </button>

          <button
            onClick={() => setActiveFilter("due_soon")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border flex items-center gap-1.5",
              activeFilter === "due_soon"
                ? "bg-amber-600 text-white border-amber-600 font-bold shadow-xs"
                : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-amber-500"
            )}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Due Soon</span>
            <span className="text-[10px] opacity-80 tabular-nums">({counts.due_soon})</span>
          </button>

          <button
            onClick={() => setActiveFilter("my_tasks")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border flex items-center gap-1.5",
              activeFilter === "my_tasks"
                ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-blue-500"
            )}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Assigned to Me</span>
            <span className="text-[10px] opacity-80 tabular-nums">({counts.my_tasks})</span>
          </button>

          <button
            onClick={() => setActiveFilter("has_assets")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border flex items-center gap-1.5",
              activeFilter === "has_assets"
                ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                : "bg-white dark:bg-[#10121a] border-slate-200 dark:border-[#1d202d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Paperclip className="w-3.5 h-3.5 text-slate-400" />
            <span>With Files</span>
            <span className="text-[10px] opacity-80 tabular-nums">({counts.has_assets})</span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
          >
            <option value="default">Sort: Default Order</option>
            <option value="due_asc">Sort: Due Date (Soonest)</option>
            <option value="due_desc">Sort: Due Date (Latest)</option>
            <option value="priority_desc">Sort: Priority (High → Low)</option>
            <option value="title_asc">Sort: Title (A → Z)</option>
          </select>
        </div>
      </div>

      {/* Active Search Filter Banner */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/80 dark:bg-[#101728] border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-mono">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              Showing search results matching: <strong>&ldquo;{searchQuery}&rdquo;</strong>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear search filter</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loading />
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <div className="p-12 rounded-xl bg-white dark:bg-[#10121a] border border-dashed border-slate-200 dark:border-[#1d202d] text-center space-y-3">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No tasks match your current filter
          </p>
          <p className="text-xs text-slate-400">
            {activeFilter !== "all"
              ? "Try switching your filter chip back to 'All Tasks'."
              : "Create your first task to get started."}
          </p>
          {activeFilter !== "all" ? (
            <button
              onClick={() => setActiveFilter("all")}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={() => setOpenCreate(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-mono text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Create New Task
            </button>
          )}
        </div>
      ) : (
        <div className="w-full">
          {selectedView === "kanban" ? (
            <BoardView tasks={filteredAndSortedTasks} />
          ) : (
            <div className="bg-white dark:bg-[#10121a] rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm p-4 sm:p-6">
              <Table tasks={filteredAndSortedTasks} />
            </div>
          )}
        </div>
      )}

      <AddTask open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default Tasks;
