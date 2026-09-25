import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Kanban,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  CircleDot,
  UserCheck,
  Search,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import Loading from "../components/Loader";
import BoardView from "../components/BoardView";
import Table from "../components/Table.jsx";
import AddTask from "../components/tasks/AddTask.jsx";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice.js";
import clsx from "clsx";

const MyTasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedView, setSelectedView] = useState("kanban");
  const [openCreate, setOpenCreate] = useState(false);

  const searchQuery = searchParams.get("search") || "";

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "",
    search: searchQuery,
  });

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const allTasks = data?.tasks || [];

  // Filter tasks where the current user is assigned
  const myTasksList = allTasks.filter((task) => {
    if (!task?.team || task.team.length === 0) return false;
    return task.team.some(
      (m) =>
        m._id === user?._id ||
        m.email === user?.email ||
        m.name?.toLowerCase() === user?.name?.toLowerCase()
    );
  });

  const completedCount = myTasksList.filter((t) => t.stage === "completed").length;
  const inProgressCount = myTasksList.filter((t) => t.stage === "in progress").length;
  const todoCount = myTasksList.filter((t) => t.stage === "todo").length;
  const overdueCount = myTasksList.filter(
    (t) => t.date && new Date(t.date) < new Date() && t.stage !== "completed"
  ).length;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1d202d]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Assigned Tasks
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#1d202d] bg-white dark:bg-[#10121a] text-blue-600 dark:text-blue-400 tabular-nums">
              {myTasksList.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Focused personal queue for {user?.name || "your account"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
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

      {/* Personal Velocity KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CircleDot className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">To Do</p>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">{todoCount}</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">In Progress</p>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">Completed</p>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#10121a] border border-slate-200 dark:border-[#1d202d] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">Overdue</p>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Search Filter Banner */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/80 dark:bg-[#101728] border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 font-mono">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            <span>
              Query Filter: <strong className="font-bold font-mono">"{searchQuery}"</strong>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
            title="Clear filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Content: Board or Table */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loading />
        </div>
      ) : myTasksList.length === 0 ? (
        <div className="p-12 rounded-xl bg-white dark:bg-[#10121a] border border-dashed border-slate-200 dark:border-[#1d202d] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#141722] text-slate-400 mx-auto flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No tasks assigned to you
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono max-w-sm mx-auto">
              You are all caught up! You can pick up open tasks from the workspace board or assign tasks to yourself.
            </p>
          </div>
        </div>
      ) : selectedView === "kanban" ? (
        <BoardView tasks={myTasksList} />
      ) : (
        <div className="bg-white dark:bg-[#10121a] rounded-xl border border-slate-200 dark:border-[#1d202d] shadow-sm overflow-hidden p-4 sm:p-6 transition-colors">
          <Table tasks={myTasksList} />
        </div>
      )}

      <AddTask open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default MyTasks;
